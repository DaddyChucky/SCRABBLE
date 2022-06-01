import { VirtualPlayer } from '@app/classes/virtual-player';
import { container } from '@app/inversify.config';
import { EndGameManagementService } from '@app/services/end-game-management/end-game-management.service';
import { GamesLogsService } from '@app/services/games-logs/games-logs.service';
import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { PointCalculatorService } from '@app/services/point-calculator/point-calculator.service';
import { QuestVerifyService } from '@app/services/quest-verify/quest-verify.service';
import { VPManagementService } from '@app/services/vp-management/vp-management.service';
import Types from '@app/types';
import { MultiplayerLobby } from '@common/model/lobby';
import { Player } from '@common/model/player';
import { Quest } from '@common/model/quest';
import { QuestName } from '@common/model/quest-name';
import { Tile } from '@common/model/tile';
import { VirtualPlayerDifficulty } from '@common/model/virtual-player-difficulty';
import { WordValidation } from '@common/model/word-validation';
import { Service } from 'typedi';
import * as serviceConstants from './turn-manager.service.constants';

@Service()
export class TurnManagerService {
    private questVerifyService: QuestVerifyService;
    private readonly gameLogsService: GamesLogsService;
    private readonly vpManagementService: VPManagementService;

    constructor(
        private readonly letterBagService: LetterBagService,
        private readonly endGameManagement: EndGameManagementService,
        private pointCalculatorService: PointCalculatorService,
    ) {
        this.gameLogsService = container.get<GamesLogsService>(Types.GamesLogsService);
        this.vpManagementService = container.get<VPManagementService>(Types.VPManagementService);
    }

    createGame(lobbyID: string): void {
        this.gameLogsService.addStartingDate(lobbyID);
        this.endGameManagement.turnPassedNb = serviceConstants.DEFAULT_NUMBER_PASS_TURN;
    }

    switchTurn(lobby: MultiplayerLobby): void {
        this.endGameManagement.turnPassedNb = serviceConstants.DEFAULT_NUMBER_PASS_TURN;
        this.changeTurn(lobby);
    }

    passTurn(lobby: MultiplayerLobby): void {
        this.endGameManagement.turnPassedNb += serviceConstants.INCREMENT;
        if (this.isGameEnd(lobby)) this.endGame(lobby);
        else this.changeTurn(lobby);
    }

    removeTilesFromPlayerTemporary(lobby: MultiplayerLobby, word: string): void {
        const activePlayer: Player | undefined = this.getActivePlayer(lobby.playerList);
        if (!activePlayer) return;
        this.letterBagService.removeLetters(activePlayer, word);
    }

    giveBackTilesOfPlayer(lobby: MultiplayerLobby, word: string): void {
        const activePlayer: Player | undefined = this.getActivePlayer(lobby.playerList);
        if (!activePlayer) return;
        this.letterBagService.giveBackLetters(activePlayer, word);
    }

    removeAndRefillTiles(lobby: MultiplayerLobby, word: string): void {
        const activePlayer: Player | undefined = this.getActivePlayer(lobby.playerList);
        if (!activePlayer) return;
        this.letterBagService.removeLetters(activePlayer, word);
        this.letterBagService.refillLetters(lobby.letterBag, activePlayer);
    }

    setPointCalculator(calculatorService: PointCalculatorService): void {
        this.pointCalculatorService = calculatorService;
    }

    checkWordValidationAndPoints(wordValidation: WordValidation): boolean {
        this.changeWeightOfBlankTile(wordValidation);
        this.pointCalculatorService.update(wordValidation.parsedInfo.scrabbleGrid, wordValidation.tiles, wordValidation.parsedInfo.direction);
        this.pointCalculatorService.checkAllWordsFormed();
        return this.pointCalculatorService.newPoints !== 0;
    }

    addPointsToActivePlayer(lobby: MultiplayerLobby): void {
        const activePlayer: Player | undefined = this.getActivePlayer(lobby.playerList);
        if (!activePlayer) return;
        activePlayer.score += this.pointCalculatorService.newPoints;
    }

    getActivePlayer(playerList: Player[]): Player | undefined {
        return playerList.find((player) => player.isTurn);
    }

    isGameEnd(lobby: MultiplayerLobby): boolean {
        return this.endGameManagement.isEndGame(lobby);
    }

    messageEndGame(lobby: MultiplayerLobby): string {
        return this.endGameManagement.messageToSend(lobby);
    }

    messageletterBagEndGame(lobby: MultiplayerLobby): string {
        return this.endGameManagement.letterBagSizeMessage(lobby.letterBag);
    }

    endGame(lobby: MultiplayerLobby): void {
        lobby.playerList.forEach((player) => {
            player.isTurn = false;
        });
        this.endGameManagement.endGameVerification(lobby);
    }

    verifyQuestCompletion(lobby: MultiplayerLobby, wordValidation: WordValidation, timer: number | undefined): void {
        if (!this.questVerifyService) this.questVerifyService = new QuestVerifyService(lobby.dictionary);
        if (!timer) return;
        const activePlayer: Player | undefined = this.getActivePlayer(lobby.playerList);
        this.verifyPrivateQuests(activePlayer, wordValidation, timer);
        this.verifyPublicQuests(activePlayer, wordValidation, lobby.sideQuests, timer);
    }

    async resignation(lobby: MultiplayerLobby, playerId: string): Promise<boolean> {
        const playerQuit: Player | undefined = lobby.playerList.find((player) => player.playerId === playerId);
        if (!playerQuit) return false;
        const leavingPlayerIndex: number = lobby.playerList.findIndex((player) => player.playerId === playerId);
        lobby.playerList[leavingPlayerIndex] = {
            name: await this.vpManagementService.randomName(
                lobby.playerList[leavingPlayerIndex ? serviceConstants.INDEX_0 : serviceConstants.INDEX_1].name,
            ),
            score: playerQuit.score,
            playerId: serviceConstants.VIRTUAL_PLAYER_ID,
            tiles: playerQuit.tiles,
            isTurn: playerQuit.isTurn,
            host: false,
            sideQuest: playerQuit.sideQuest,
            difficulty: VirtualPlayerDifficulty.BEGINNER,
        } as VirtualPlayer;
        if (leavingPlayerIndex === serviceConstants.INDEX_0) lobby.playerList[serviceConstants.INDEX_1].host = true;
        else if (leavingPlayerIndex === serviceConstants.INDEX_1) lobby.playerList[serviceConstants.INDEX_0].host = true;
        if (playerQuit.isTurn) this.changeTurn(lobby);
        return playerQuit.isTurn;
    }

    private verifyPrivateQuests(activePlayer: Player | undefined, wordValidation: WordValidation, timer: number): void {
        if (!(activePlayer?.sideQuest && !activePlayer.sideQuest.isAccomplished)) return;
        if (activePlayer.sideQuest.name === QuestName.FIVE_SECONDS_MOVE) this.questVerifyService.setTimer(timer);
        this.questVerifyService.updateQuest(activePlayer?.sideQuest, wordValidation);
        activePlayer.score += this.questVerifyService.checkQuestsAndReturnPoints();
    }

    private verifyPublicQuests(
        activePlayer: Player | undefined,
        wordValidation: WordValidation,
        publicQuests: Quest[] | undefined,
        timer: number,
    ): void {
        if (!publicQuests) return;
        for (const publicQuest of publicQuests) {
            if (publicQuest.isAccomplished) continue;
            if (publicQuest.name === QuestName.FIVE_SECONDS_MOVE) this.questVerifyService.setTimer(timer);
            this.questVerifyService.updateQuest(publicQuest, wordValidation);
            if (activePlayer) activePlayer.score += this.questVerifyService.checkQuestsAndReturnPoints();
        }
    }

    private changeWeightOfBlankTile(wordValidation: WordValidation): void {
        if (!wordValidation.parsedInfo.completeWord) return;
        for (const letter of wordValidation.parsedInfo.completeWord)
            if (letter.toUpperCase() === letter) {
                const blankTile: Tile | undefined = wordValidation.tiles.newTilesToAdd.find((tile) => tile.name === letter);
                if (blankTile) blankTile.weight = 0;
            }
    }

    private changeTurn(lobby: MultiplayerLobby): void {
        lobby.playerList.forEach((player) => {
            player.isTurn = !player.isTurn;
        });
    }
}
