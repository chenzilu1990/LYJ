export interface PlayerState {
    id: number,
    // 位置
    pos: { x: number, y: number },
    // 晕眩结束时间
    dizzyEndTime?: number,

    targetX:number, 
    targetY:number,
    moving:boolean,
    x:number, 
    y:number,
    mapId:string,
    spawnId:number
}