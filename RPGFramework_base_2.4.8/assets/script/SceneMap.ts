
import MapLayer from "./map/layer/MapLayer";
import EntityLayer from "./map/layer/EntityLayer";
import MapData from "./map/base/MapData";
import { MapLoadModel } from "./map/base/MapLoadModel";
import MapParams from "./map/base/MapParams";
import PathLog from "./map/road/PathLog";
import PathFindingAgent from "./map/road/PathFindingAgent";
import Player from "./game/character/Player";
import { EditMonsterData, EditNpcData, EditSpawnPointData, EditTransferData } from "./editObjData/EditObjData";
import NPC from "./game/character/NPC";
import GameManager from "./manager/GameManager";
import TransferDoor from "./game/transfer/TransferDoor";
import Monster from "./game/character/Monster";
import SpawnPoint from "./game/transfer/SpawnPoint";
import CardLayer from "./map/layer/CardLayer";
import Joystick from "../scripts/Joystick";

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

    @property(CardLayer)
    public cardLayer: CardLayer = null;
    
    @property(EntityLayer)
    public entityLayer: EntityLayer = null;

    @property(cc.Camera)
    private camera:cc.Camera = null;


    @property()
    public isFollowPlayer:boolean = true;

    private player:Player = null;

    private targetPos:cc.Vec3 = cc.Vec3.ZERO;

    private _mapData:MapData = null;

    private _mapParams:MapParams = null;
    public get mapParams():MapParams {
        return this._mapParams
    }
    /**
     * 场景里所有的出生点
     */
    public spawnPointList:SpawnPoint[] = [];

    /**
     * 场景里所有的传送门
     */
    public transferDoorList:TransferDoor[] = [];

    /**
     * 场景里所有的npc
     */
    public npcList:NPC[] = [];

    /**
     * 场景里所有的怪物
     */
    public monsterList:Monster[] = [];

    public isInit:boolean = false;

    // LIFE-CYCLE CALLBACKS:
    private _selfSpeed?: cc.Vec2;
    public static instance:SceneMap;
    onLoad () {
        SceneMap.instance = this
    }

    start () {

        this.node.x = -cc.winSize.width / 2;
        this.node.y = -cc.winSize.height / 2;

        this.node.on(cc.Node.EventType.TOUCH_START,this.onMapMouseDown,this);
    }

    /**
     * 初始化地图
     * @param mapData 
     * @param bgTex 
     * @param mapLoadModel 
     */
    public init(mapData:MapData,bgTex:cc.Texture2D,mapLoadModel:MapLoadModel = 1)
    {
        this._mapData = mapData;

        this._mapParams = this.getMapParams(mapData,bgTex,mapLoadModel); //初始化地图参数
        this.mapLayer.init(this._mapParams);
        this.cardLayer.init(this._mapParams, this)

        PathLog.setLogEnable(false); //关闭寻路日志打印信息
        //PathLog.setLogEnable(true); //打开寻路日志打印信息     备注： 想看寻路日志信息，执行这行

        PathFindingAgent.instance.init(mapData); //初始化寻路系统
        //PathFindingAgent.instance.setMaxSeekStep(1000); //设置最大寻路步骤
        //PathFindingAgent.instance.setPathOptimize(PathOptimize.best); //设置路径优化类型
        //PathFindingAgent.instance.setPathQuadSeek(PathQuadSeek.path_dire_4); //4方向路点地图，这个方法是用来设置寻路是使用4方向寻路，还是8方向寻路,默认是8方向寻路。对六边形路点地图无效


        //---------------------------------这是自定义寻路时检测路点是否能通过的条件----------------------------------------------
        //寻路系统默认路点值为1是障碍点。如果不想要默认寻路条件，可以自定义寻路条件，在以下回调函数中写自己的路点可通过条件
        /*PathFindingAgent.instance.setRoadNodePassCondition((roadNode:RoadNode):boolean=>
        {
            if(roadNode == null) //等于null, 证明路点在地图外，不允许通过
            {
                return false;
            }

            if(roadNode.value == 0) //路点值等于0，不允许通过
            {
                return false;
            }

            return true;
        });*/
        //-----------------------------------------------------------------------------------------------------------------------


        this.node.width = this.mapLayer.width;
        this.node.height = this.mapLayer.height;

        this.initMapElement(); //初始化编辑的地图元素
        this.afterInitMapElement(); //编辑的地图元素后处理
        // this.initPlayer(); //初始化玩家
        // this.setViewToPlayer(); //将视野对准玩家
        this.isInit = true;

        //-----------------该地图系统能应对很多种类型的游戏，能应对RPG，SLG，RTS游戏，还可以应对农场类，经营类需要用到地图的游戏--------------------

        //----------------------------------------------------------------------------
        //*************                                              *****************
        //*************                                              *****************
        //************* 如果对地图系统有疑问，可以联系作者 QQ 583051842 *****************
        //*************                                              *****************
        //*************                                              *****************
        //----------------------------------------------------------------------------
        
    }

    /**
     * 初始化地图元素
     */
    public initMapElement()
    {
        var mapItems:object[] = this._mapData.mapItems;
        console.log("mapItems",mapItems);

        if(!mapItems)
        {
            return;
        }

        for(var i:number = 0 ; i < mapItems.length ; i++)
        {
            var mapItem:any = mapItems[i];
            
            if(mapItem.type == "npc")
            {
                this.initNpc(mapItem);
            }else if(mapItem.type == "monster")
            {
                this.initMonster(mapItem);
            }
            else if(mapItem.type == "transfer")
            {
                this.initTransferDoor(mapItem);
            }else if(mapItem.type == "spawnPoint")
            {
                this.initSpawnPoint(mapItem);
            }
        }
    }

    /**
     * 初始化Npc
     */
    private initNpc(editData:EditNpcData)
    {
        var npc:NPC = GameManager.instance.getNPC();
        npc.node.parent = this.entityLayer.node;
        npc.initEditData(editData);
        npc.init();

    }

    /**
     * 初始化怪物
     */
    private initMonster(editData:EditMonsterData)
    {
        var monster:Monster = GameManager.instance.getMonster();
        monster.node.parent = this.entityLayer.node;
        monster.initEditData(editData);
        monster.init();
    }

    /**
     * 初始化传送门
     */
    private initTransferDoor(editData:EditTransferData)
    {
        var transferDoor:TransferDoor = GameManager.instance.getTransferDoor(editData.transferType);
        transferDoor.node.parent = this.entityLayer.node;
        transferDoor.initEditData(editData);
        transferDoor.init();
    }

    /**
     * 初始化出生点
     */
private initSpawnPoint(editData:EditSpawnPointData)
{
    var spawnPoint:SpawnPoint = GameManager.instance.getSpawnPoint();
    spawnPoint.node.parent = this.entityLayer.node;
    spawnPoint.initEditData(editData);
    spawnPoint.init();
}


    /**
     * 初始化完地图元素的后处理
     */
    private afterInitMapElement()
    {
        this.spawnPointList = this.getComponentsInChildren(SpawnPoint);
        this.transferDoorList = this.getComponentsInChildren(TransferDoor);
        this.npcList = this.getComponentsInChildren(NPC);
        this.monsterList = this.getComponentsInChildren(Monster);
    } 

    /**
     * 初始化玩家
     */
    public initPlayer()
    {
        var spawnPoint:SpawnPoint = this.getSpawnPoint(0);

        this.player = GameManager.instance.getPlayer();
        this.player.node.parent = this.entityLayer.node;
        this.player.node.position = spawnPoint != null ? spawnPoint.node.position : new cc.Vec3(1000,1000); //如果找得到出生点就初始化在出生点的位置，否则默认一个出生位置点给玩家，防止报错。
    }

    /**
     * 获得地图参数
     * @param mapData 
     * @param bgTex 
     * @param mapLoadModel 
     * @returns 
     */
    public getMapParams(mapData:MapData,bgTex:cc.Texture2D,mapLoadModel:MapLoadModel = 1):MapParams
    {
        //初始化底图参数
        var mapParams:MapParams = new MapParams();
        mapParams.name = mapData.name;
        mapParams.bgName = mapData.bgName;
        mapParams.mapType = mapData.type;
        mapParams.mapWidth = mapData.mapWidth;
        mapParams.mapHeight = mapData.mapHeight;
        mapParams.ceilWidth = mapData.nodeWidth;
        mapParams.ceilHeight = mapData.nodeHeight;
        mapParams.viewWidth = mapData.mapWidth > cc.winSize.width ? cc.winSize.width : mapData.mapWidth;
        mapParams.viewHeight = mapData.mapHeight > cc.winSize.height ? cc.winSize.height : mapData.mapHeight;
        mapParams.sliceWidth = 256;
        mapParams.sliceHeight = 256;
        mapParams.bgTex = bgTex;
        mapParams.mapLoadModel = mapLoadModel;

        return mapParams;
    }

    /**
     * 根据id获取出生点
     * @param spawnId 
     * @returns 
     */
    public getSpawnPoint(spawnId:number = 0)
    {
        for(var i:number = 0 ; i < this.spawnPointList.length ; i++)
        {
            if(this.spawnPointList[i].spawnId == spawnId)
            {
                return this.spawnPointList[i];
            }
        }

        if(spawnId == 0)
        {
            //如果没有找到匹配的出生点，则寻找默认出生点
            for(var i:number = 0 ; i < this.spawnPointList.length ; i++)
            {
                if(this.spawnPointList[i].defaultSpawn)
                {
                    return this.spawnPointList[i];
                }
            }
        }

        console.error(`地图${this._mapData.name}不存在这个出生点 spawnId = ${spawnId}`);

        return null;
    }

    public onMapMouseDown(event:cc.Event.EventTouch):void
    {
        //var pos = this.node.convertToNodeSpaceAR(event.getLocation());
        var pos = this.camera.node.position.add(new cc.Vec3(event.getLocation().x,event.getLocation().y));
        if (this.player){
            this.player.navTo(pos.x,pos.y);
        }
    }

    /**
     * 视图跟随玩家
     * @param dt 
     */
    public followPlayer(dt:number)
    {
        this.targetPos = this.player.node.position.sub(new cc.Vec3(cc.winSize.width / 2,cc.winSize.height / 2));

        if(this.targetPos.x > this._mapParams.mapWidth - cc.winSize.width)
        {
            this.targetPos.x = this._mapParams.mapWidth - cc.winSize.width;
        }else if(this.targetPos.x < 0)
        {
            this.targetPos.x = 0;
            
        }    

        if(this.targetPos.y > this._mapParams.mapHeight - cc.winSize.height)
        {
            this.targetPos.y = this._mapParams.mapHeight - cc.winSize.height;
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
        this.cardLayer.loadLandViews(this.player.node.x, this.player.node.y)
    }

    /**
     *把视野定位到给定位置 
    * @param px
    * @param py
    * 
    */		
    public setViewToPoint(px:number,py:number):void
    {
        this.targetPos = cc.v3(px,py).sub(cc.v3(cc.winSize.width / 2,cc.winSize.height / 2));

        if(this.targetPos.x > this._mapParams.mapWidth - cc.winSize.width)
        {
            this.targetPos.x = this._mapParams.mapWidth - cc.winSize.width;
        }else if(this.targetPos.x < 0)
        {
            this.targetPos.x = 0;
            
        }    

        if(this.targetPos.y > this._mapParams.mapHeight - cc.winSize.height)
        {
            this.targetPos.y = this._mapParams.mapHeight - cc.winSize.height;
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
    
    /**
     * 将视野对准玩家
     */
    public setViewToPlayer():void
    {
        this.setViewToPoint(this.player.node.x,this.player.node.y);
    }


    update (dt) 
    {
        if(!this.isInit)
        {
            return;
        }

        if(this.isFollowPlayer)
        {
            // this.followPlayer(dt);
        }
    }
}
