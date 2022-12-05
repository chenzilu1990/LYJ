// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PathFindingAgent from "../../map/road/PathFindingAgent";
import RoadNode from "../../map/road/RoadNode";
import TransferDoor from "../transfer/TransferDoor";
import Character, { CharacterState } from "./Character";

const {ccclass, property} = cc._decorator;

/**
 * 玩家
 */
@ccclass
export default class Player extends Character {
    public id:number = 0
    
    // LIFE-CYCLE CALLBACKS:

    public get state():CharacterState
    {
        return this._state;
    }

    public set state(value:CharacterState)
    {
        this._state = value;

        switch(this._state)
        {
            case CharacterState.idle: 
                this.movieClip.begin = 0;
                this.movieClip.end = 6;
            break;

            case CharacterState.walk: 
                this.movieClip.begin = 6;
                this.movieClip.end = 12;
            break;

            case CharacterState.sitdown: 
                this.movieClip.begin = 12;
                this.movieClip.end = 18;
            break;

            case CharacterState.sitdown_walk: 
                this.movieClip.begin = 18;
                this.movieClip.end = 24;
            break;

        }
    }

    // onLoad () {}

    start () {
        super.start();
    }

    // update (dt) {}

    public onCollisionEnter(other:cc.Collider,self:cc.Collider)
    {
        if(other.tag == 2)
        {
            var transferDoor:TransferDoor = other.getComponent(TransferDoor);
            if(transferDoor != null) //脚下触碰到传送门时
            {
                transferDoor.onTriggerEnter(this);
            }
        }
    }

    public onCollisionExit(other:cc.Collider,self:cc.Collider)
    {
        if(other.tag == 2)
        {
            var transferDoor:TransferDoor = other.getComponent(TransferDoor);
            if(transferDoor != null) //脚下触碰到离开传送门时
            {
                transferDoor.onTriggerExit(this);
            }
        }
    }

    // @property(cc.Label)
    // playerName:cc.Label = null
    public setVisiable(visiable:boolean) {
        // this.playerName.node.active = visiable
        this.nameTxt.node.active = visiable
        this.movieClip.node.active = visiable
    }

    public navTo(targetX:number,targetY:number)
    {
        // this.stop()
        //var roadNodeArr:RoadNode[] = PathFindingAgent.instance.seekPath(this.node.position.x,this.node.position.y,targetX,targetY); //如果目标点是障碍，则寻路失败                               //按需求自选
        var roadNodeArr:RoadNode[] = PathFindingAgent.instance.seekPath2(this.node.position.x,this.node.position.y,targetX,targetY);  //如果目标点是障碍，则寻路到里目标点最近的一个非障碍点         //按需求自选

        if(roadNodeArr.length > 0)
        {
            cc.log("fjs=======", roadNodeArr.length)
            this.walkByRoad(roadNodeArr);
        }
    }
}
