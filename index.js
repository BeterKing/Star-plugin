import fs from "node:fs";

logger.info('---------------------------')
logger.info('-----Star-plugin初始化-----')
logger.info('---------------------------')

const files = fs.readdirSync("./plugins/Star-plugin/app").filter((flie)=>flie.endsWith(".js"))

let apps = {}
for ( let file of files ){
    let name =file.replace(".js","")
    apps[name] = (await import (`./app/${file}`))[name]
}

export { apps }