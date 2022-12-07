import { ApiCallWs } from "tsrpc";
import { roomInstance } from "..";
import { ReqJoin, ResJoin } from "../shared/protocols/PtlJoin";

export async function ApiJoin(call: ApiCallWs<ReqJoin, ResJoin>) {
    let playerInfo = roomInstance.join(call.req, call.conn);

    call.succ({
        playerId: playerInfo.playerId,
        players: roomInstance.players,
        gameState: roomInstance.gameSystem.state,
        playerInfo:playerInfo
    })
}