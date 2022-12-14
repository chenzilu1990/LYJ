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
import SpawnPoint from "./game/transfer/SpawnPoint";
import Player from "./game/character/Player";
import SceneMap from "./SceneMap";
import MapParams from "./map/base/MapParams";

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


    // LIFE-CYCLE CALLBACKS:
    private _selfSpeed?: cc.Vec3;
    public gameManager!: GameManager;
    public player:Player = null;
    onLoad () {

        cc.log("onLoad============")

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
        cc.log("start============")
        this.node.on(cc.Node.EventType.TOUCH_START,this.onMapMouseDown,this);
    }
    private sceneMap:SceneMap
    init(sceneMap:SceneMap) {
        cc.log("init=============")
        this.player = null
        this.players = {}
        this.sceneMap = sceneMap
        this.gameManager = Main.instance.gameManager
        this.isInit = true
    }
    /**
     * ???????????????
     */
    public initPlayer(id,spawnId)
    {
        var spawnPoint:SpawnPoint = this.sceneMap.getSpawnPoint(spawnId);

        let player = GameMgr.instance.getPlayer();
        player.objName = player.objName + id
        player.node.parent = this.entityLayer.node;
        player.node.position = spawnPoint != null ? spawnPoint.node.position : new cc.Vec3(1000,1000); //????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        return player
    }


    private _targetPos:cc.Vec3
    public onMapMouseDown(event:cc.Event.EventTouch):void
    {

        //var pos = this.node.convertToNodeSpaceAR(event.getLocation());
        var pos = this.camera.node.position.add(new cc.Vec3(event.getLocation().x,event.getLocation().y));

        this._targetPos = pos

        
    }

    private targetPos:cc.Vec3

    /**
     * ?????????????????????
     */
    public setViewToPlayer():void
    {
        if (this.player){
            this.sceneMap. setViewToPoint(this.player.node.x,this.player.node.y);
        }
    }

    @property()
    public isFollowPlayer:boolean = true;

    public isInit:boolean = false;
    update (dt) {
        // cc.log("update=============")
        if(!this.isInit)
        {
            return;
        }

        if(this.isFollowPlayer)
        {
            this.sceneMap.followPlayer(dt, this.player);
        }


        if (this._selfSpeed && this.player){
            this._targetPos = this.player.node.position.addSelf(this._selfSpeed)
        }
        if (this._targetPos && this.player){
            this.gameManager.sendClientInput({
                type: 'MovePlayer',
                targetX:this._targetPos.x,
                targetY:this._targetPos.y,
                x:this.player.node.x,
                y:this.player.node.y
            })
            this._targetPos = undefined
        }
        // this.gameManager.localTimePast();

        this._updatePlayers();
    }

    public players:{[key:number]:Player} = {};
    private _updatePlayers() {

        let playerStates = this.gameManager.state.players;
        for (let playerState of playerStates) {
            let playerId = playerState.id
            let player = this.players[playerId];

            // ??????????????????
            let mapId = playerState.mapId
            let spawnId = playerState.spawnId
            if (mapId != this.sceneMap.mapParams.name){
                if (player) {
                    player.node.removeFromParent()
                    delete this.players[playerState.id]
                }
                continue
            }

            // ???????????????????????? Player????????????
            if (!player) {
                player = this.players[playerId] = this.initPlayer(playerId, playerState.spawnId);
                player.id = playerId
                if (playerId === this.gameManager.selfPlayerId) {
                    this.player = player
                }
                this.gameManager.sendClientInput({
                    type: 'MovePlayer',
                    targetX:this.player.node.x,
                    targetY:this.player.node.y,
                    x:this.player.node.x,
                    y:this.player.node.y
                })
                continue
            }


            // ??????????????????????????? Player ????????????
            let playerWorldP = MapRoadUtils.instance.getWorldPointByPixel(player.node.x, player.node.y)
            let playerTargetP = MapRoadUtils.instance.getWorldPointByPixel(playerState.targetX, playerState.targetY)

            // ?????????????????????????????????
            if (playerWorldP.x !== playerTargetP.x || playerWorldP.y !== playerTargetP.y) {
                player.navTo(playerState.targetX, playerState.targetY);
            }

            // ???????????????????????????????????????
            let isInScreen = (
                player.node.position.x >= this.camera.node.position.x &&
                player.node.position.y >= this.camera.node.position.y &&
                player.node.position.x <= this.camera.node.position.x + this.sceneMap.mapParams.viewWidth &&
                player.node.position.y <= this.camera.node.position.y + this.sceneMap.mapParams.viewHeight
            );
            player.setVisiable(isInScreen);

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
