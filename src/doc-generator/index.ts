import { buildTemplateContent, getVersion, toTitleCase } from '../utils/utils';
import { config } from '../config/config';
import { IOptions} from '../contacts/IOptions'
import * as fs from 'fs'
import * as path from 'path'

export class DocGenerator {
  private options: IOptions;
  private version:string;
  private rules:{};
  private path:string;
  private swaggerBaseConfig:any
  private pathTemplate:any;
  private schemaTemplate:any;
  private parametherTemplate:any;

  constructor(options: IOptions) {
    this.options = options
    this.rules=this.options.rules;
    this.path=this.options.stroreDir;
    this.swaggerBaseConfig=config.openApiConfig; 
    this.version=getVersion(this.swaggerBaseConfig);
    this.pathTemplate=fs.readFileSync(
      path.resolve(__dirname, `../templates/${String(this.version)}.path.template`),
      'utf8',
    )
    this.parametherTemplate=fs.readFileSync(
      path.resolve(__dirname, `../templates/${String(this.version)}.parameters.template`),
      'utf8',
    )
    this.schemaTemplate=fs.readFileSync(
      path.resolve(__dirname, `../templates/${String(this.version)}.schema.template`),
      'utf8',
    )
  }

  public generate(){
    let openapi=this.swaggerBaseConfig;
    openapi={
      ...openapi,
      paths:this.preparePath(),
      // components:{
      //     parameters:this.prepareParameter(),
      //     schemas:this.prepareSchema()
      // }
    }
    this.prepareSchema()
   // console.log(this.rules);
  }

  private prepareSchema(){
    let properties={};
    Object.keys(this.rules).forEach((element)=>{
      let schemaProperties={
        SCHEMA:element.toLowerCase()
      }
      let columnRules=(this.rules as any)[element];
      Object.keys(columnRules).forEach((element)=>{
        
      })
    })
  }
  private parse = (rules: any,column:any) => {
     let properties:any={};
     let required:any=[];
     rules.forEach((_item:any)=>{
      switch (true) {
        case _item === 'string':
          (properties as any)["type"]="string";
          break
        case _item.includes('integer'):
          (properties as any)["type"]="integer";
          break
        case _item.includes('numeric'):
          (properties as any)["type"]="number";
          break
        case _item.includes('required'):
          required.push(column)
          break
        default:
          break
      }
     });
     return {
      [column]:properties,
      required
     }
  }
  private prepareParameter():any{
    return JSON.parse(this.parametherTemplate)
  }
  private preparePath():any
  {
    let path={};
    Object.keys(this.rules).forEach((element)=>{
        let generatedPath=buildTemplateContent(this.pathTemplate,
          {
            PATH:element.toLowerCase(),
            TAG:toTitleCase(element),
           }
          )
        path={
          ...path,
          ...{
            ...JSON.parse(generatedPath)
          }
        }
    });
    return path;
  }

}
