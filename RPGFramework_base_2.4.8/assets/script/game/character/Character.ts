
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import PathFindingAgent from "../../map/road/PathFindingAgent";
import RoadNode from "../../map/road/RoadNode";
import MovieClip from "../../utils/MovieClip";

const {ccclass, property} = cc._decorator;

/**
 * 角色状态
 */
export enum CharacterState
{
    /**
     * 待机
     */
    idle = 0,

    /**
     * 行走
     */
    walk = 1,

    /**
     * 坐下
     */
    sitdown = 2,

    sitdown_walk = 3,
}

/**
 * 场景角色基类 
 * @author 落日故人 QQ 583051842
 * 
 */

@ccclass
export default class Character extends cc.Component {
    
    /**
     * 单位名字文本
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

    private _movieClip:MovieClip = null;

    public get movieClip():MovieClip
    {
        if(!this._movieClip)
        {
            this._movieClip = this.getComponentInChildren(MovieClip);
        }
        return this._movieClip;
    }

    /**
     * 设置单位方向
     * 
     * 方向值范围为 0-7，方向值设定如下，0是下，1是左下，2是左，3是左上，4是上，5是右上，6是右，7是右下
     * 
     *        4
     *      3   5
     *    2   *   6
     *      1   7
     *        0
     * 
     */
    private _direction:number = 0;
    public get direction():number
    {
        return this._direction;
    }

    public set direction(value:number)
    {
        this._direction = value;

        if(value > 4)
        {
            this.movieClip.rowIndex = 4 - value % 4;
            this.movieClip.node.scaleX = -1;
        }else
        {
            this.movieClip.rowIndex = value;
            this.movieClip.node.scaleX = 1;
        }
    }

    protected _state:CharacterState = 0;

    public get state():CharacterState
    {
        return this._state;
    }
    public set state(value:CharacterState)
    {
        this._state = value;

        var halfCol:number = this.movieClip.col / 2;

        switch(this._state)
        {
            case CharacterState.idle: 
                this.movieClip.begin = 0;
                this.movieClip.end = halfCol;
            break;

            case CharacterState.walk: 
                this.movieClip.begin = halfCol;
                this.movieClip.end = this.movieClip.col;
            break;
        }
    }

    private _alpha: number = 1;
    public get alpha(): number {
        return this._alpha;
    }
    public set alpha(value: number) {
        this._alpha = value;
        this.node.opacity = Math.floor(255 * (value/1))
    }

    /**
     * 单位当前所站在的路点
     */
    public get roadNode():RoadNode
    {
        return PathFindingAgent.instance.getRoadNodeByPixel(this.node.x,this.node.y);
    }

    /**
     *角色最近一次所站在的地图节点 
     */		
    protected _lastRoadNode:RoadNode = null;

    /**
     *玩家当前所站在的地图节点 
     */		
    private _currentNode:RoadNode;

    //public isScrollScene:boolean = false;

    public moving:boolean = false;

    public moveSpeed:number = 200;

    private _moveAngle:number = 0;

    private _roadNodeArr:RoadNode[] = [];
    private _nodeIndex:number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.nameTxt
        this.state = CharacterState.idle; //默认待机状态

    }

    update (dt) 
    {
        if(this.moving)
        {
            var nextNode:RoadNode = this._roadNodeArr[this._nodeIndex];
            var dx:number = nextNode.px - this.node.x;
            var dy:number = nextNode.py - this.node.y;

            var speed:number = this.moveSpeed * dt;

            if(dx * dx + dy * dy > speed * speed)
            {
                if(this._moveAngle == 0)
                {
                    this._moveAngle = Math.atan2(dy,dx);

                    var dire:number = Math.round((-this._moveAngle + Math.PI)/(Math.PI / 4));
                    this.direction = dire > 5 ? dire-6 : dire+2;
                }

                var xspeed:number = Math.cos(this._moveAngle) * speed;
                var yspeed:number = Math.sin(this._moveAngle) * speed;

                this.node.x += xspeed;
                this.node.y += yspeed;

            }else
            {
                this._moveAngle = 0;

                if(this._nodeIndex == this._roadNodeArr.length - 1)
                {
                    this.node.x = nextNode.px;
                    this.node.y = nextNode.py

                    this.stop();
                }else
                {
                    this.walk();
                }
            }
        }

        this.updateCharaterStateByNode();

    }

    /**
     * 根据角色所在的路节点信息更新自身的信息
     * @returns 
     */
    public updateCharaterStateByNode():void
    {
        var roadNode:RoadNode = this.roadNode;
        
        if(roadNode == this._lastRoadNode)
        {
            //如果角色所站的路节点没有发生变化，不处理
            return;
        }
        
        this._lastRoadNode = roadNode
        
        if(this._lastRoadNode)
        {
            switch(this._lastRoadNode.value)
            {
                case 2://如果是透明节点时
                    if(this.alpha != 0.4)
                    {
                        this.alpha = 0.4;
                    }
                    break;
                case 3://如果是隐藏节点时
                    //this.alpha < 1 && (this.alpha = 1);
                    this.alpha > 0 && (this.alpha = 0);
                    break;
                default:
                    this.alpha < 1 && (this.alpha = 1);
                    
            }
            
        }

    }

    /**
     * 根据路节点路径行走
     * @param roadNodeArr 
     */
    public walkByRoad(roadNodeArr:RoadNode[])
    {
        this._roadNodeArr = roadNodeArr;
        this._nodeIndex = 0;
        this._moveAngle = 0;

        this.walk();
        this.move();
    }

    private walk()
    {
        if(this._nodeIndex < this._roadNodeArr.length - 1)
        {
            this._nodeIndex ++;
        }else
        {

        }
    }

    public move()
    {
        this.moving = true;
        this.state = CharacterState.walk;
    }

    public stop()
    {
        this.moving = false;
        this.state = CharacterState.idle;
    }

    /**
     * 导航角色到目标点
     * @param targetX 
     * @param targetY 
     */
    public navTo(targetX:number,targetY:number)
    {
        // this.stop()
        //var roadNodeArr:RoadNode[] = PathFindingAgent.instance.seekPath(this.node.position.x,this.node.position.y,targetX,targetY); //如果目标点是障碍，则寻路失败                               //按需求自选
        var roadNodeArr:RoadNode[] = PathFindingAgent.instance.seekPath2(this.node.position.x,this.node.position.y,targetX,targetY);  //如果目标点是障碍，则寻路到里目标点最近的一个非障碍点         //按需求自选

        if(roadNodeArr.length > 0)
        {
            this.walkByRoad(roadNodeArr);
        }
    }

    

}
