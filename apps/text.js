import * as tool from '../models/tool.js';
import fs from 'fs'
export class San extends plugin {
    constructor () {
      super({
        name: 'name',
        dsc: 'text',
        event: 'message',//发出提示信息
        priority: '50',//优先级
        rule: [
            { 
          reg: '^#text$',
          fnc: 'text'
          // 执行方法
            },
            { 
          reg: '^#截图.*$',
          fnc: 'screenshot'
                // 执行方法
            }   
    ]
      })
  
    }
    async text (e) {
      e.reply(Bot.fl.get(tool.masterQQ()).nickname)          
    };

    async screenshot (e){
      e.reply(e.msg.substring(3))
      let id = await tool.location_id(e.msg.substring(3))
      logger.info(id)
      let url = `https://www.qweather.com/weather/${id}.html`
      logger.info(url)
      tool.screenshot(e,url,tool.clipRegion(0,110,400,771))
    }
  }