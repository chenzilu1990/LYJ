
import { MapType } from "./map/base/MapType";
import MapLayer from "./map/layer/MapLayer";
import EntityLayer from "./map/layer/EntityLayer";
import Charactor from "./map/charactor/Charactor";
import RoadNode from "./map/road/RoadNode";
import IRoadSeeker from "./map/road/IRoadSeeker";
import MapData from "./map/base/MapData";
import MapRoadUtils from "./map/road/MapRoadUtils";
import AstarHoneycombRoadSeeker from "./map/road/AstarHoneycombRoadSeeker";
import AStarRoadSeeker from "./map/road/AStarRoadSeeker";
import Point from "./map/road/Point";
import { MapLoadModel } from "./map/base/MapLoadModel";
import MapParams from "./map/base/MapParams";
import { GameManager } from "../scripts/models/GameManager";
import Main from "./Main";
import Joystick from "../scripts/Joystick";
import LandNode from "./model/LandNode";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

/**
 * 地图场景逻辑
 * @author 落日故人 QQ 583051842
 * 
 */
@ccclass
export default class SceneMap extends cc.Component {

    @property(cc.Node)
    public layer: cc.Node = null;

    @property(MapLayer)
    public mapLayer: MapLayer = null;

    @property(EntityLayer)
    public entityLayer: EntityLayer = null;

    // @property(Charactor)
    private player:Charactor = null;

    @property(cc.Camera)
    private camera:cc.Camera = null;

    @property()
    public isFollowPlayer:boolean = true;

    @property(cc.Prefab)
    playerPrefab:cc.Prefab = null

    private _roadDic:{[key:string]:RoadNode} = {};

    private _roadSeeker:IRoadSeeker;

    private targetPos:cc.Vec2 = cc.Vec2.ZERO;

    //private _mapData:MapData = null;

    private _mapParams:MapParams = null;

    public gameManager!: GameManager;
    
    @property(Joystick)
    joyStick!: Joystick = null

    // LIFE-CYCLE CALLBACKS:
    private _selfSpeed?: cc.Vec2;

    onLoad () {
                // 初始化摇杆
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
        
        this.node.x = -cc.visibleRect.width / 2;
        this.node.y = -cc.visibleRect.height / 2;

        this.gameManager = Main.instance.gameManager


        this.node.on(cc.Node.EventType.TOUCH_START,this.onMapMouseDown,this);

    }



    public init(mapData:MapData,bgTex:cc.Texture2D,mapLoadModel:MapLoadModel = 1)
    {
        
        //this._mapData = mapData;

        MapRoadUtils.instance.updateMapInfo(mapData.mapWidth,mapData.mapHeight,mapData.nodeWidth,mapData.nodeHeight,mapData.type);

        //初始化底图参数
        this._mapParams = new MapParams();
        this._mapParams.name = mapData.name;
        this._mapParams.bgName = mapData.bgName;
        this._mapParams.mapType = mapData.type;
        this._mapParams.mapWidth = mapData.mapWidth;
        this._mapParams.mapHeight = mapData.mapHeight;
        this._mapParams.ceilWidth = mapData.nodeWidth;
        this._mapParams.ceilHeight = mapData.nodeHeight;

        this._mapParams.viewWidth = mapData.mapWidth > cc.visibleRect.width ? cc.visibleRect.width : mapData.mapWidth;
        this._mapParams.viewHeight = mapData.mapHeight > cc.visibleRect.height ? cc.visibleRect.height : mapData.mapHeight;
        this._mapParams.sliceWidth = 512;
        this._mapParams.sliceHeight = 512;
        this._mapParams.bgTex = bgTex;
        this._mapParams.mapLoadModel = mapLoadModel;

        this.mapLayer.init(this._mapParams, this);
        
        var len:number = mapData.roadDataArr.length;
        var len2:number = mapData.roadDataArr[0].length;
        
        var value:number = 0;
        var dx:number = 0;
        var dy:number = 0;

        for(var i:number = 0 ; i < len ; i++)
        {
            for(var j:number = 0 ; j < len2 ; j++)
            {
                value = mapData.roadDataArr[i][j];
                value = 0
                dx = j;
                dy = i;
                
                var node:RoadNode = MapRoadUtils.instance.getNodeByDerect(dx,dy);
                node.value = value;

                this._roadDic[node.cx + "_" + node.cy] = node;
            }
        }

        if(mapData.type == MapType.honeycomb)
        {
            this._roadSeeker = new AstarHoneycombRoadSeeker(this._roadDic)
        }else
        {
            this._roadSeeker = new AStarRoadSeeker(this._roadDic);
        }

        this.camera.node.position = cc.v2(this._mapParams.mapWidth/2, this._mapParams.mapHeight/2).sub(cc.v2(cc.visibleRect.width/2,cc.visibleRect.height/2));

        this.node.width = this.mapLayer.width;
        this.node.height = this.mapLayer.height;
        this.joyStick.node.active = true
        

    }

    public getMapNodeByPixel(px:number,py:number):RoadNode
    {
        var point:Point = MapRoadUtils.instance.getWorldPointByPixel(px,py);
        
        var node:RoadNode = this._roadDic[point.x + "_" + point.y];
        
        return node;
    }


    private _targetPos:cc.Vec2
    public onMapMouseDown(event:cc.Event.EventTouch):void
    {

        //var pos = this.node.convertToNodeSpaceAR(event.getLocation());
        var pos = this.camera.node.position.add(event.getLocation());

        this._targetPos = pos

        // this.movePlayer(this.gameManager.selfPlayerId, pos.x, pos.y);


    }

    /**
     * 视图跟随玩家
     * @param dt 
     */
    public followPlayer(dt:number)
    {
        if (!this.player) return
        cc.log(this.player.node.x, this.player.node.y)
        this.targetPos = this.player.node.position.sub(cc.v2(cc.visibleRect.width / 2,cc.visibleRect.height / 2));

        if(this.targetPos.x > this._mapParams.mapWidth - cc.visibleRect.width)
        {
            this.targetPos.x = this._mapParams.mapWidth - cc.visibleRect.width;
        }else if(this.targetPos.x < 0)
        {
            this.targetPos.x = 0;
        }    

        if(this.targetPos.y > this._mapParams.mapHeight - cc.visibleRect.height)
        {
            this.targetPos.y = this._mapParams.mapHeight - cc.visibleRect.height;
        }else if(this.targetPos.y < 0)
        {
            this.targetPos.y = 0;
        }
        

        //摄像机平滑跟随
        this.camera.node.position.lerp(this.targetPos,dt * 2.0,this.targetPos);
        this.camera.node.position = this.targetPos;

        if(this._mapParams.mapLoadModel == MapLoadModel.slices)
        {
            this.mapLayer.loadSliceImage(this.targetPos.x,this.targetPos.y);
        }
        this.mapLayer.loadLandViews(this.targetPos.x,this.targetPos.y)
        
    }


    /**
        *移到玩家 
        * @param targetX 移动到的目标点x
        * @param targetY 移到到的目标点y
        * 
        */	


    public movePlayer(playerId:number, targetX:number,targetY:number) {
        let player = this.players[playerId]
        var startPoint:Point = MapRoadUtils.instance.getWorldPointByPixel(player.node.x,player.node.y);
        var targetPoint:Point = MapRoadUtils.instance.getWorldPointByPixel(targetX,targetY);

        var startNode:RoadNode = this._roadDic[startPoint.x + "_" + startPoint.y];
        var targetNode:RoadNode = this._roadDic[targetPoint.x + "_" + targetPoint.y];

        var roadNodeArr:RoadNode[] = this._roadSeeker.seekPath(startNode,targetNode); //点击到障碍点不会行走
        //var roadNodeArr:RoadNode[] = this._roadSeeker.seekPath2(startNode,targetNode);  //点击到障碍点会行走到离障碍点最近的可走路点
        if (roadNodeArr.length > 0){
            player.walkByRoad(roadNodeArr)
        } 
    }
    /**
     * getPlayerById
     */
    public players:{[key:number]:Charactor} = {};

    /**
     *把视野定位到给定位置 
    * @param px
    * @param py
    * 
    */		
    public setViewToPoint(px:number,py:number):void
    {
        this.targetPos = cc.v2(px,py).sub(cc.v2(cc.visibleRect.width / 2,cc.visibleRect.height / 2));

        if(this.targetPos.x > this._mapParams.mapWidth - cc.visibleRect.width)
        {
            this.targetPos.x = this._mapParams.mapWidth - cc.visibleRect.width;
        }else if(this.targetPos.x < 0)
        {
            this.targetPos.x = 0;
            
        }    

        if(this.targetPos.y > this._mapParams.mapHeight - cc.visibleRect.height)
        {
            this.targetPos.y = this._mapParams.mapHeight - cc.visibleRect.height;
        }else if(this.targetPos.y < 0)
        {
            this.targetPos.y = 0;
        }
        
        this.camera.node.position = this.targetPos;
        
        if(this._mapParams.mapLoadModel == MapLoadModel.slices)
        {
            this.mapLayer.loadSliceImage(this.targetPos.x,this.targetPos.y);
        }
    }
    
    
    update(dt: number) {
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
                targetY:this._targetPos.y
            })
            this._targetPos = undefined
        }

        // Send Inputs
        this.gameManager.localTimePast();


        this._updatePlayers();

    }


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
                player.sceneMap = this
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
                    player.node.position.x > this.camera.node.position.x + this._mapParams.viewWidth || 
                    player.node.position.y > this.camera.node.position.y + this._mapParams.viewHeight){
                        player.setVisiable(false)
                    } else {
                        player.setVisiable(true)
                    }
            }


            // 根据最新状态，更新 Player 表现组件

            this.movePlayer(playerId, playerState.targetX, playerState.targetY)


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

    getLandNodeByWorldPoint(cx: number, cy: number): RoadNode {
        return this._roadDic[cx + "_" + cy]
    }
}
