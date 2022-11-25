export const GameConfig   =  {
    // host: "https://admin.numberonespace.com",
    host: "https://admin.cteametaverse.com/cyz/", 
    
    // wsServer: "wss://admin.numberonespace.com/chat/",
    // wsServer: "wss://admin.cteametaverse.com/chat/",
    wsServer: `ws://${location.hostname}:3000`,
    // wsServer: `ws://192.168.31.122:3000`,
    
    // mapSlices: "https://chayuzhou-1257379372.cos.ap-shanghai.myqcloud.com/slices_CYZ/",
    // mapSlices: "http://192.168.16.103:8080/slices_CYZ/",
    // mapSlices: "https://xintuyuan-1257379372.cos.ap-shanghai.myqcloud.com/slices_2048/slice",
    mapSlices: "http://127.0.0.1:8080/slices_LYZ/",

    // SLICE_H_NUM : 20, 
    // SLICE_W_NUM : 17,

    // SLICE_COL : 8,
    // SLICE_ROW : 4,
    
    debug: false,
    mapDebug:false,
    generateData:true,
    
    version : "1.2.2",
    verCode : 1202,
    
    // cardW:200,
    // cardH:100,
    
    theme:"LYZ",
    
    isPlayWithUE5: true
}
