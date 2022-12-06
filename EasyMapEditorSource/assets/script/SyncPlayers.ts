// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Joystick from "../scripts/Joystick";
import { GameManager } from "../scripts/models/GameManager";

import Main from "./Main";
import { MapLoadModel } from "./map/base/MapLoadModel";
import Charactor from "./map/charactor/Charactor";
import EntityLayer from "./map/layer/EntityLayer";
import MapRoadUtils from "./map/road/MapRoadUtils";
import Point from "./map/road/Point";
import RoadNode from "./map/road/RoadNode";
import SceneMap from "./SceneMap";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Camera)
    private camera:cc.Camera = null;

    @property(EntityLayer)
    public entityLayer: EntityLayer = null;

    @property(cc.Prefab)
    playerPrefab:cc.Prefab = null

    @property(Joystick)
    joyStick: Joystick = null

    @property(SceneMap)
    sceneMap: SceneMap = null
    // LIFE-CYCLE CALLBACKS:
    private _selfSpeed?: cc.Vec2;
    public gameManager!: GameManager;
    public player:Charactor = null;
    onLoad () {


        this.joyStick.options = {

            onOperate: v => {
                // cc.log(v)
                if (!this._selfSpeed) {
                    this._selfSpeed = new cc.Vec2();
                }
                this._selfSpeed = cc.v2(v.x, v.y);
            },
            
            onOperateEnd: () => {
                this._selfSpeed = undefined;
            }
        }
    }

    start () {
        this.gameManager = Main.instance.gameManager
        this.node.on(cc.Node.EventType.TOUCH_START,this.onMapMouseDown,this);
    }



    private _targetPos:cc.Vec2
    public onMapMouseDown(event:cc.Event.EventTouch):void
    {

        //var pos = this.node.convertToNodeSpaceAR(event.getLocation());
        var pos = this.camera.node.position.add(event.getLocation());

        this._targetPos = pos

        // this.movePlayer(this.gameManager.selfPlayerId, pos.x, pos.y);


    }

    private targetPos:cc.Vec2
    public followPlayer(dt:number)
    {
        if (!this.player) return
        // cc.log(this.player.node.x, this.player.node.y)
        this.targetPos = this.player.node.position.sub(cc.v2(cc.visibleRect.width / 2,cc.visibleRect.height / 2));

        if(this.targetPos.x > this.sceneMap. mapParams.mapWidth - cc.visibleRect.width)
        {
            this.targetPos.x = this.sceneMap. mapParams.mapWidth - cc.visibleRect.width;
        }else if(this.targetPos.x < 0)
        {
            this.targetPos.x = 0;
        }    

        if(this.targetPos.y > this.sceneMap. mapParams.mapHeight - cc.visibleRect.height)
        {
            this.targetPos.y = this.sceneMap. mapParams.mapHeight - cc.visibleRect.height;
        }else if(this.targetPos.y < 0)
        {
            this.targetPos.y = 0;
        }
        

        //摄像机平滑跟随
        this.camera.node.position.lerp(this.targetPos,dt * 2.0,this.targetPos);
        this.camera.node.position = this.targetPos;

        if(this.sceneMap. mapParams.mapLoadModel == MapLoadModel.slices)
        {
            this.sceneMap. mapLayer.loadSliceImage(this.targetPos.x,this.targetPos.y);
        }
        // this.mapLayer.loadLandViews(this.player.node.x, this.player.node.y)
        this.sceneMap. cardLayer.loadLandViews(this.player.node.x, this.player.node.y)
        
    }
    @property()
    public isFollowPlayer:boolean = true;
    update (dt) {
        
        if(this.isFollowPlayer)
        {
            this.followPlayer(dt);

            //this.camera.node.position = this.player.node.position.sub(cc.v2(cc.visibleRect.width / 2,cc.visibleRect.height / 2));

        }

        if (this._selfSpeed && this.player){
            this._targetPos = this.player.node.position.addSelf(this._selfSpeed)
        }
        if (this._targetPos){
            cc.log("=============")
            this.gameManager.sendClientInput({
                type: 'MovePlayer',
                targetX:this._targetPos.x,
                targetY:this._targetPos.y,
                x:this.player.node.x,
                y:this.player.node.y
            })
            this._targetPos = undefined
        }
        // Send Inputs
        this.gameManager.localTimePast();


        this._updatePlayers();
    }

    public players:{[key:number]:Charactor} = {};
    private _updatePlayers() {
        // Update pos
        let playerStates = this.gameManager.state.players;
        // cc.log(playerStates)
        for (let playerState of playerStates) {
            let playerId = playerState.id
            let player = this.players[playerId];
            // 场景上还没有这个 Player，新建之
            if (!player) {
                let playerNode = cc.instantiate(this.playerPrefab);
                this.entityLayer.node.addChild(playerNode);
                player = this.players[playerId] = playerNode.getComponent(Charactor)!;
                player.sceneMap = this.sceneMap
                player.id = playerId
                playerNode.x = playerState.x
                playerNode.y = playerState.y
                // 摄像机拍摄自己
                if (playerId === this.gameManager.selfPlayerId) {
                    this.player = player
                }
            }

            //画面外不处理 
            if (playerId != this.gameManager.selfPlayerId){
                if (player.node.position.x < this.camera.node.position.x || 
                    player.node.position.y < this.camera.node.position.y || 
                    player.node.position.x > this.camera.node.position.x + this.sceneMap.mapParams.viewWidth || 
                    player.node.position.y > this.camera.node.position.y + this.sceneMap.mapParams.viewHeight){
                        player.setVisiable(false)
                    } else {
                        player.setVisiable(true)
                    }
            }


            // 根据最新状态，更新 Player 表现组件
            // if (playerId === this.gameManager.selfPlayerId){

                this.movePlayer(playerId, playerState.targetX, playerState.targetY)
            // } else {

                // player.node.x = playerState.x
                // player.node.y = playerState.y
            // }


        }

        // Clear left players
        for (let i = this.entityLayer.node.children.length - 1; i > -1; --i) {
            let player = this.entityLayer.node.children[i].getComponent(Charactor)!;
            if (!this.gameManager.state.players.find(v => v.id === player.id)) {
                player.node.removeFromParent();
                delete this.players[player.id];
            }
        }
    }

    public movePlayer(playerId:number, targetX:number,targetY:number) {
        let player = this.players[playerId]
        var startPoint:Point = MapRoadUtils.instance.getWorldPointByPixel(player.node.x,player.node.y);
        var targetPoint:Point = MapRoadUtils.instance.getWorldPointByPixel(targetX,targetY);

        var startNode:RoadNode = this.sceneMap.roadDic[startPoint.x + "_" + startPoint.y];
        var targetNode:RoadNode = this.sceneMap.roadDic[targetPoint.x + "_" + targetPoint.y];

        var roadNodeArr:RoadNode[] = this.sceneMap.roadSeeker.seekPath(startNode,targetNode); //点击到障碍点不会行走
        //var roadNodeArr:RoadNode[] = this._roadSeeker.seekPath2(startNode,targetNode);  //点击到障碍点会行走到离障碍点最近的可走路点
        if (roadNodeArr.length > 0){
            player.walkByRoad(roadNodeArr)
        } 
    }
}
