import {
    NodeType, RoadType
} from "../model/LandNode"


export default class CH {

    static getRoadTypeByNodeType(type: NodeType): RoadType {
        
        if (this.isBaseNodeType(type, NodeType.HOME)) {
            return RoadType.HOME
        } else if (this.isBaseNodeType(type, NodeType.SD)) {
            return RoadType.SD
        } else if (this.isBaseNodeType(type, NodeType.CY)) {
            return RoadType.CY
        } else if (this.isBaseNodeType(type, NodeType.HOME_WALL)) {
            return RoadType.HOME_WALL
        }
        return type
        
    }

    
    static getRoadValueByNodeType(type:NodeType):number {
        if (type == NodeType.cantGo) {
            return 1
        } else if (type == NodeType.trans) {
            return 2
        } else if (type == NodeType.canGo) {
            return 0
        } 
        return 0
    }





    static getResLevelByNodeType(type) {
        if (type < 100) {
            return 1
        } else {
            return type % 100
        }
    }


    static randomNodeType() {
        
        let home5 = 0
        let home4 = home5 + 0
        let home3 = home4 + 0
        let home2 = home3 + 0
        let home1 = home2 + 0

        let sd5 = home1 + 50
        let sd4 = sd5 + 50
        let sd3 = sd4 + 50
        let sd2 = sd3 + 50
        let sd1 = sd2 + 50

        let cy5 = sd1 + 50
        let cy4 = cy5 + 50
        let cy3 = cy4 + 50
        let cy2 = cy3 + 50
        let cy1 = cy2 + 50

        let long1 = cy1 + 100

        let type
        let r = Math.random() * 1000
        if (r < home5) {
            type = NodeType.HOME5
        } else if (r < home4) {
            type = NodeType.HOME4
        } else if (r < home3) {
            type = NodeType.HOME3
        } else if (r < home2) {
            type = NodeType.HOME2
        } else if (r < home1) {
            type = NodeType.HOME
        } else if (r < sd5) {
            type = NodeType.SD5
        } else if (r < sd4) {
            type = NodeType.SD4
        } else if (r < sd3) {
            type = NodeType.SD3
        } else if (r < sd2) {
            type = NodeType.SD2
        } else if (r < sd1) {
            type = NodeType.SD
        } else if (r < cy5) {
            type = NodeType.CY5
        } else if (r < cy4) {
            type = NodeType.CY4
        } else if (r < cy3) {
            type = NodeType.CY3
        } else if (r < cy2) {
            type = NodeType.CY2
        } else if (r < cy1) {
            type = NodeType.CY
        } else if (r < long1) {
            type = NodeType.LONG1
        } else if (type == NodeType.trans) {
            type = NodeType.trans
        } else {
            type = NodeType.canGo
        }
        return type
    }


    static getWallType(type) {
        let Lv = this.getResLevelByNodeType(type)
        if (Lv == 1) {
            return NodeType.HOME_WALL1
        } else if (Lv == 2) {
            return NodeType.HOME_WALL2
        } else if (Lv == 3) {
            return NodeType.HOME_WALL3
        } else if (Lv == 4) {
            return NodeType.HOME_WALL4
        } else if (Lv == 5) {
            return NodeType.HOME_WALL5
        } else {
            return NodeType.HOME_WALL1
        }

    }

    static changeMapDataValue(value) {
        if (value == 0) {
            value = 1 // 不可走
        } else if (value == 1) {
            value = 0 //可走
        }
        return value

    }
    
    static isBaseNodeType(type, baseType) {
        if (type < 100) {
            return type === baseType
        } else {
            return (Math.floor(type / 100) === baseType)
        }
    }
}