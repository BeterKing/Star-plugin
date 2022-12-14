
import basie from '../model/basie.js'

export class comintercept extends plugin {
  constructor () {
    let rule = {
      fnc: 'lanjie'
    }
    super(
      {
        name: '指令拦截',
        des: '禁止指令',
        event: 'message',
        priority: 2,
        rule: [rule,
          {
            reg: '#禁止(.*)$',
            fnc: 'jinzhi'
          },
          {
            reg: '#开放(.*)$',
            fnc: 'del'
          },
          {
            reg: '#列表|#本群列表$',
            fnc: 'help'
          }
        ]
      }
    )
    this.configs = basie.getYaml("config","config")
    this.data = basie.getYaml("intercept","data")
    Object.defineProperty(rule, 'log', {
      get: () => false
    })
  }

  async lanjie () {
    if (!this.e.isGroup) {
      return false
    }
    for (let i in this.data) {
      if (this.data[i].groupid === this.e.group_id) {
        for (let j in this.data[i].word) {
          if (!/#禁止/.test(this.e.msg) && !/#开放/.test(this.e.msg) && this.data[i].word[j].includes('XX') && this.e.msg.includes(this.data[i].word[j].replace(/XX/, ''))) {
            return true
          }
          if (this.data[i].word[j] === this.e.msg) {
            if(!this.configs.Setintercept){
              return true
            }else{
              this.e.reply('该指令此已被禁止哦~')
              return true
            }
          }
        }
      }
    }
    return false
  }

  /** 私聊命令后加空格和群号，群聊自动识别该群 */
  async jinzhi () {
    if (!this.e.isMaster) {
      this.e.reply('只有主人才能命令我哦~')
      return true
    }
    let mag=[]
    let list = this.e.msg.split(' ')
    var add=list[0].replace(/#禁止/, '')
    if (list[1] === undefined) {
      if (!this.e.isGroup) {
        this.e.reply('请在需要禁用的群聊中使用，或加上群号呢~')
        return true
      }
      for (let i in this.data) {
        if (this.data[i].groupid === this.e.group_id) {
          mag = this.data[i].word
          for (let j in mag) {
            if (mag[j] === add) {
              this.e.reply("已经禁止该指令了哦~")
              return true
            }
          }
          mag.push(add)
          this.data[i].word = mag
          basie.storage(this.data,"intercept","data")
          this.e.reply(`${add}已成功禁止~`)
          return true
        }
      }
      this.data.push({groupid:this.e.group_id,word:[add]})
      basie.storage(this.data,"intercept","data")
      this.e.reply(`${add}已成功禁止~`)
      return true
    } else {
      for (let i in this.data) {
        if (this.data[i].groupid === Number(list[1])) {
          mag = this.data[i].word
          for(let j in mag){
            if(mag[j] === add){
              this.e.reply("这个词语已经禁止过了哦~")
              return true
            }
          }
          mag.push(add)
          this.data[i].word = mag
          basie.storage(this.data,"intercept","data")
          this.e.reply(`${add}已成功禁止~`)
          return true
        }
      }
      this.data.push({groupid:Number(list[1]),word:[add]})
      basie.storage(this.data,"intercept","data")
      this.e.reply(`${add}已成功禁止~`)
      return true
    }
  }

  /** 私聊命令后加空格和群号，群聊自动识别该群 */
  async del () {
    if (!this.e.isMaster) {
      this.e.reply('只有主人才能命令我哦~')
      return true
    }
    let list = this.e.msg.split(' ')
    let del = list[0].replace(/#开放/, '')
    let mag = []
    if (list[1] === undefined) {
      if (!this.e.isGroup) {
        this.e.reply('请在需要开放的群聊中使用，或加上群号呢~')
        return true
      }
      for (let i in this.data) {
        if (this.data[i].groupid === this.e.group_id) {
          mag = this.data[i].word
          if (mag.length === 0) {
            this.e.reply('这个群并没有禁用指令哦~')
            return true
          }
          for (let j in mag) {
            if (mag[j] === del) {
              mag.splice(j, 1)
              this.data[i].word = mag
              basie.storage(this.data,"intercept","data")
              this.e.reply(`${del}已成功开放~`)
              return true
            }
          }
          this.e.reply('并没有禁止这个指令哦~')
          return true
        }
      }
    } else {
      for (let i in this.data) {
        if (this.data[i].groupid === Number(list[1])) {
          mag = this.data[i].word
          if (mag.length === 0) {
            this.e.reply('这个群并没有禁用指令哦~')
            return true
          }
          for (let j in mag) {
            if (mag[j] === del) {
              mag.splice(j, 1)
              this.data[i].word = mag
              basie.storage(this.data,"intercept","data")
              this.e.reply(`${del}已成功开放~`)
              return true
            }
          }
          this.e.reply('并没有禁止这个指令哦~')
          return true
        }
      }
    }
  }

  /** 查看列表（可主人查看所有列表，群员查看本群列表） */
  async help () {
    let msg = []
    let massege = []
    if (this.e.msg === '#本群列表') {
      if (!this.e.isGroup) {
        this.e.reply('请在群聊中使用呢~')
        return true
      }
      let title = ['本群列表如下：']
      for (let i in this.data) {
        if (this.data[i].groupid === this.e.group_id) {
          if (this.data[i].word.length === 0) {
            this.e.reply('本群未禁止任何指令')
            return true
          }
          msg = this.data[i].word
          let forward = await basie.makeForwardMsg(this.e,Bot.uin, title, msg)
          this.e.reply(forward)
          return true
        }
      }
      this.e.reply('本群未禁止任何指令')
      return true
    } else {
      if (!this.e.isMaster) {
        this.e.reply('只有主人才能命令我哦~')
        return true
      }
      let flag=1
      Bot.gl.forEach(function (group, groupId) {
        if (flag) {
          flag = 0
        } else {
          msg.push('\n**************************************\n')
        }
        msg.push(`群昵称【${group.group_name}】\n群号【${groupId}】\n群人数【${group.member_count}】`)
      })
      flag=1
      for (let i in this.data) {
        if (this.data[i].word.length === 0) {
          continue
        } else {
          if (flag) {
            flag = 0
          } else {
            massege.push('\n**************************************\n')
          }
          let word
          for(let j in this.data[i].word){
            if(!word){
              word=`${Number(j)+1}、`+this.data[i].word[j]
            }
            word=word+'\n'+`${Number(j)+1}、`+this.data[i].word[j]
          }
          massege.push(`群号：【${this.data[i].groupid}】\n禁止指令：\n${word}`)
        }
      }
      if(massege.length===0){
        massege.push("暂无禁止指令的群呢~")
      }
      let title = ['主人的群列表如下~']
      let forward = await basie.makeForwardMsg(this.e,Bot.uin, title, msg,massege)
      this.e.reply(forward)
      return true
    }
  }
}