import YAML from 'yaml' 
import fs from 'node:fs'

class Baise {
    constructor() {
        /** 默认设置 */
        this.defSetPath = "./plugins/Star-plugin/config/default_config/"
        this.defSet = {}
    
        /** 用户设置 */
        this.configPath = "./plugins/Star-plugin/config/config/"
        this.config = {}
    
        /** 监听文件 */
        this.watcher = { config: {}, defSet: {} }
      }

      getYaml (name,type) {
        let file = this.getFilePath(name,type)
        let key = `${name}.${type}`
        this[key] = YAML.parse(
          fs.readFileSync(file, 'utf8')
        )
        return this[key]
      }

      storage(data,name, type) {
        let file =this.getFilePath(name,type)
        fs.writeFileSync(file, YAML.stringify(data), 'utf-8')
      }

      getFilePath(name, type) {
        if (type == "data") return `./plugins/Star-plugin/data/${name}/${name}.yaml`
        if (type == "defSet") return `${this.defSetPath}${name}.yaml`
        else return `${this.configPath}${name}.yaml`
      }
      
      async makeForwardMsg (e,qq, title, msg, massege) {
        let nickname = Bot.nickname
        if (e.isGroup) {
          let info = await Bot.getGroupMemberInfo(e.group_id, qq)
          nickname = info.card ?? info.nickname
        }
        let userInfo = {
          user_id: Bot.uin,
          nickname
        }
        let forwardMsg = [
          {
            ...userInfo,
            message: title
          }
        ]
        if(massege){
          forwardMsg.push(
            {
              ...userInfo,
              message: msg
            }
          )
          forwardMsg.push(
            {
              ...userInfo,
              message: massege
            }
          )
        }else{
          for (let i in msg) {
            forwardMsg.push(
              {
                ...userInfo,
                message: msg[i]
              }
            )
          }
        }
        /** 制作转发内容 */
        if (e.isGroup) {
          forwardMsg = await e.group.makeForwardMsg(forwardMsg)
        } else {
          forwardMsg = await e.friend.makeForwardMsg(forwardMsg)
        }
        /** 处理描述 */
        forwardMsg.data = forwardMsg.data
          .replace(/\n/g, '')
          .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
          .replace(/___+/, `<title color="#777777" size="26">${title}</title>`)
        return forwardMsg
      }
    }

export default new Baise()