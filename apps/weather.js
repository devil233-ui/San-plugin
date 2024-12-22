import * as tool from '../models/tool.js';
import puppeteer from 'puppeteer';
const cfg_priority = await tool.set_priority("weather")

const Set_Quality = await tool.set_otherCfg(`imgQuality`)
export class San_Weather extends plugin {
    constructor () {
      super({
        name: 'San_weather',
        dsc: '通过截取和风天气页面获取天气信息',
        event: 'message',//发出提示信息
        priority: cfg_priority,//优先级
        rule: [
            { 
          reg: '^#?(.*)天气$',
          fnc: 'weather_info'
                // 执行方法
            }   
    ]
      })
  
    }
    async weather_info (e){
        let state = false//执行状态
        let str = e.msg
        let reg = /^#?(.*)天气$/
        let match = str.match(reg)
        //logger.error(match)
        switch(match[1]){
          case ``:
            await locationWeather(e,"北京")
            state = true;
            break;
          case `极端`:
            await JiduanWeather(e)
            state = true;
            break;
        }
        if(state == false){
          await locationWeather(e,match[1])
        }
        // if(match[1] == ""){
        //   location = "北京"
        // }else{
        //     location = match[1]
        // }      
        // // 获取对应的和风天气url
        // let url = await tool.location_url(location)
        // // 截取指定区域
        // tool.screenshot(e,url,tool.clipRegion(0,110,400,700))
      //let imgbase64 = await captureElementScreenshot("https://www.qweather.com/weather/",".c-city-warning-around")
        async function locationWeather(e,location) {
          const url = await tool.location_url(location)//网站url
          const selector = ".current-weather__bg"//选择器
          // 启动浏览器
          const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
          //const browser = await puppeteer.launch({ headless: true, args: ['--disable-setuid-sandbox'] });
          // 新建一个页面
          const page = await browser.newPage();
          // 设置页面大小
          await page.setViewport({ width: 600, height: 900 });
      
          // 打开HTML文件
          await page.goto(url, { waitUntil: 'networkidle2' });
          
          await page.waitForSelector(selector, { timeout: 5000 }); // 设置最大等待时间为5秒

          // 获取特定容器的边界
          const element_1 = await page.$(selector); 
          const boundingBox_1 = await element_1.boundingBox();

          const element_2 = await page.$(".c-city-weather-hour24"); 
          const boundingBox_2 = await element_2.boundingBox();
      
          const clip = {
            x: boundingBox_1.x-10,
            y: boundingBox_1.y - 50,
            width: boundingBox_2.width + 15,
            height: (boundingBox_2.height + boundingBox_1.height + 60),
          };

          // 将页面渲染为图片并保存到本地
          const screenshot = await page.screenshot({ clip, encoding: 'base64' });
          await page.screenshot({
              fullPage: false,
              clip: clip ,// 使用传递进来的裁剪区域
              type: 'jpeg',
              quality: Set_Quality ,// JPEG图片的质量，范围是1到100
              omitBackground: true, // 防止背景颜色影响透明度
              encoding: 'base64'
          });
      
          // 发送图片
          e.reply(segment.image(`base64://${screenshot}`))
      
          // 关闭浏览器
          browser.close();
      }


      
      async function JiduanWeather(e) {
        const url = "https://www.qweather.com/weather/"
        const selector = ".c-city-warning-around"//选择器
        // 启动浏览器
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        //const browser = await puppeteer.launch({ headless: true, args: ['--disable-setuid-sandbox'] });
        // 新建一个页面
        const page = await browser.newPage();
        // 设置页面大小
        await page.setViewport({ width: 600, height: 900 });
    
        // 打开HTML文件
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        await page.waitForSelector(selector, { timeout: 5000 }); // 设置最大等待时间为5秒

        // 获取特定容器的边界
        const element_1 = await page.$(selector); 
        const boundingBox_1 = await element_1.boundingBox();

    
        const clip = {
          x: boundingBox_1.x,
          y: boundingBox_1.y,
          width: boundingBox_1.width ,
          height: boundingBox_1.height,
        };

        // 将页面渲染为图片并保存到本地
        const screenshot = await page.screenshot({ clip, encoding: 'base64' });
        await page.screenshot({
            fullPage: false,
            clip: clip ,// 使用传递进来的裁剪区域
            type: 'jpeg',
            quality: Set_Quality ,// JPEG图片的质量，范围是1到100
            omitBackground: true, // 防止背景颜色影响透明度
            encoding: 'base64'
        });
    
        // 发送图片
        e.reply(segment.image(`base64://${screenshot}`))
    
        // 关闭浏览器
        browser.close();
    }
    }
}


