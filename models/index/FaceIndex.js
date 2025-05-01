import * as tool from '../tool.js';
import { Cfg } from '../cfg/cfg.js';
const cfg = new Cfg();
async function faceIndex(){
    let facePath = await cfg.face("path")
    let facelist = await tool.readFromJsonFile(facePath)
    if(!(facelist?.version) || facelist?.version !== await cfg.face('version')){
        const faceVersion = await cfg.face('version')
        if(facelist?.version){
            facelist.version = faceVersion

            tool.JsonWrite(facelist,facePath)
        }else{
            //无version参数第一版结构
            // {
            //           "测试": {
            //             "list": [
            //               {
            //                 "user_id": 3126986875,
            //                 "time": "2025-01-12 14:30:52",
            //                 "type": "other",
            //                 "msg": 源码,
            //                 "rand": []
            //               }
            //             ]
            //           },
            //           "你好": {
            //             "list": [
            //               {
            //                 "user_id": 3126986875,
            //                 "time": "2025-01-12 14:31:54",
            //                 "type": "image",
            //                 "url": "",
            //                 "imageFile": "./plugins/San-plugin/resources/face/images/1.gif",
            //                 "rand": []
            //               },
            // }
            let newfacelist = {
                version: faceVersion,
                faceData: facelist
            }
            tool.JsonWrite(newfacelist,facePath)
        
        }

    }
}
//第一版更新函数
async function update() {
    const faceVersion = await cfg.face('version')
    let facelist = await tool.readFromJsonFile(facePath)
    let newfacelist = {
        version: faceVersion,
        faceData: {
            global: facelist
        }
    }

    
}







export { faceIndex }