// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MapRoadUtils from "../../map/road/MapRoadUtils";
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

    private _preX = 0; _preY = 0;
    public navTo(targetX:number,targetY:number)
    {
        let playerTargetP = MapRoadUtils.instance.getWorldPointByPixel(targetX, targetY)
        // cc.log(playerTargetP.x , this._preX, playerTargetP.y , this._preY)
        if (playerTargetP.x === this._preX && playerTargetP.y === this._preY) return
        this._preX = playerTargetP.x
        this._preY = playerTargetP.y
        // this.stop()
        super.navTo(targetX, targetY)
    }
}
