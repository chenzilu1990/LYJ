// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Joystick from "../scripts/Joystick";
import { GameManager } from "../scripts/models/GameManager";
import GameMgr from "./manager/GameManager";
import Main from "./Main";
import { MapLoadModel } from "./map/base/MapLoadModel";
import Charactor from "./game/character/Character";
import EntityLayer from "./map/layer/EntityLayer";
import MapRoadUtils from "./map/road/MapRoadUtils";
import Point from "./map/road/Point";
import RoadNode from "./map/road/RoadNode";
import SceneMap from "./SceneMap";
import SpawnPoint from "./game/transfer/SpawnPoint";
import Player from "./game/character/Player";

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
    private _selfSpeed?: cc.Vec3;
    public gameManager!: GameManager;
    public player:Charactor = null;
    onLoad () {


        this.joyStick.options = {

            onOperate: v => {
                // cc.log(v)
                if (!this._selfSpeed) {
                    this._selfSpeed = new cc.Vec3();
                }
                this._selfSpeed = cc.v3(v.x, v.y );
            },
            
            onOperateEnd: () => {
                this._selfSpeed = undefined;
            }
        }
    }

    start () {
        this.gameManager = Main.instance.gameManager
        this.node.on(cc.Node.EventType.TOUCH_START,this.onMapMouseDown,this);
        this.scheduleOnce(()=>{
            this.player = this.initPlayer(this.gameManager.selfPlayerId)
        }, 1000)
    }

    /**
     * 初始化玩家
     */
    public initPlayer(id)
    {
        var spawnPoint:SpawnPoint = this.sceneMap.getSpawnPoint(0);

        let player = GameMgr.instance.getPlayer();
        player.objName = player.objName + id
        player.node.parent = this.entityLayer.node;
        player.node.position = spawnPoint != null ? spawnPoint.node.position : new cc.Vec3(1000,1000); //如果找得到出生点就初始化在出生点的位置，否则默认一个出生位置点给玩家，防止报错。
        return player
    }


    private _targetPos:cc.Vec3
    public onMapMouseDown(event:cc.Event.EventTouch):void
    {

        //var pos = this.node.convertToNodeSpaceAR(event.getLocation());
        var pos = this.camera.node.position.add(new cc.Vec3(event.getLocation().x,event.getLocation().y));

        this._targetPos = pos
        this.player.navTo(pos.x, pos.y)
        // this.movePlayer(this.gameManager.selfPlayerId, pos.x, pos.y);


    }

    private targetPos:cc.Vec3
    /**
     * 视图跟随玩家
     * @param dt 
     */
    public followPlayer(dt:number)
    {
        this.targetPos = this.player.node.position.sub(new cc.Vec3(cc.winSize.width / 2,cc.winSize.height / 2));

        if(this.targetPos.x > this.sceneMap. mapParams.mapWidth - cc.winSize.width)
        {
            this.targetPos.x = this.sceneMap. mapParams.mapWidth - cc.winSize.width;
        }else if(this.targetPos.x < 0)
        {
            this.targetPos.x = 0;
            
        }    

        if(this.targetPos.y > this.sceneMap. mapParams.mapHeight - cc.winSize.height)
        {
            this.targetPos.y = this.sceneMap. mapParams.mapHeight - cc.winSize.height;
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
        this.sceneMap. cardLayer.loadLandViews(this.player.node.x, this.player.node.y)
    }

    @property()
    public isFollowPlayer:boolean = true;
    update (dt) {
        
        if(this.isFollowPlayer && this.player)
        {
            this.followPlayer(dt);

            //this.camera.node.position = this.player.node.position.sub(cc.v2(cc.visibleRect.width / 2,cc.visibleRect.height / 2));

        }

        if (this._selfSpeed && this.player){
            this._targetPos = this.player.node.position.addSelf(this._selfSpeed)
        }
        if (this._targetPos && this.player){
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


        // this._updatePlayers();
    }

    public players:{[key:number]:Player} = {};
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
                player = this.players[playerId] = this.initPlayer(playerId);
                // player.sceneMap = this.sceneMap
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
            player.navTo(playerState.targetX, playerState.targetY)
                // this.movePlayer(playerId, playerState.targetX, playerState.targetY)
            // } else {

                // player.node.x = playerState.x
                // player.node.y = playerState.y
            // }


        }

        // Clear left players
        let playerList = this.getComponentsInChildren(Player)
        for (let i = playerList.length - 1; i > -1; --i) {
            let player = playerList[i]
            if (!this.gameManager.state.players.find(v => v.id === player.id)) {
                player.node.removeFromParent();
                delete this.players[player.id];
            }
        }
    }


}
