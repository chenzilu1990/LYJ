import { MovePlyer, PlayerAttack, PlayerMove, MoveEnd, PlayerPos, TransMap } from "../../game/GameSystem";

/** 发送自己的输入 */
export interface MsgClientInput {
    sn: number,
    inputs: ClientInput[]
};

export type ClientInput = Omit<PlayerMove, 'playerId'> | Omit<PlayerAttack, 'playerId'> | Omit<MovePlyer, 'playerId'> | Omit<MoveEnd, 'playerId'> |  Omit<PlayerPos, 'playerId'> | Omit<TransMap, 'playerId'>;