export enum ItemType{
    SEED = 0,
    ROLE = 1,
    TOOL = 2
}

export default interface ItemInfo {
  id: number;
  userManorId: number;
  userId: number;
  goodsId: number;//item ID
  orderNo: string;
  type: string;
  seedsType: string;
  name: string;
  level: string;
  growthPeriodType: string;
  growthPeriodName: string;
  outputValue: number;
  harvestIntegral: number;
  growthValue: number;
  growthPeriod: string;
  multipleOutput: string;
  speedOrSlowGrowthOutput: string;
  speedOrSlowTimeOutput: string;
  imgUrl: string;
  useNum: number;
  usedNum: number;
  residueNum: number;
  experience: number;
  status: string;
  validityPeriod: string;
  expireDate: string;
  energyValue: string;
  movementSpeed: string;
  powerValue: string;
  residueEnergyValue: string;
  figureX: string;
  figureY: string;
  createDate: string;
  updateDate: string;
  remarks: string;
}

