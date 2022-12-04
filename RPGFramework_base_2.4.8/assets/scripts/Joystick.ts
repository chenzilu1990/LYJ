import { MathUtil } from './models/MathUtil';
const {ccclass, property} = cc._decorator;

// const v3_1 = new Vec3;
export interface JoystickOptions {
    onOperate: (output: JoystickOutput) => void,
    onOperateEnd: () => void,
}

export interface JoystickOutput {
    // 0 ~ 1
    x: number,
    // 0 ~ 1
    y: number
}

@ccclass
export default class Joystick extends cc.Component {

    @property
    radius: number = 128;

    @property(cc.Node)
    disk: cc.Node = null as any;

    @property(cc.Node)
    stick: cc.Node = null as any;

    private _options!: JoystickOptions;
    public get options(): JoystickOptions {
        return this._options;
    }
    public set options(v: JoystickOptions) {
        this._options = v;
    }

    private _initDiskPos:cc.Vec2;
    private _initStickPos:cc.Vec2;
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouch, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        // this.disk.active = false;
        this._initDiskPos = this.disk.position
        this._initStickPos = this.stick.position
    }

    private _touchStartPos?: cc.Vec2;
    onTouch(e: cc.Event.EventTouch) {
        if (!e.touch) {
            return;
        }

        // this.disk.active = true;
        let loc = e.getLocation();

        if (!this._touchStartPos) {
            this._touchStartPos = loc.clone();
            this.disk.setPosition(loc.x, loc.y, 0);
        }

        let diskPos = this.disk.position;

        let stickPos: cc.Vec2 = loc.sub(diskPos)
        // cc.log(stickPos)
        let length = stickPos.mag();
        if (length === 0) {
            this.stick.setPosition(0, 0, 0);
            return;
        }
        let newLength = MathUtil.limit(length, 0, this.radius);
        stickPos.mulSelf(newLength / length);

        // if (length > newLength) {
        //     let newDiskPos = this.disk.position.clone().add(stickPos);
        //     this.disk.setPosition(newDiskPos);
        // }
        this.stick.setPosition(stickPos);

        stickPos.normalize();
        // cc.log(stickPos.x || 0, stickPos.y || 0)
        this.options?.onOperate({
            x: stickPos.x || 0,
            y: stickPos.y || 0
        })
    }

    onTouchEnd(e: cc.Event.EventTouch) {
        // this.disk.active = false;
        this.disk.position = this._initDiskPos
        this.stick.position = this._initStickPos
        this._touchStartPos = undefined;
        this.options?.onOperateEnd();
    }

}
