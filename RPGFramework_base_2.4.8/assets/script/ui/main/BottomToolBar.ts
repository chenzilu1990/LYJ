// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseView from "../base/BaseView";


const {ccclass, property} = cc._decorator;

/**
 * 底部工具栏，测试功能用，可以删
 */
@ccclass
export default class BottomToolBar extends cc.Component {

    @property(cc.Button)
    mapBtn: cc.Button = null;

    @property(cc.Button)
    helpBtn: cc.Button = null;

    @property(BaseView)
    helpView:BaseView = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.mapBtn.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {
            /*if(location != null)
            {
                location.href = 'https://easymapeditor-1258223435.cos.ap-guangzhou.myqcloud.com/v2.0.0/web-mobile/index.html';
            }*/

            this.scheduleOnce(()=>
            {
                window.open('https://easymapeditor-1258223435.cos.ap-guangzhou.myqcloud.com/v2.0.0/web-mobile/index.html', '_blank');
            },0.2)
            
        },this);


        this.helpBtn.node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>
        {
            this.helpView.open();
        },this);


    }

    // update (dt) {}

}
