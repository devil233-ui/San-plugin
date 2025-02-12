//格式为#xx后提醒 消息内容
//没有写持久化运行,bot重启后提醒内容失效
//用deepseek写的~~~
export class news extends plugin {
    constructor() {
        super({
            name: '提醒',
            dsc: '提醒',
            event: 'message',
            priority: -50,
            rule: [
                {
                    reg: '^#(.*)提醒(.*)$',
                    fnc: 'remind'
                },
            ]
        });
    }

    async remind(e) {
        const msg = e.msg;
        const userId = e.user_id;

        // 主正则匹配提醒格式
        const mainMatch = msg.match(/^#\s*(.*?)\s*后?\s*提醒\s+(.+)$/);
        if (!mainMatch) {
            e.reply("格式错误，请使用示例格式：#1小时30分后提醒 开会");
            return;
        }

        const timePart = mainMatch[1].replace(/后/g, '').trim(); // 去除可能的后字
        const content = mainMatch[2].trim();

        // 解析时间部分
        const totalSeconds = this.parseTime(timePart);
        if (isNaN(totalSeconds) || totalSeconds <= 0) {
            e.reply("请使用正确的时间格式，示例：#1小时30分后提醒 开会");
            return;
        }

        // 设置定时器
        setTimeout(() => {
            e.reply(`提醒：${content}`, true,{ at: true });
        }, totalSeconds * 1000);

        e.reply(`✅ 已设置 ${this.formatDuration(totalSeconds)} 后的提醒：${content}`);
    }

    parseTime(timePart) {
        const timeRegex = /(\d+|[一二两三四五六七八九十]+)\s*(小时|时|分钟|分|秒|h|H|m|M|s|S)/g;
        let match;
        let totalSeconds = 0;
        let valid = false;

        while ((match = timeRegex.exec(timePart)) !== null) {
            const numberStr = match[1];
            const rawUnit = match[2].toLowerCase();
            const number = this.parseNumber(numberStr);

            if (isNaN(number)) {
                return NaN;
            }

            const unit = this.normalizeUnit(rawUnit);
            const seconds = this.convertToSeconds(number, unit);

            if (isNaN(seconds)) {
                return NaN;
            }

            totalSeconds += seconds;
            valid = true;
        }

        return valid ? totalSeconds : NaN;
    }

    parseNumber(numberStr) {
        if (/[一二两三四五六七八九十]/.test(numberStr)) {
            return this.chineseToNumber(numberStr);
        } else {
            const number = parseInt(numberStr);
            return isNaN(number) ? NaN : number;
        }
    }

    normalizeUnit(rawUnit) {
        return rawUnit.replace(/[^小时分秒]/g, char => ({
            h: '小时', m: '分', s: '秒'
        }[char.toLowerCase()] || char));
    }

    convertToSeconds(number, unit) {
        switch (unit) {
            case '小时':
            case '时':
                return number * 3600;
            case '分钟':
            case '分':
                return number * 60;
            case '秒':
                return number;
            default:
                return NaN;
        }
    }

    chineseToNumber(str) {
        const map = {
            '零': 0, '一': 1, '二': 2, '两': 2, '三': 3,
            '四': 4, '五': 5, '六': 6, '七': 7, '八': 8,
            '九': 9, '十': 10
        };

        let total = 0;
        let current = 0;

        for (const char of str) {
            const num = map[char];
            if (num === undefined) return NaN;

            if (num === 10) { // 处理十位
                total += current === 0 ? 10 : current * 10;
                current = 0;
            } else {
                current += num;
            }
        }
        return total + current;
    }

    formatDuration(seconds) {
        const units = [
            { value: 3600, name: '小时' },
            { value: 60, name: '分钟' },
            { value: 1, name: '秒' }
        ];

        return units.reduce((acc, unit) => {
            if (seconds >= unit.value) {
                const count = Math.floor(seconds / unit.value);
                seconds %= unit.value;
                acc.push(`${count}${unit.name}`);
            }
            return acc;
        }, []).join('') || '0秒';
    }
}