import { config as dotenvConfig } from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import { successMessage, warningMessage } from '../utils/messages';

const configFilePath=path.join(process.cwd(), '/schema.config.js');
let config:any={};
dotenvConfig()

if (fs.existsSync(configFilePath)) { 
const schemaConfig = require(configFilePath)
config = schemaConfig;
}else{
   if(process.argv.includes("init")){
    console.error(successMessage(`\n"schema-config.js" is generated on working directory. You need to modify\n`));  
   }else{
    console.error(warningMessage(`\n"schema-config.js" is missing. \n Please run command "ndVr init" for global installtion otherwise "npm run ndVr init" \n`));  
   }
}

export {
    config
} 
