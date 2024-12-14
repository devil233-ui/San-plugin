import common from '../../lib/common/common.js';
export class gete extends plugin {
    constructor() {
        super({
            name: 'get-e',
            dsc: '获取e实例',
            event: 'message',
            priority: 10000,
            rule: [
                {
                    reg: '^#?取', 
                    fnc: 'text'
                }
            ]
        });
    }
    async text(e){
        if (!("source" in e)){
            e.reply("请引用消息来获取e实例")
            return
        }
        let messages
        if(e.isGroup){
             messages = await e.group.getChatHistory(e.source.seq, 1)
        }else{
             messages = await e.friend.getChatHistory(e.source.time, 1)
        } 
            const jsonString = JSON.stringify(messages[0], null, 2);
            const msgjsonString = JSON.stringify(messages[0].message, null, 2);
            let makeForwardMsg = await common.makeForwardMsg(e, ["_____message_____",msgjsonString,"_____________","_____e实例_____",jsonString,"_____________"], 'e实例')
            e.reply(makeForwardMsg)
    }
    
}
