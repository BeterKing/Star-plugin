import YAML from 'yaml' 


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
        let file = this.getFilePath(app,name,type)
        let key = `${name}.${type}`
        this[key] = YAML.parse(
          fs.readFileSync(file, 'utf8')
        )
        return this[key]
      }

      getFilePath(name, type) {
        if (type == "data") return `./plugins/Star-plugin/data/`
        if (type == "defSet") return `${this.defSetPath}${name}.yaml`
        else return `${this.configPath}${name}.yaml`
      }

}
export default new Baise()