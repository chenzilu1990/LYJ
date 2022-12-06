// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import MapParams from "../base/MapParams";
import MapRoadUtils from "../road/MapRoadUtils";
import LandView from "../../view/LandView";
import SceneMap from "../../SceneMap";

const {ccclass, property} = cc._decorator;



/**
 * 地图层 
 * @author 落日故人 QQ 583051842
 * 
 */
@ccclass
export default class CardLayer extends cc.Component {
		
		/**
		 *切割小图片集 
		 */		
		private _sliceImgDic:{[key:string]:cc.Sprite} = {};
		
		
		private _mapParams:MapParams = null;


		
		private sceneMap: SceneMap = null;


		public init(mapParams:MapParams, sceneMap: SceneMap):void
		{
			this.sceneMap = sceneMap
			this._mapParams = mapParams
			
			this.node.width = this.width
			this.node.height = this.height



		}

		private _addLandView: { [key: string]: LandView } = {}

		private optimize: boolean = true

		public loadLandViews(x:number, y:number): void {

			let pointCenter = MapRoadUtils.instance.getWorldPointByPixel(x, y)
			
			const hideWidth = 10
			const left = pointCenter.x - hideWidth
			const right = pointCenter.x + hideWidth
			const down = pointCenter.y - hideWidth
			const up = pointCenter.y + hideWidth

			for (var i: number = left; i <= right; i++) {
				for (var j: number = down; j <= up; j++) {

					const key = i + "_" + j; // 图片的索引是从1开始的，所以要加1

					const leftUp = (left - 1) + "_" + (up + 1);
					const rightDown = (right + 1) + "_" + (down - 1);
					const rightUp = (right + 1) + "_" + (up + 1);
					const leftDown = (left - 1) + "_" + (down - 1);

					const outLeftkey = (left - 1) + "_" + j;
					const outRightkey = (right + 1) + "_" + j;
					const outDownkey = i + "_" + (down - 1);
					const outUpkey = i + "_" + (up + 1);
					
					let landV = this._addLandView[key]

					let leftUpV = this._addLandView[leftUp]
					let rightDownV = this._addLandView[rightDown]
					let rightUpV = this._addLandView[rightUp]
					let leftDownV = this._addLandView[leftDown]

					let outleftV = this._addLandView[outLeftkey]
					let outrightV = this._addLandView[outRightkey]
					let outdownV = this._addLandView[outDownkey]
					let outupV = this._addLandView[outUpkey]
					
					let { x, y } = MapRoadUtils.instance.getPixelByWorldPoint(i, j)

					if (!landV) {
					
						if (i === left && outrightV ){
							landV = outrightV
						} 
						else if (i === right && outleftV ){
							landV = outleftV
						} 
						else if (j === up && (outdownV ) ){
							landV = outdownV
						} 
						else if (j === down && (outupV ) ){
							landV = outupV 
						} 
						else if (i === left && j === up && rightDownV) {
							landV = rightDownV
						}
						else if (i === right && j === down && leftUpV) {
							landV = leftUpV
						}
						else if (i === right && j === up && leftDownV) {
							landV = leftDownV
						}
						else if (i === left && j === down && rightUpV) {
							landV = rightUpV
						}
						else {
							let landView = this.dequeueReusableLandView(i, j)
							this.node.addChild(landView.node)
							landV = landView
						}
					} 
					this._addLandView[key] = landV

					landV.node.zIndex = cc.macro.MAX_ZINDEX - ( i* 100 + j)
					landV.node.x = x
					landV.node.y = y
					landV.roadNode = MapRoadUtils.instance.getNodeByWorldPoint(i, j)
					
					// landV.nodeType = this.sceneMap.resDic[i+'_'+j]
					// cc.log("update landV=====end")
				}
			}
			// cc.log(this.node.children.length)
		}



		@property(cc.Prefab)
		private landViewPrefab:cc.Prefab = null


		private dequeueReusableLandView(dx: number, dy: number): LandView {
			let key = dx + "_" + dy

			let	landNode = cc.instantiate(this.landViewPrefab)
		
			
			let landView = landNode.getComponent("LandView")

			return landView

		}

		public get width():number
		{
			return this._mapParams.viewWidth;
		}

		public get height():number
		{
			return this._mapParams.viewHeight;
		}
		

}
