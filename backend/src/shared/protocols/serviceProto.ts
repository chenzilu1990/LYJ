import { ServiceProto } from 'tsrpc-proto';
import { MsgClientInput } from './client/MsgClientInput';
import { ReqJoin, ResJoin } from './PtlJoin';
import { MsgFrame } from './server/MsgFrame';
import { MsgRandomMapdata } from './server/MsgRandomMapdata';

export interface ServiceType {
    api: {
        "Join": {
            req: ReqJoin,
            res: ResJoin
        }
    },
    msg: {
        "client/ClientInput": MsgClientInput,
        "server/Frame": MsgFrame,
        "server/RandomMapdata": MsgRandomMapdata
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 10,
    "services": [
        {
            "id": 0,
            "name": "client/ClientInput",
            "type": "msg"
        },
        {
            "id": 1,
            "name": "Join",
            "type": "api"
        },
        {
            "id": 2,
            "name": "server/Frame",
            "type": "msg"
        },
        {
            "id": 3,
            "name": "server/RandomMapdata",
            "type": "msg"
        }
    ],
    "types": {
        "client/MsgClientInput/MsgClientInput": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "sn",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "inputs",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "client/MsgClientInput/ClientInput"
                        }
                    }
                }
            ]
        },
        "client/MsgClientInput/ClientInput": {
            "type": "Union",
            "members": [
                {
                    "id": 0,
                    "type": {
                        "target": {
                            "type": "Reference",
                            "target": "../game/GameSystem/PlayerMove"
                        },
                        "keys": [
                            "playerId"
                        ],
                        "type": "Omit"
                    }
                },
                {
                    "id": 1,
                    "type": {
                        "target": {
                            "type": "Reference",
                            "target": "../game/GameSystem/PlayerAttack"
                        },
                        "keys": [
                            "playerId"
                        ],
                        "type": "Omit"
                    }
                },
                {
                    "id": 2,
                    "type": {
                        "target": {
                            "type": "Reference",
                            "target": "../game/GameSystem/MovePlyer"
                        },
                        "keys": [
                            "playerId"
                        ],
                        "type": "Omit"
                    }
                },
                {
                    "id": 3,
                    "type": {
                        "target": {
                            "type": "Reference",
                            "target": "../game/GameSystem/MoveEnd"
                        },
                        "keys": [
                            "playerId"
                        ],
                        "type": "Omit"
                    }
                },
                {
                    "id": 4,
                    "type": {
                        "target": {
                            "type": "Reference",
                            "target": "../game/GameSystem/PlayerPos"
                        },
                        "keys": [
                            "playerId"
                        ],
                        "type": "Omit"
                    }
                }
            ]
        },
        "../game/GameSystem/PlayerMove": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "type",
                    "type": {
                        "type": "Literal",
                        "literal": "PlayerMove"
                    }
                },
                {
                    "id": 1,
                    "name": "playerId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "speed",
                    "type": {
                        "type": "Interface",
                        "properties": [
                            {
                                "id": 0,
                                "name": "x",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 1,
                                "name": "y",
                                "type": {
                                    "type": "Number"
                                }
                            }
                        ]
                    }
                },
                {
                    "id": 3,
                    "name": "dt",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "../game/GameSystem/PlayerAttack": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "type",
                    "type": {
                        "type": "Literal",
                        "literal": "PlayerAttack"
                    }
                },
                {
                    "id": 1,
                    "name": "playerId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "targetPos",
                    "type": {
                        "type": "Interface",
                        "properties": [
                            {
                                "id": 0,
                                "name": "x",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 1,
                                "name": "y",
                                "type": {
                                    "type": "Number"
                                }
                            }
                        ]
                    }
                },
                {
                    "id": 3,
                    "name": "targetTime",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "../game/GameSystem/MovePlyer": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "type",
                    "type": {
                        "type": "Literal",
                        "literal": "MovePlayer"
                    }
                },
                {
                    "id": 3,
                    "name": "playerId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 4,
                    "name": "targetX",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 5,
                    "name": "targetY",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 6,
                    "name": "x",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 7,
                    "name": "y",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "../game/GameSystem/MoveEnd": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "type",
                    "type": {
                        "type": "Literal",
                        "literal": "MoveEnd"
                    }
                },
                {
                    "id": 1,
                    "name": "playerId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "moving",
                    "type": {
                        "type": "Boolean"
                    }
                }
            ]
        },
        "../game/GameSystem/PlayerPos": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "type",
                    "type": {
                        "type": "Literal",
                        "literal": "PlayerPos"
                    }
                },
                {
                    "id": 1,
                    "name": "playerId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "x",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "y",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "PtlJoin/ReqJoin": {
            "type": "Interface"
        },
        "PtlJoin/ResJoin": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "playerId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "gameState",
                    "type": {
                        "type": "Reference",
                        "target": "../game/GameSystem/GameSystemState"
                    }
                },
                {
                    "id": 2,
                    "name": "players",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Number"
                        }
                    }
                }
            ]
        },
        "../game/GameSystem/GameSystemState": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "now",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "players",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../game/state/PlayerState/PlayerState"
                        }
                    }
                },
                {
                    "id": 2,
                    "name": "arrows",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../game/state/ArrowState/ArrowState"
                        }
                    }
                },
                {
                    "id": 3,
                    "name": "nextArrowId",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "../game/state/PlayerState/PlayerState": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "pos",
                    "type": {
                        "type": "Interface",
                        "properties": [
                            {
                                "id": 0,
                                "name": "x",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 1,
                                "name": "y",
                                "type": {
                                    "type": "Number"
                                }
                            }
                        ]
                    }
                },
                {
                    "id": 2,
                    "name": "dizzyEndTime",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "targetX",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 4,
                    "name": "targetY",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 7,
                    "name": "moving",
                    "type": {
                        "type": "Boolean"
                    }
                },
                {
                    "id": 8,
                    "name": "x",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 9,
                    "name": "y",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "../game/state/ArrowState/ArrowState": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "fromPlayerId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "targetTime",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "targetPos",
                    "type": {
                        "type": "Interface",
                        "properties": [
                            {
                                "id": 0,
                                "name": "x",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 1,
                                "name": "y",
                                "type": {
                                    "type": "Number"
                                }
                            }
                        ]
                    }
                }
            ]
        },
        "server/MsgFrame/MsgFrame": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "inputs",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../game/GameSystem/GameSystemInput"
                        }
                    }
                },
                {
                    "id": 1,
                    "name": "lastSn",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                }
            ]
        },
        "../game/GameSystem/GameSystemInput": {
            "type": "Union",
            "members": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../game/GameSystem/PlayerMove"
                    }
                },
                {
                    "id": 1,
                    "type": {
                        "type": "Reference",
                        "target": "../game/GameSystem/PlayerAttack"
                    }
                },
                {
                    "id": 2,
                    "type": {
                        "type": "Reference",
                        "target": "../game/GameSystem/PlayerJoin"
                    }
                },
                {
                    "id": 3,
                    "type": {
                        "type": "Reference",
                        "target": "../game/GameSystem/PlayerLeave"
                    }
                },
                {
                    "id": 4,
                    "type": {
                        "type": "Reference",
                        "target": "../game/GameSystem/TimePast"
                    }
                },
                {
                    "id": 5,
                    "type": {
                        "type": "Reference",
                        "target": "../game/GameSystem/MovePlyer"
                    }
                },
                {
                    "id": 7,
                    "type": {
                        "type": "Reference",
                        "target": "../game/GameSystem/PlayerPos"
                    }
                },
                {
                    "id": 6,
                    "type": {
                        "type": "Reference",
                        "target": "../game/GameSystem/MoveEnd"
                    }
                }
            ]
        },
        "../game/GameSystem/PlayerJoin": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "type",
                    "type": {
                        "type": "Literal",
                        "literal": "PlayerJoin"
                    }
                },
                {
                    "id": 1,
                    "name": "playerId",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "pos",
                    "type": {
                        "type": "Interface",
                        "properties": [
                            {
                                "id": 0,
                                "name": "x",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 1,
                                "name": "y",
                                "type": {
                                    "type": "Number"
                                }
                            }
                        ]
                    }
                }
            ]
        },
        "../game/GameSystem/PlayerLeave": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "type",
                    "type": {
                        "type": "Literal",
                        "literal": "PlayerLeave"
                    }
                },
                {
                    "id": 1,
                    "name": "playerId",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "../game/GameSystem/TimePast": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "type",
                    "type": {
                        "type": "Literal",
                        "literal": "TimePast"
                    }
                },
                {
                    "id": 1,
                    "name": "dt",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "server/MsgRandomMapdata/MsgRandomMapdata": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "randomData",
                    "type": {
                        "type": "Interface",
                        "indexSignature": {
                            "keyType": "String",
                            "type": {
                                "type": "Number"
                            }
                        }
                    }
                }
            ]
        }
    }
};