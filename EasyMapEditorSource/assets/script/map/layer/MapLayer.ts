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
import { MapLoadModel } from "../base/MapLoadModel";
import GameConfig from "../../GameConfig";

const {ccclass, property} = cc._decorator;
const SLICE_COL = 4
const SLICE_ROW = 2
let SLICE_W_NUM = 0
let SLICE_H_NUM = 0

/**
 * 地图层 
 * @author 落日故人 QQ 583051842
 * 
 */
@ccclass
export default class MapLayer extends cc.Component {
		
		/**
		 *切割小图片集 
		 */		
		private _sliceImgDic:{[key:string]:cc.Sprite} = {};
		
		
		private _mapParams:MapParams = null;

		@property(cc.Sprite)
		private bgImg:cc.Sprite = null;
		
		private _sliceW: number
		private _sliceH: number
		
		public init(mapParams:MapParams):void
		{
			this._mapParams = mapParams;
			
			if(!this.bgImg)
			{
				var bgNode:cc.Node = new cc.Node();
				this.node.addChild(bgNode);
				bgNode.anchorX = 0;
				bgNode.anchorY = 0;
				this.bgImg = bgNode.addComponent(cc.Sprite);
			}

			this.bgImg.spriteFrame = new cc.SpriteFrame(this._mapParams.bgTex);

			//如果是马赛克小地图，则需要把小地图缩放成原始地图一样大小
			if(mapParams.mapLoadModel == MapLoadModel.slices)
			{
				this.bgImg.node.width = mapParams.mapWidth;
				this.bgImg.node.height = mapParams.mapHeight;
			}

			this.node.width = this.width;
			this.node.height = this.height;

			this._sliceW = mapParams.mapWidth / SLICE_COL
			this._sliceH = mapParams.mapHeight / SLICE_ROW
			SLICE_W_NUM = Math.ceil(this._sliceW/this._mapParams.sliceWidth)
			SLICE_H_NUM = Math.ceil(this._sliceH/this._mapParams.sliceHeight)
			// cc.log(this._sliceW, this._sliceH, SLICE_W_NUM, SLICE_H_NUM)
			
		}

		
		public load(url:String):void
		{
			//ResourceLoader.getInstance().load(url,onLoadComplete);	
		}
		
		public onLoadComplete():void
		{
			//var bitmapData:BitmapData = (content as Bitmap).bitmapData;
			//_bgImg.bitmapData = bitmapData;
			//this.dispatchEvent(new MsgEvent(MsgEvent.INIT_COMP,{width:bitmapData.width,height:bitmapData.height}));
		}


		/**
		 * 根据视图区域加载小地图
		 * @param px 滚动视图左上角的x坐标 
		 * @param py 滚动视图左上角的y坐标 
		 * 
		 */	

		public loadSliceImage(px:number,py:number):void
		{
			const px1 = px + this._mapParams.viewWidth
			const py1 = py + this._mapParams.viewHeight

			// var iy1:number = Math.floor(py / this._mapParams.sliceHeight);
			// var iy2:number = Math.floor(py1 / this._mapParams.sliceHeight);

			// var jx1:number = Math.floor(px / this._mapParams.sliceWidth);  
			// var jx2:number = Math.floor(px1 / this._mapParams.sliceWidth);
			
			var iy1: number = SLICE_H_NUM * Math.floor(py / this._sliceH) + Math.floor((py % this._sliceH) / this._mapParams.sliceHeight) - 1
			var iy2: number = SLICE_H_NUM * Math.floor(py1 / this._sliceH) + Math.floor((py1 % this._sliceH) / this._mapParams.sliceHeight) + 1

			var jx1: number = SLICE_W_NUM * Math.floor(px / this._sliceW) + Math.floor((px % this._sliceW) / this._mapParams.sliceWidth) - 1
			var jx2: number = SLICE_W_NUM * Math.floor(px1 / this._sliceW) + Math.floor((px1 % this._sliceW) / this._mapParams.sliceWidth) + 1

			// cc.log(px, py, this._mapParams.viewWidth, this._mapParams.viewHeight, Ljx1, Ljx2)
			// cc.log(Ljx1, Ljx2)
			// cc.log(Liy1, Liy2)

			const getKey = (x, y) => {
				let col = Math.floor(x / SLICE_W_NUM)
				
				let row = Math.floor(y / SLICE_H_NUM)
				
				let index = row*SLICE_COL + col + 1

				
				if(index < 10){
					index = "0"+index
				}
				
				let key = index + "/" + ((y % SLICE_H_NUM + 1)) + "_" + ((x % SLICE_W_NUM + 1));
				// let key = index + "/" + "slices/" + ((y % SLICE_H_NUM + 1)) + "_" + ((x % SLICE_W_NUM + 1));
				
				return key
			}

			for(var i:number = iy1 ; i <= iy2 ; i++)
			{
				for(var j:number = jx1 ; j <= jx2 ; j++)
				{
					let key = getKey(j,i)
					if(!this._sliceImgDic[key])
					{
						if (i == iy1 || i == iy2 || j == jx1 || j == jx2) {
							continue
						}
						let bitmap:cc.Sprite = this.getSliceSprite(key)
						this._sliceImgDic[key] = bitmap;
						this.node.addChild(bitmap.node);
						bitmap.node.x = this._sliceW * Math.floor(j / SLICE_W_NUM) + (j % SLICE_W_NUM) * this._mapParams.sliceWidth;
						bitmap.node.y = this._sliceH * Math.floor(i / SLICE_H_NUM) + (i % SLICE_H_NUM) * this._mapParams.sliceHeight;


						var root = "http://127.0.0.1:8080/"; //填写你的远程资源地址

						cc.loader.load(root + key + ".jpg",(err:Error,tex:cc.Texture2D)=>
						{
							if(err)
							{
								cc.log("加载远程资源失败",err);
							}else
							{
								bitmap.spriteFrame = new cc.SpriteFrame(tex);
							}
						});
						// cc.log(root + key)
						// cc.loader.loadRes("map/bg/map_bg/" + key,cc.Texture2D,(error:Error,tex:cc.Texture2D)=>
						// {
						// 	if (GameConfig.loadHDMap){

						// 		bitmap.spriteFrame = new cc.SpriteFrame(tex);
						// 	}
						// });
					} else {
						if (i == iy1 || i == iy2 || j == jx1 || j == jx2) {
							if (this._sliceImgDic[key].node.active){
								this._sliceImgDic[key].node.active = false
							}
						} else {
							if (!this._sliceImgDic[key].node.active){
								this._sliceImgDic[key].node.active = true
							}
						}
					}
				}
			}


		}

		private getSliceSprite(name:string)
		{
			var node:cc.Node = new cc.Node(name);
			var sprite:cc.Sprite = node.addComponent(cc.Sprite);
			node.anchorX = 0;
			node.anchorY = 0;
			return sprite;
		}
		
		public clear():void
		{
			this.bgImg.spriteFrame = null;
			
			for(var key in this._sliceImgDic)
			{
				var bitmap:cc.Sprite = this._sliceImgDic[key];
				bitmap && bitmap.node.destroy();
				this._sliceImgDic[key] = null;
				delete this._sliceImgDic[key];
			}
		}
		
		public  get bgImage():cc.Sprite
		{
			return this.bgImg;
		}

		public get width():number
		{
			if(this.bgImg)
			{
				return this.bgImg.node.width;
			}

			return this._mapParams.viewWidth;
		}

		public get height():number
		{
			if(this.bgImg)
			{
				return this.bgImg.node.height;
			}

			return this._mapParams.viewHeight;
		}
}
