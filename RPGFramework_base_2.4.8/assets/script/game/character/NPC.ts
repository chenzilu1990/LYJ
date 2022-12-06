// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EditNpcData } from "../../editObjData/EditObjData";
import Character from "./Character";

const {ccclass, property} = cc._decorator;

/**
 * NPC
 */
@ccclass
export default class NPC extends Character {

    @property()
    public npcId:number = 0;

    /**
     * 是否巡逻
     */
    @property()
    public isPatrol:boolean = true;

    /**
     * 以角色初始化位置为中心，巡逻的范围
     */
    @property()
    public patrolRange:number = 200;

    /**
     * 初始化时默认方向
     */
    @property()
    public defaultDir:number = 0;

    /**
     * 编辑的数据
     */
    private editData:EditNpcData = null;

    protected basePos:cc.Vec3 = null;
    protected targetPos:cc.Vec2 = new cc.Vec2();
    protected timer:number = 3.5;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        super.start();
        this.basePos = this.node.position;
        this.timer = this.Range(0.5 , 1.5);
    }

    // update (dt) {}

    /**
     * 初始化
     */
    public init()
    {
        this.node.width = 100;
        this.node.height = 100;
        this.direction = this.defaultDir;
        this.loadRes();
    }

    /**
     * 初始化编辑数据
     * @param editData 
     */
    public initEditData(editData:EditNpcData)
    {
        this.editData = editData;

        this.objName = editData.objName;
        this.npcId = Number(editData.objId);
        this.node.x = editData.x;
        this.node.y = editData.y;
        this.defaultDir = editData.direction;
        this.isPatrol = editData.isPatrol;
    }

    /**
     * 下载资源
     */
    private loadRes()
    {
        if(this.npcId != 0)
        {
            var filePath:string = "game/npc/" + this.npcId;
            cc.resources.load(filePath, cc.Texture2D,(error:Error,tex:cc.Texture2D)=>
            {
                if(error != null)
                {
                    console.log("\n");
                    console.error("加载NPC资源失败 filePath：",filePath);
                    console.error("错误原因",error);
                    console.log("\n");
                    return;
                }
                this.movieClip.init(tex,5,12);

                //把影片的宽高赋值给根节点
                this.node.width = this.movieClip.node.width;
                this.node.height = this.movieClip.node.height;
            });
        }
    }

    update (dt) 
    {
        super.update(dt);

        //如果需要巡逻，则每隔一段时间在巡逻范围内随机一个点移动
        if(this.isPatrol)
        {
            this.timer -= dt;

            if(this.timer <= 0)
            {
                this.timer = this.Range(1.5 , 4);
                this.patrol();
            }
        }

    }

    public Range(num1:number,num2:number)
    {
        if(num2 > num1)
        {
            return Math.random() * (num2 - num1) + num1;
        }
        return Math.random() * (num1 - num2) + num2;
    }

    public patrol()
    {
        this.targetPos.x = this.basePos.x + this.Range(-this.patrolRange , this.patrolRange);
        this.targetPos.y = this.basePos.y + this.Range(-this.patrolRange , this.patrolRange);

        this.navTo(this.targetPos.x,this.targetPos.y);
    }
}
