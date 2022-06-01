/* eslint-disable dot-notation */
import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { SideQuestProviderService } from '@app/services/side-quest-provider/side-quest-provider.service';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { MultiplayerLobby } from '@common/model/lobby';
import { LobbyInfo } from '@common/model/lobby-info';
import { LobbyStatus } from '@common/model/lobby-status';
import { LobbyType } from '@common/model/lobby-type';
import { Player } from '@common/model/player';
import { Quest } from '@common/model/quest';
import { Tile } from '@common/model/tile';
import { expect } from 'chai';
import { Guid } from 'guid-typescript';
import { LobbyManagementService } from './lobby-management.service';
import * as serviceConstants from './lobby-management.service.constants';
import * as specConstants from './lobby-management.service.spec.constants';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Sinon = require('sinon');

describe('LobbyManagement service', () => {
    let lobbyService: LobbyManagementService;
    let dict: string;
    let lobbyType: LobbyType;
    const lobbyInfo: LobbyInfo = new LobbyInfo();

    beforeEach(async () => {
        lobbyService = new LobbyManagementService(new LetterBagService(), new SideQuestProviderService());
        dict = 'ENGLISH';
        lobbyType = LobbyType.CLASSIC;
        specConstants.EXPECTED_LOBBY.dictionary = dict;
        specConstants.EXPECTED_LOBBY.lobbyType = lobbyType;
        specConstants.EXPECTED_LOBBY.playerList = specConstants.PLAYER_LIST;
        specConstants.EXPECTED_LOBBY.baseTimerValue = specConstants.EXPECTED_TIME;
        specConstants.EXPECTED_LOBBY.lobbyStatus = specConstants.EXPECTED_LOBBY_STATUS;
        specConstants.EXPECTED_LOBBY.lobbyId = Guid.create().toString();
        lobbyInfo.dictionary = specConstants.EXPECTED_LOBBY.dictionary;
        lobbyInfo.lobbyType = lobbyType;
        lobbyInfo.player = specConstants.PLAYER1;
        lobbyInfo.lobbyId = specConstants.EXPECTED_LOBBY.lobbyId;
        lobbyInfo.timerValue = specConstants.EXPECTED_LOBBY.baseTimerValue;
    });

    it('createLobby should push new lobby with player to LobbyList', () => {
        const receivedLobby: MultiplayerLobby = lobbyService.createLobby(specConstants.PLAYER1, lobbyInfo);
        specConstants.EXPECTED_LOBBY.lobbyId = receivedLobby.lobbyId;
        expect(lobbyService.lobbyList[0].dictionary).to.be.equal(specConstants.EXPECTED_LOBBY.dictionary);
        expect(lobbyService.lobbyList[0].lobbyId).to.be.equal(specConstants.EXPECTED_LOBBY.lobbyId);
        expect(lobbyService.lobbyList[0].lobbyStatus).to.be.equal(specConstants.EXPECTED_LOBBY.lobbyStatus);
        expect(lobbyService.lobbyList[0].baseTimerValue).to.be.equal(specConstants.EXPECTED_LOBBY.baseTimerValue);
        expect(lobbyService.lobbyList[0].lobbyType).to.be.equal(specConstants.EXPECTED_LOBBY.lobbyType);
        expect(lobbyService.lobbyList[0].playerList[0]).to.be.equal(specConstants.EXPECTED_LOBBY.playerList[0]);
    });

    it('joinLobby should add the player to the right lobby and set the status to COMPLETED', () => {
        Sinon.stub(lobbyService, 'isSoloPlayerInList' as never).returns(false);
        const receivedLobby: MultiplayerLobby = lobbyService.createLobby(specConstants.PLAYER1, lobbyInfo);
        lobbyService.joinLobby(specConstants.PLAYER2, receivedLobby.lobbyId);
        expect(lobbyService.lobbyList[0].playerList[1]).to.be.equal(specConstants.PLAYER2);
        expect(lobbyService.lobbyList[0].lobbyStatus).to.be.equal(LobbyStatus.COMPLETED);
    });

    it('joinLobby should add the player to the right lobby and set the status to COMPLETED', () => {
        Sinon.stub(lobbyService, 'isSoloPlayerInList' as never).returns(true);
        Sinon.stub(lobbyService, 'createLobby').callsFake(() => {
            lobbyService.lobbyList.push(specConstants.JOIN_LOBBY);
            return specConstants.JOIN_LOBBY;
        });
        const receivedLobby: MultiplayerLobby = lobbyService.createLobby(specConstants.PLAYER1, lobbyInfo);
        lobbyService.joinLobby(specConstants.PLAYER2, receivedLobby.lobbyId);
        expect(lobbyService.lobbyList[0].playerList[1]).to.be.equal(specConstants.PLAYER2);
    });

    it('joinLobby should not add the player to the lobby if playerList.length >=2', () => {
        const receivedLobby: MultiplayerLobby = lobbyService.createLobby(specConstants.PLAYER1, lobbyInfo);
        lobbyService.joinLobby(specConstants.PLAYER2, receivedLobby.lobbyId);
        lobbyService.joinLobby(specConstants.PLAYER3, receivedLobby.lobbyId);
        expect(lobbyService.lobbyList[0].playerList.length).to.be.equal(2);
        expect(lobbyService.lobbyList[0].playerList[0]).to.be.equal(specConstants.PLAYER1);
        expect(lobbyService.lobbyList[0].playerList[1]).to.be.equal(specConstants.PLAYER2);
    });

    it('joinLobby should not call initializePlayers if no lobby found', () => {
        const spy: Sinon.SinonSpy<unknown[], unknown> = Sinon.spy(lobbyService, 'initializePlayers' as never);
        lobbyService.joinLobby(specConstants.PLAYER2, specConstants.FAKE_LOBBY_ID);
        expect(spy.notCalled);
    });

    it('createLobby should call isUniqueHostLobby once', () => {
        const mock: Sinon.SinonMock = Sinon.mock(lobbyService);
        mock.expects('isUniqueHostLobby').once();
        lobbyService.createLobby(specConstants.PLAYER1, lobbyInfo);
        mock.verify();
    });

    it('createLobby should return existing game if player has one', () => {
        const receivedLobby: MultiplayerLobby = lobbyService.createLobby(specConstants.PLAYER1, lobbyInfo);
        const secondLobby: MultiplayerLobby = lobbyService.createLobby(specConstants.PLAYER1, lobbyInfo);
        expect(receivedLobby).to.be.equal(secondLobby);
    });

    it('filterAliveLobbies should change the status of empty lobbies', () => {
        const receivedLobby: MultiplayerLobby = lobbyService.createLobby(specConstants.PLAYER1, lobbyInfo);
        receivedLobby.playerList = [];
        lobbyService.filterAliveLobbies();
        expect(receivedLobby.lobbyStatus).to.be.equal(LobbyStatus.DELETED);
    });

    it('filterAliveLobbies should not change a status if no lobby is empty', () => {
        const receivedLobby: MultiplayerLobby = lobbyService.createLobby(specConstants.PLAYER1, lobbyInfo);
        lobbyService.filterAliveLobbies();
        expect(receivedLobby.lobbyStatus).to.not.be.equal(LobbyStatus.DELETED);
    });

    it('getLobby should return a lobby when it exists', () => {
        const receivedLobby: MultiplayerLobby = lobbyService.createLobby(specConstants.PLAYER1, lobbyInfo);
        const myId: string = receivedLobby.lobbyId;
        expect(lobbyService.getLobby(myId)).to.be.equal(receivedLobby);
    });

    it('deleteLobby should change the status of the specific lobby', () => {
        const receivedLobby: MultiplayerLobby = lobbyService.createLobby(specConstants.PLAYER1, lobbyInfo);
        const myId: string = receivedLobby.lobbyId;
        lobbyService.deleteLobby(myId);
        expect(receivedLobby.lobbyStatus).to.be.equal(LobbyStatus.DELETED);
    });

    it('deleteLobby should not change status of non-existent lobby ', () => {
        const receivedLobby: MultiplayerLobby = lobbyService.createLobby(specConstants.PLAYER1, lobbyInfo);
        lobbyService.deleteLobby('nonexistant');
        expect(lobbyService.lobbyList.length).to.be.equal(1);
        expect(receivedLobby.lobbyStatus).to.not.be.equal(LobbyStatus.DELETED);
    });

    it('getLobby should return undefined when no lobby', () => {
        expect(lobbyService.getLobby('myId')).to.be.equal(undefined);
    });

    it('availableLobbies should return a list of the available lobbies (not full)', () => {
        const receivedLobby: MultiplayerLobby = lobbyService.createLobby(specConstants.PLAYER1, lobbyInfo);
        lobbyService.joinLobby(specConstants.PLAYER2, receivedLobby.lobbyId);
        lobbyService.createLobby(specConstants.PLAYER3, lobbyInfo);
        expect(lobbyService.availableLobbies().length).to.be.equal(1);
        expect(lobbyService.availableLobbies()[0]).to.be.equal(lobbyService.lobbyList[1]);
    });

    it('availableLobbies should return a list of the available lobbies (not deleted)', () => {
        const receivedLobby: MultiplayerLobby = lobbyService.createLobby(specConstants.PLAYER1, lobbyInfo);
        lobbyService.deleteLobby(receivedLobby.lobbyId);
        lobbyService.createLobby(specConstants.PLAYER3, lobbyInfo);
        expect(lobbyService.availableLobbies().length).to.be.equal(1);
        expect(lobbyService.availableLobbies()[0]).to.be.equal(lobbyService.lobbyList[1]);
    });

    it('isPLayerInLobby should return true if playerId in lobby', () => {
        specConstants.EXPECTED_LOBBY.playerList = specConstants.PLAYER_LIST_WITH_2_PLAYER;
        const isPlayer1InLobby: boolean = lobbyService.isPlayerInLobby(specConstants.EXPECTED_LOBBY, specConstants.PLAYER1.playerId);
        const isPlayer2InLobby: boolean = lobbyService.isPlayerInLobby(specConstants.EXPECTED_LOBBY, specConstants.PLAYER2.playerId);
        expect(isPlayer1InLobby).to.be.equal(true);
        expect(isPlayer2InLobby).to.be.equal(true);
    });

    it('isPLayerInLobby should return false if playerId not in lobby', () => {
        specConstants.EXPECTED_LOBBY.playerList = specConstants.PLAYER_LIST_WITH_2_PLAYER;
        const isPlayer3InLobby: boolean = lobbyService.isPlayerInLobby(specConstants.EXPECTED_LOBBY, specConstants.PLAYER3.playerId);
        expect(isPlayer3InLobby).to.be.equal(false);
    });

    it('getLobbyOfPlayer should call isPlayerInLobby', () => {
        lobbyService.lobbyList.push(specConstants.EXPECTED_LOBBY);
        const mock: Sinon.SinonMock = Sinon.mock(lobbyService);
        mock.expects('isPlayerInLobby');
        lobbyService.getLobbyOfPlayer(specConstants.PLAYER1.playerId);
        mock.verify();
    });

    it('setPlayerInfo should set the id of player2 in lobby', () => {
        specConstants.EXPECTED_LOBBY.playerList.push(specConstants.PLAYER2);
        lobbyService.lobbyList.push(specConstants.EXPECTED_LOBBY);
        lobbyService.setPlayerInfo(specConstants.EXPECTED_LOBBY.lobbyId, specConstants.PLAYER2.playerId, specConstants.PLAYER3.playerId);
        expect(specConstants.EXPECTED_LOBBY.playerList[1].playerId).to.be.equal(specConstants.PLAYER3.playerId);
    });

    it('setPlayerInfo should do nothing if lobby not found', () => {
        const lobbyListBefore: MultiplayerLobby[] = lobbyService.lobbyList;
        specConstants.EXPECTED_LOBBY.playerList.push(specConstants.PLAYER2);
        lobbyService.lobbyList.push(specConstants.EXPECTED_LOBBY);
        lobbyService.setPlayerInfo(specConstants.FAKE_LOBBY_ID, specConstants.PLAYER3.playerId, specConstants.PLAYER4.playerId);
        expect(lobbyService.lobbyList).to.be.equal(lobbyListBefore);
    });

    it('setPlayerInfo should do nothing if lobby not found', () => {
        specConstants.EXPECTED_LOBBY.playerList.push(specConstants.PLAYER4);
        const player1IdBefore: string = specConstants.EXPECTED_LOBBY.playerList[0].playerId;
        const player2IdBefore: string = specConstants.EXPECTED_LOBBY.playerList[1].playerId;
        lobbyService.lobbyList.push(specConstants.EXPECTED_LOBBY);
        lobbyService.setPlayerInfo(specConstants.EXPECTED_LOBBY.lobbyId, specConstants.PLAYER2_ID, specConstants.PLAYER3_ID);
        expect(specConstants.EXPECTED_LOBBY.playerList[0].playerId).to.be.equal(player1IdBefore);
        expect(specConstants.EXPECTED_LOBBY.playerList[1].playerId).to.be.equal(player2IdBefore);
    });

    it('reject player should remove the player who is not the host', () => {
        Sinon.stub(lobbyService, 'getLobby').returns(specConstants.EXPECTED_LOBBY);
        const receivedLobby: MultiplayerLobby | undefined = lobbyService.rejectPlayer(specConstants.FAKE_LOBBY_ID);
        expect(receivedLobby?.playerList.length).to.be.equal(specConstants.LENGTH_OF_PLAYER_LIST_WITH_ONE_PLAYER);
    });

    it('reject player should return undefined if no lobby find', () => {
        Sinon.stub(lobbyService, 'getLobby').returns(undefined);
        const receivedLobby: MultiplayerLobby | undefined = lobbyService.rejectPlayer(specConstants.FAKE_LOBBY_ID);
        expect(receivedLobby?.playerList.length).to.be.equal(undefined);
    });

    it('reject player should return the lobby unchange if no player is the host', () => {
        Sinon.stub(lobbyService, 'getLobby').returns(specConstants.EXPECTED_LOBBY);
        Sinon.stub(specConstants.EXPECTED_LOBBY.playerList, 'find').returns(undefined);
        const receivedLobby: MultiplayerLobby | undefined = lobbyService.rejectPlayer(specConstants.FAKE_LOBBY_ID);
        expect(receivedLobby).to.be.equal(specConstants.EXPECTED_LOBBY);
    });

    it('exchangeLetter should exchange the letter a of the player tiles', () => {
        const LETTER_BAG_STUB: LetterBag = new LetterBag();
        const player: Player = specConstants.PLAYER5;
        player.tiles = [
            new Tile({ x: 0, y: 0 }, 'A', 1),
            new Tile({ x: 0, y: 0 }, 'B', 1),
            new Tile({ x: 0, y: 0 }, 'C', 1),
            new Tile({ x: 0, y: 0 }, 'D', 1),
            new Tile({ x: 0, y: 0 }, 'E', 1),
            new Tile({ x: 0, y: 0 }, 'F', 1),
            new Tile({ x: 0, y: 0 }, 'G', 1),
        ];
        specConstants.EXPECTED_LOBBY.letterBag = LETTER_BAG_STUB;
        specConstants.EXPECTED_LOBBY.playerList.push(player);
        lobbyService.exchangeLetter(specConstants.EXPECTED_LOBBY, player, 'A');
        expect(player.tiles).to.not.be.equal(specConstants.PLAYER5_TILES);
    });

    it('initializeQuests should give one quest to a player', () => {
        const player: Player = specConstants.PLAYER1;
        player.sideQuest = {} as Quest;
        lobbyService['initializeQuests'](player, specConstants.EXPECTED_LOBBY);
        expect(player.sideQuest).to.not.be.an('undefined');
    });

    it('initializeQuests should give two quests to the lobby', () => {
        const lobby: MultiplayerLobby = specConstants.EXPECTED_LOBBY;
        lobbyService['initializeQuests'](specConstants.PLAYER1, lobby);
        expect(lobby.sideQuests?.length).to.be.equal(specConstants.CORRECT_LENGHT_PUBLIC_QUESTS);
    });

    it('initializeQuests should never give the same quest to a player and to a lobby', () => {
        const player: Player = specConstants.PLAYER1;
        const lobby: MultiplayerLobby = specConstants.EXPECTED_LOBBY;
        for (let i = 0; i < specConstants.LARGE_NUMBER_OF_TRIES; i++) {
            lobbyService['questProviderService'] = new SideQuestProviderService();
            player.sideQuest = {} as Quest;
            lobby.sideQuests = [] as Quest[];
            lobbyService['initializeQuests'](player, lobby);
            expect(lobby.sideQuests?.includes(player.sideQuest)).to.equal(false);
        }
    });

    it('setPlayerEasel should call getLobby', () => {
        const spy: Sinon.SinonSpy<[lobbyId: string], MultiplayerLobby | undefined> = Sinon.spy(lobbyService, 'getLobby');
        lobbyService.setPlayerEasel(specConstants.EXPECTED_LOBBY.lobbyId, specConstants.PLAYER1.playerId, {} as Tile[]);
        expect(spy.called);
    });

    it('setPlayerEasel should set the players tile to the tiles given as parameter', () => {
        const oneTile: Tile[] = [new Tile()] as Tile[];
        specConstants.PLAYER1.tiles = [];
        specConstants.EXPECTED_LOBBY.playerList.push(specConstants.PLAYER1);
        lobbyService.lobbyList.push(specConstants.EXPECTED_LOBBY);
        lobbyService.setPlayerEasel(specConstants.EXPECTED_LOBBY.lobbyId, specConstants.PLAYER1.playerId, oneTile);
        expect(specConstants.PLAYER1.tiles).to.be.eql(oneTile);
    });

    it('isSoloPlayerInList should return true if one player have a virtual player ID', () => {
        expect(lobbyService['isSoloPlayerInList']([specConstants.PLAYER1, { playerId: serviceConstants.VIRTUAL_PLAYER_ID } as Player])).to.equal(
            true,
        );
    });

    it('isSoloPlayerInList should return false if no player have a virtual player ID', () => {
        expect(lobbyService['isSoloPlayerInList']([specConstants.PLAYER1, specConstants.PLAYER2])).to.equal(false);
    });
});
