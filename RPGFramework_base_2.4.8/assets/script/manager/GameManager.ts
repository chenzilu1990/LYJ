// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Monster from "../game/character/Monster";
import NPC from "../game/character/NPC";
import Player from "../game/character/Player";
import SpawnPoint from "../game/transfer/SpawnPoint";
import TransferDoor from "../game/transfer/TransferDoor";



const {ccclass, property} = cc._decorator;

/**
 * 游戏管理器，用来管理各类资源
 * @作者 落日故人 QQ 583051842
 */
@ccclass
export default class GameManager extends cc.Component {

    private static _instance: GameManager;
    public static get instance(): GameManager {

        return GameManager._instance;
    }

    /**
     * 玩家预制体
     */
    @property(cc.Prefab)
    public playerPrefab:cc.Prefab = null;

    /**
     * 怪物预制体
     */
    @property(cc.Prefab)
    public monsterPrefab:cc.Prefab = null;

    /**
     * npc预制体
     */
    @property(cc.Prefab)
    public npcPrefab:cc.Prefab = null;

    /**
     * 出生点预制体
     */
    @property(cc.Prefab)
    public spawnPointPrefab:cc.Prefab = null;

    /**
     * 传送点预制体
     */
    @property(cc.Prefab)
    public transferDoorPrefabs:cc.Prefab[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        if(!GameManager._instance)
        {
            GameManager._instance = this;
            cc.game.addPersistRootNode(this.node);
            this.init();
        }else
        {
            this.node.destroy(); //场景里只能有一个GameManager,有多余的必须销毁
        }
    }

    public init()
    {

    }

    // update (dt) {}

    public getPlayer():Player
    {
        var node:cc.Node = cc.instantiate(this.playerPrefab);
        var player = node.getComponent(Player);
        player.node.position = new cc.Vec3(0,0,0);
        player.node.active = true;
        return player;
    }

    /**
     * 获得npc
     * @param npcId 
     * @returns 
     */
    public getNPC():NPC
    {
        var npc:NPC = cc.instantiate(this.npcPrefab).getComponent(NPC);
        npc.node.active = true;
        npc.node.position = cc.Vec3.ZERO;
        return npc;
    }

     /**
     * 获得怪物
     * @param monsterId 
     * @returns 
     */
    public getMonster():Monster
    {
        var monster:Monster = cc.instantiate(this.monsterPrefab).getComponent(Monster);
        monster.node.active = true;
        monster.node.position = cc.Vec3.ZERO;

        return monster;
    }

    /**
     * 获得出生点资源
     * @returns 
     */
    public getSpawnPoint():SpawnPoint
    {
        var spawnPoint:SpawnPoint = cc.instantiate(this.spawnPointPrefab).getComponent(SpawnPoint);
        spawnPoint.node.active = true;
        spawnPoint.node.position = cc.Vec3.ZERO;
        
        return spawnPoint;
    }

    /**
     * 获得传送点资源
     * @returns 
     */
    public getTransferDoor(type:number):TransferDoor
    {
        var index:number = 0;

        if(type < this.transferDoorPrefabs.length)
        {
            index = type;
        }

        var transferDoor:TransferDoor = cc.instantiate(this.transferDoorPrefabs[index]).getComponent(TransferDoor);
        transferDoor.node.active = true;
        transferDoor.node.position = cc.Vec3.ZERO;
        
        return transferDoor;
    }
}
