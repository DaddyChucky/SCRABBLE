import { Player } from '@app/../../../common/model/player';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';

export const NAME_1 = 'Johnny Le Terrible';
export const NAME_2 = 'Monique La Maléfique';
export const PLAYER_1 = { name: NAME_1 } as Player;
export const VIRTUAL_INFO_1: VirtualPlayerInfo = { name: NAME_1 } as VirtualPlayerInfo;
export const VIRTUAL_INFO_2: VirtualPlayerInfo = { name: NAME_2 } as VirtualPlayerInfo;
export const VIRTUAL_INFOS: VirtualPlayerInfo[] = [VIRTUAL_INFO_1, VIRTUAL_INFO_2];
export const RANDOM_NAME = 'THIS_IS_A_RANDOM_NAME';
