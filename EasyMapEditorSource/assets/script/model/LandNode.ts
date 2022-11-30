import RoadNode from "../map/road/RoadNode"
import MapRoadUtils from "../map/road/MapRoadUtils"

import LandView from "../view/LandView"

export enum NodeType {
    cantGo = 1,
    canGo = 0,
    trans = 2,

    HOME = 3,
    HOME2 = 302, 
    HOME3 = 303, 
    HOME4 = 304, 
    HOME5 = 305, 
    HOME6 = 306, 

    SD  = 4,
    SD2 = 402,
    SD3 = 403,
    SD4 = 404,
    SD5 = 405,
    SD6 = 406,

    CY = 5,
    CY2 = 502,
    CY3 = 503,
    CY4 = 504,
    CY5 = 505,
    CY6 = 506,
    
    HOME_WALL = 6,
    HOME_WALL1 = 601,
    HOME_WALL2 = 602,
    HOME_WALL3 = 603,
    HOME_WALL4 = 604,
    HOME_WALL5 = 605,

}


export enum RoadType {
    canGo = 0,
    cantGo = 1,
    trans = 2,
    HOME = 3,
    SD  = 4,
    CY = 5,
    HOME_WALL = 6,
}

export enum BelongType {
    mine = 0,
    enemy = 1,
    noOwner = 2
}


export default interface LandNode extends RoadNode {

    belongType: BelongType 

    nodeType: NodeType

    level: number

    isShowHome : Boolean 
    
    roadType: RoadType
}
