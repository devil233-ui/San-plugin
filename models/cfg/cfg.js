import * as tool from '../tool.js';
import path from "path"
class Cfg{
    constructor () {}

    async face(name){
        if(name == "version"){
            const packagejson = await tool.readFromJsonFile("./plugins/San-plugin/package.json")
            return packagejson.appVersion.faceVersion
        }

        if(name == "path"){
            const relativePath = "./plugins/San-plugin/resources/face/userface.json";
            const absolutePath = path.resolve(relativePath)
            return absolutePath
        }
    }
}

export { Cfg }