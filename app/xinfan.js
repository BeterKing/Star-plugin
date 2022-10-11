import lodash from 'lodash'
import puppeteer from "../../../lib/puppeteer/puppeteer.js"
import fetch from 'node-fetch'
import plugin from '../../../lib/plugins/plugin.js'

export class xinfan extends plugin{
    constructor(){
        super(
            {
                name: '新番导视',
                event: 'message',
                priority: 10,
                rule:[{
                    reg:'^新番导视$',
                    fnc:'xinfan'
                }]
            }
        )
        this._path = process.cwd().replace(/\\/g, "/");
    }

    async xinfan (){
        let datas =[]
        let url ='https://bangumi.bilibili.com/web_api/timeline_global'
        let response = await(await fetch(url)).json()
        lodash.forEach(response.result,(season)=>{
            lodash.forEach(season.seasons,(seasons)=>{
            })
            datas.push(season)
          })
        for(let i in datas){
            if(datas[i].is_today===1){
                datas=datas.splice(i-1,datas.length-i+1-4)
                break
            }
        }
        let data = {
            tplFile:`./plugins/Star-plugin/data/html/xinfan.html`,
            css_path: `${this._path}/plugins/Star-plugin/data/html/`,
            saveId: 'xinfan',
            imgType: 'png',
            datas
        }
        let img = await puppeteer.screenshot("xinfan", data)
        await this.reply(img)
    }
}