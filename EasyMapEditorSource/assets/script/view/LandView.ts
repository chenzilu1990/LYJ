
import CH from "../CH/CH";
import  GameConfig  from "../GameConfig"
import RoadNode from "../map/road/RoadNode";
import LandNode, { NodeType, RoadType } from "../model/LandNode"

import { BelongType } from "../model/LandNode"




const { ccclass, property } = cc._decorator;

@ccclass
export default class LandView extends cc.Component {
	
    updateLandNode(node: LandNode) {
        this.landNode = node
    }

    @property(cc.Node)
    grid: cc.Node = null

    @property(cc.Sprite)
    card: cc.Sprite = null

    @property(cc.Animation)
    landRes: cc.Animation = null

    @property(cc.Animation)
    landLong: cc.Animation = null

    @property(cc.Sprite)
    resSprite: cc.Sprite = null

    @property(cc.Sprite)
    moveSprite: cc.Sprite = null

    @property(cc.Node)
    nodeTag: cc.Node = null
    
    
    @property(cc.Node)
    home: cc.Node = null 
    
    @property(cc.Node)
    home1: cc.Node = null 
    
    
    @property(cc.Node)
    home2: cc.Node = null 
    
    
    @property(cc.Node)
    home3: cc.Node = null 
    
    
    @property(cc.Node)
    home4: cc.Node = null 
    
    @property(cc.Node)
    home5: cc.Node = null 

    @property(cc.Label)
    coordinate:cc.Label = null

    private _roadNode: RoadNode = null
   
    set roadNode(value: RoadNode) {
        this.coordinate.string = value.toString()
    }
    
    set nodeType(val: NodeType) {
        if (val === NodeType.CY){
            this.landRes.node.active = true
            this.landLong.node.active = false
            this.landRes.play('CS1')
        } 
        else if(val === NodeType.CY2 ) {
            this.landRes.node.active = true
            this.landLong.node.active = false
            this.landRes.play('CS2')
        } 
        else if(val === NodeType.CY3 ) {
            this.landRes.node.active = true
            this.landLong.node.active = false
            this.landRes.play('CS3')
        } 
        else if(val === NodeType.CY4 ) {
            this.landRes.node.active = true
            this.landLong.node.active = false
            this.landRes.play('CS4')
        } 
        else if(val === NodeType.CY5 ) {
            this.landRes.node.active = true
            this.landRes.play('CS5')
        } 
        else 
        if(val === NodeType.SD ) {
            this.landRes.node.active = true
            this.landLong.node.active = false
            this.landRes.play('SD1')
        } 
        else if(val === NodeType.SD2 ) {
            this.landRes.node.active = true
            this.landLong.node.active = false
            this.landRes.play('SD2')
        } 
        else if(val === NodeType.SD3 ) {
            this.landRes.node.active = true
            this.landLong.node.active = false
            this.landRes.play('SD3')
        } 
        else if(val === NodeType.SD4 ) {
            this.landRes.node.active = true
            this.landLong.node.active = false
            this.landRes.play('SD4')
        } 
        else if(val === NodeType.SD5 ) {
            this.landRes.node.active = true
            this.landLong.node.active = false
            this.landRes.play('SD5')
        } 
        else if (val === NodeType.LONG1){
            this.landRes.node.active = false
            this.landLong.node.active = true
            this.landLong.play('龙1')
        }
        else {
            this.landRes.node.active = false
            this.landLong.node.active = false

        }
    }
    
    private _landNode: LandNode = null
    set landNode(value: LandNode) {

        if (!value) return
        // cc.log("LandView=====value:", value)
        this._landNode = value
        this.node.position = value.position
        this.node.zIndex = cc.macro.MAX_ZINDEX - (value.cx * 100 + value.cy)

        this.moveSprite.node.active = GameConfig.mapDebug
        this.nodeTag.active = false
        
        // this.moveSprite.node.active = true
        
        let lv = CH.getResLevelByNodeType(value.nodeType)
        if (lv >= 2 && CH.isBaseNodeType(value.nodeType, NodeType.HOME)) {
            // if (value.roadType === RoadType.HOME) {
            this.card.node.scale = 2
        } else {
            this.card.node.scale = 1
        }

        if (!CH.isBaseNodeType(value.nodeType, NodeType.HOME_WALL)) {
            // if (value.roadType != RoadType.HOME_WALL ) {
            
            if (value.belongType == BelongType.mine) {
                this.card.setSpriteFrame("card/cardMy")
                this.card.node.active = true
            }
            else if (value.belongType == BelongType.enemy) {
                this.card.setSpriteFrame("card/cardUnaviable")
                this.card.node.active = true
            }
            else {
                this.card.node.active = false
            }
            
        } else {
            this.card.node.active = false
        }

        if (CH.isBaseNodeType(value.nodeType, NodeType.HOME)) {
            // if (value.roadType === RoadType.HOME) {
            
            if (value.isShowHome) {
                this.home.active = true
            
                this.home.children.forEach((child, index) => {
                    if (index === lv - 1) {
                        child.active = true
                    } else {
                        child.active = false
                    }
                })

                
            } else {
                this.home.active = false
            }
            
            this.landRes.node.active = false
            
            
        }

        else if (CH.isBaseNodeType(value.nodeType, NodeType.SD)) {
            // else if (value.roadType === RoadType.SD ) {

            this.home.active = false
            this.landRes.node.active = true
            this.landRes.node.scale = 1
            this.landRes.play("SD" + lv)

        }
        else if (CH.isBaseNodeType(value.nodeType, NodeType.CY)) {
            // else if (value.roadType === RoadType.CY) {

            this.home.active = false
            this.landRes.node.active = true
            this.landRes.play("CS" + lv)
        }
        else if (CH.isBaseNodeType(value.nodeType, NodeType.HOME_WALL)) {
            // else if (value.roadType ===  RoadType.HOME_WALL) {

            this.home.active = false
            this.landRes.node.active = false
            this.landRes.node.scale = 1
        }

        else {
            this.home.active = false
            this.landRes.node.active = false
            this.landRes.node.scale = 1
        }
        
        
        if (value.nodeType == NodeType.cantGo) {
            this.moveSprite.setSpriteFrame("card/unable")
        }
        else if (value.nodeType == NodeType.trans) {
            this.moveSprite.setSpriteFrame("card/trans")
        }
        else {
            this.moveSprite.setSpriteFrame("card/enable")
        }

        if (value.nodeType == NodeType.cantGo) {
            this.grid.active = false
        } else {
            this.grid.active = true
        }
        this.nodeTag.active = value.isTag
        
        
        // this.grid.active = false
        // this.landRes.node.active = false

    }

    get landNode(): LandNode {
        return this._landNode
    }
    
    @property(sp.Skeleton)
    spEffect: sp.Skeleton = null
    showEffect(path, name, transform? : {scale?,offX?,offY?}) {

        this.spEffect.node.active = true
        
        
        this.spEffect.node.x = 0
        this.spEffect.node.y = 0
        this.spEffect.node.scale = 1
        
        this.spEffect.node.scale *= transform?.scale ?? 1
        this.spEffect.node.x += transform?.offX ?? 0
        this.spEffect.node.y += transform?.offY ?? 0
        return new Promise<void>((resovle) => {
            
            cc.resources.load(path, sp.SkeletonData, (err, effect: sp.SkeletonData) => {

                if (err) {
                    cc.error(err)
                } 
                this.spEffect.skeletonData = effect
                this.spEffect.setAnimation(0, name, false)

                
                this.spEffect.setCompleteListener(() => {
                    this.spEffect.node.active = false
                    this.spEffect.node.x = 0
                    this.spEffect.node.y = 0
                    this.spEffect.node.scale = 1
                    resovle()
                })

            })
        })
    }

}
