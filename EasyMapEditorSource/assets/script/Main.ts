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

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(SceneMap)
    sceneMap: SceneMap = null;

    @property(cc.Prefab)
    playerPrefab:cc.Prefab = null

    public gameManager!: GameManager;
    // LIFE-CYCLE CALLBACKS:

    static instance: Main

     onLoad  () {
        Main.instance = this
    }
    
    async start () {

        cc.debug.setDisplayStats(false);

        this.sceneMap.node.active = false;

        await this._initGameManager()

        this.loadSlicesMap();

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
        cc.log("jio===============")
    }
    
    /**
     * 加载单张地图
     */
    protected loadSingleMap()
    {

        var mapName:string = "mapData";

        cc.loader.loadRes("map/data/" + mapName,cc.JsonAsset,(error:Error,res:cc.JsonAsset)=>
        {
            var mapData:MapData = res.json;

            cc.loader.loadRes("map/bg/" + mapData.bgName,cc.Texture2D,(error:Error,tex:cc.Texture2D)=>
            {
                this.sceneMap.node.active = true;
                this.sceneMap.init(mapData,tex,MapLoadModel.single)
            });

        });
    }


    /**
     * 加载分切片地图
     */
    protected loadSlicesMap()
    {
        var mapName:string = "mapData";

        cc.loader.loadRes("map/data/" + mapName,cc.JsonAsset,(error:Error,res:cc.JsonAsset)=>
        {
            var mapData:MapData = res.json;

            cc.loader.loadRes("map/bg/" + mapData.bgName + "/miniMap",cc.Texture2D,(error:Error,tex:cc.Texture2D)=>
            {
                this.sceneMap.node.active = true;
                this.sceneMap.init(mapData,tex,MapLoadModel.slices)
            });

        });
    }
    // update (dt) {}
}
