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
 * 基础窗口组件
 */
@ccclass
export default class BaseView extends cc.Component {

    @property({tooltip:"窗口是否可拖拽:\n勾选可拖拽 \n不勾选不可拖拽"})
    canDrag:boolean = true;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    title:cc.Node = null;

    @property(cc.Node)
    closeBtn:cc.Node = null;

    private _startDrag:boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.closeBtn.on(cc.Node.EventType.TOUCH_START,this.onCloseBtnClick,this);
        
        if(this.canDrag)
        {
        
            this.title.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>
            {
                this._startDrag = true;
            },this);
    
            this.title.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
            {
                this._startDrag = false;
    
            },this);
    
            this.node.on(cc.Node.EventType.TOUCH_MOVE,(event:cc.Event.EventTouch)=>
            {
                if(this._startDrag)
                {
                    //var offset:cc.Vec3 = this.title.convertToNodeSpaceAR(event.getLocation());
                    var wpos:cc.Vec2 = this.node.parent.convertToNodeSpaceAR(event.getLocation());
                    var pos:cc.Vec3 = new cc.Vec3(wpos.x,wpos.y);
                    
                    var newPos:cc.Vec3 = pos.sub(this.title.position);
                    
                    if(newPos.x < -(cc.winSize.width - this.node.width) / 2)
                    {
                        newPos.x = -(cc.winSize.width - this.node.width) / 2;
                    }else if(newPos.x > (cc.winSize.width -  this.node.width) / 2)
                    {
                        newPos.x = (cc.winSize.width -  this.node.width) / 2;
                    }
    
                    if(newPos.y < -(cc.winSize.height - this.node.height) / 2)
                    {
                        newPos.y = -(cc.winSize.height - this.node.height) / 2;
                    }else if(newPos.y > (cc.winSize.height -  this.node.height) / 2)
                    {
                        newPos.y = (cc.winSize.height -  this.node.height) / 2;
                    }
    
                    this.node.position = newPos;
                }
      
            },this);
        }

        
    }

    start () {

    }

    protected onCloseBtnClick(event:cc.Event.EventTouch)
    {
        this.close();
    }

    // update (dt) {}

    public open()
    {
        this._startDrag = false;
        this.node.active = true;
        this.node.position = new cc.Vec3(0,0,0);
    }

    public close()
    {
        this.node.active = false;
    }
}
