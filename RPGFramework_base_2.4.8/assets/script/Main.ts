// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import SceneMap from "./SceneMap";
import MapData from "./map/base/MapData";
import { MapLoadModel } from "./map/base/MapLoadModel";
import { GameManager } from "../scripts/models/GameManager";
import  LoadMgr  from "../altLib/manager/LoadMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(SceneMap)
    sceneMap: SceneMap = null;

    @property(cc.Node)
    splash: cc.Node = null;
    public gameManager!: GameManager;
    // LIFE-CYCLE CALLBACKS:

    static instance: Main

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Main.instance = this
    }


    async start () {


        cc.director.getCollisionManager().enabled= true; //启用物理碰撞
        cc.debug.setDisplayStats(true);

        this.splash.active = true
        await this._initGameManager()
        //this.loadSingleMap("10001"); //选择加载单张地图
        //this.loadSlicesMap("10001"); //选择分切片加载地图

        this.loadMap("10001",MapLoadModel.slices); //加载地图

    }

    private async _initGameManager() {
        
        this.gameManager = new GameManager();

        // 监听数据状态事件
        // 新箭矢发射（仅表现）
        // this.gameManager.gameSystem.onNewArrow.push(v => { this._onNewArrow(v) });
        
        // 断线 2 秒后自动重连
        this.gameManager.client.flows.postDisconnectFlow.push(v => {
            setTimeout(() => {
                this.gameManager.join();
            }, 2000)
            return v;
        });
        
        await this.gameManager.join();

    }
    
    /**
     * 加载地图
     * @param mapId 地图id
     * @param mapLoadModel 加载模式，单张加载，还是切片加载
     */
     public loadMap(mapId:string,mapLoadModel:MapLoadModel = MapLoadModel.single)
     {
         if(mapLoadModel == MapLoadModel.single)
         {
             this.loadSingleMap(mapId);
         }else
         {
             this.loadSlicesMap(mapId);
         }
     }

    /**
     * 加载单张地图
     */
    protected loadSingleMap(mapId:string)
    {
        var dataPath:string = "map/data/" + mapId;
        cc.resources.load(dataPath,cc.JsonAsset,(error:Error,res:cc.JsonAsset)=>
        {
            if(error != null)
            {
                console.log("加载地图数据失败 path = ",dataPath,"error",error);
                return;
            }

            var mapData:MapData = res.json as MapData;

            var bgPath:string = "map/bg/" + mapData.bgName;
            cc.resources.load(bgPath,cc.Texture2D,(error:Error,tex:cc.Texture2D)=>
            {
                if(error != null)
                {
                    console.log("加载地图背景失败 path = ",bgPath,"error",error);
                    return;
                }

                this.sceneMap.init(mapData,tex,MapLoadModel.single)
            });



        });
    }

    /**
     * 加载分切片地图
     */
    protected loadSlicesMap(mapId:string)
    {
        var dataPath:string = "map/data/" + mapId;

        cc.resources.load(dataPath,cc.JsonAsset,(error:Error,res:cc.JsonAsset)=>
        {
            if(error != null)
            {
                console.log("加载地图数据失败 path = ",dataPath,"error",error);
                return;
            }

            var mapData:MapData = res.json as MapData;

            var bgPath:string = "map/bg/" + mapData.bgName + "/miniMap";
            cc.resources.load(bgPath,cc.Texture2D,(error:Error,tex:cc.Texture2D)=>
            {
                if(error != null)
                {
                    console.log("加载小地图背景失败 path = ",bgPath,"error",error);
                    return;
                }
                this.splash.active = false
                this.sceneMap.init(mapData,tex,MapLoadModel.slices)
            });

        });
    }
    // update (dt) {}
}
