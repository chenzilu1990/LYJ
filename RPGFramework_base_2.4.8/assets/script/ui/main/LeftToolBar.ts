// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Main from "../../Main";
import { MapLoadModel } from "../../map/base/MapLoadModel";


const {ccclass, property} = cc._decorator;

/**
 * 底部工具栏，测试功能用，可以删
 */
@ccclass
export default class LeftToolBar extends cc.Component {

    @property(cc.Button)
    mapBtn1: cc.Button = null;

    @property(cc.Button)
    mapBtn2: cc.Button = null;

    @property(cc.Button)
    mapBtn3: cc.Button = null;

    @property(cc.Node)
    HDmap: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.mapBtn1.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {
            Main.instance.loadMap("10001",MapLoadModel.slices)
            
        },this);
        
        this.mapBtn2.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {
            Main.instance.loadMap("10002",MapLoadModel.slices)

            
        },this);

        this.mapBtn3.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {
            this.HDmap.active = !this.HDmap.active
            
        },this);

    }



}
