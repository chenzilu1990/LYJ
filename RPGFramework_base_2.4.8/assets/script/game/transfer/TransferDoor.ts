// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { EditTransferData } from "../../editObjData/EditObjData";
import Player from "../character/Player";


const {ccclass, property} = cc._decorator;

/**
 * 传送门
 */
@ccclass
export default class TransferDoor extends cc.Component {

    /**
     * 传送到目标地图Id
     */
    @property(cc.String)
    public targetMapId: string = "";

    /**
     * 传送到目标地图的出生点Id
     */

    @property(cc.Integer)
    public targetMapSpawnId: number = 0;

    /**
     * 魔法值
     */
    @property(cc.Label)
    public nameTxt:cc.Label = null;

    /**
     * 用于显示角色名字的接口
     */
     private _objName: string = "";
     public get objName(): string {
         return this._objName;
     }
     public set objName(value: string) {
         this._objName = value;
 
         if(this.nameTxt == null)
         {
             this.nameTxt = this.node.getChildByName("NameTxt")?.getComponent(cc.Label);
         }
 
         if(this.nameTxt)
         {
             this.nameTxt.string = this._objName;
         }
     }

    /**
     * 编辑的数据
     */
    private editData:EditTransferData = null;

    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        //this.node.opacity = 0;
    }

    /**
     * 初始化
     */
    public init()
    {

    }

    /**
     * 初始化编辑数据
     * @param editData 
     */
    public initEditData(editData:EditTransferData)
    {
        this.editData = editData;

        this.objName = editData.objName;
        this.node.x = editData.x;
        this.node.y = editData.y;

        this.targetMapId = editData.targetMapId;
        this.targetMapSpawnId = editData.targetMapSpawnId;
    }

    // update (dt) {}

    public toString()
    {
        return this.targetMapId + "," + this.targetMapSpawnId;
    }

    /**
     * 角色进入传送门
     * @param callback 
     */
    public onTriggerEnter(player:Player)
    {
        if(player != null)
        {
            console.log("跳转到地图",this.targetMapId, this.targetMapSpawnId);
        }
    }

    /**
     * 角色从传送们出来
     * @param callback 
     */
    public onTriggerExit(player:Player)
    {
        //
    }
}
