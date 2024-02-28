import { buildTemplateContent, getVersion, storeFile, toTitleCase } from '../utils/utils';
import { config } from '../config/config';
import { IOptions } from '../contacts/IOptions'
import * as fs from 'fs'
import * as path from 'path'

export class DocGenerator {
  private options: IOptions;
  private version: string;
  private rules: {};
  private path: string;
  private swaggerBaseConfig: any
  private pathTemplate: any;
  private schemaTemplate: any;
  private parametherTemplate: any;

  constructor(options: IOptions) {
    this.options = options
    this.rules = this.options.rules;
    this.path = this.options.stroreDir;
    this.swaggerBaseConfig = config.openApiConfig;
    this.version = getVersion(this.swaggerBaseConfig);
    this.pathTemplate = fs.readFileSync(
      path.resolve(__dirname, `../templates/${String(this.version)}.path.template`),
      'utf8',
    )
    this.parametherTemplate = fs.readFileSync(
      path.resolve(__dirname, `../templates/${String(this.version)}.parameters.template`),
      'utf8',
    )
    this.schemaTemplate = fs.readFileSync(
      path.resolve(__dirname, `../templates/${String(this.version)}.schema.template`),
      'utf8',
    )
  }

  public generate() {
    let openapi = this.swaggerBaseConfig;
    openapi = {
      ...openapi,
      paths: this.preparePath(),
      components:{
          parameters:this.prepareParameter(),
          schemas:this.prepareSchema()
      }
    }
    const storeFileAsJson=JSON.stringify(openapi,null,2);
    storeFile(storeFileAsJson,"openapi.v3","openapi","json");
  }

  private prepareSchema() {
    let schema={};
    Object.keys(this.rules).forEach((element) => {
      let properties: any = {};
      let requiredField: any = [];
      
      let columnRules = (this.rules as any)[element];
      Object.keys(columnRules).forEach((columnName: any) => {

        if(columnName==='id'){
          return;
        }

        let rule = columnRules[columnName];
        let parsedValue = this.parse(rule, columnName);

        requiredField = [
          ...requiredField,
          ...parsedValue.required
        ];
        (properties as any)[columnName] = parsedValue.properties;
      });

      if(Object.keys(properties).length>0){
        let generatedSchema = buildTemplateContent(this.schemaTemplate,
          {
            SCHEMA: toTitleCase(element),
            REQUIRED_PROPERTIES: JSON.stringify(requiredField,null,2),
            PROPERTIES:JSON.stringify(properties,null,2)
          }
        )
        schema = {
          ...schema,
          ...{
            ...JSON.parse(generatedSchema)
          }
        }
      }
      
    });
    return schema;
  }
  private parse = (rules: any, column: any): any => {
    let properties: any = {};
    let required: any = [];
    rules.forEach((_item: any) => {
      switch (true) {
        case _item === 'string':
          (properties as any)["type"] = "string";
          break
        case _item.includes('integer'):
          (properties as any)["type"] = "integer";
          break
        case _item.includes('numeric'):
          (properties as any)["type"] = "number";
          break
        case _item.includes('required'):
          required.push(column)
          break
        case _item.includes('date'):
          (properties as any)["type"] = "string";
          (properties as any)["format"] = "date";
          break
        case _item.includes('bool'):
          (properties as any)["type"] = "boolean";
          break
        case _item.includes('max'): {
          const value = parseInt(_item.split(':')[1] ?? 0)
          if (value > 0 && properties.type === 'string' && properties.format !== 'date') {
            (properties as any)["maxLength"] = value;
          } else if (value > 0 && properties.type === 'integer') {
            (properties as any)["maximum"] = value;
            if (value <= 2147483647) {
              (properties as any)["format"] = "int32";
            } else if (value >= 2147483647 && value <= 9223372036854775807) {
              (properties as any)["format"] = "int64";
            }
          }
          break
        }
        case _item.includes('min'): {
          const value = parseInt(_item.split(':')[1] ?? 1)
          if (value > 0 && properties.type === 'string' && properties.format !== 'date') {
            (properties as any)["minLength"] = value;
          } else if (value > 0 && properties.type === 'integer') {
            (properties as any)["minimum"] = value;
          }
          break
        }
        case  /^in:/.test(_item):
          const value = _item.split(':')[1].split(",");
          if (value.length>0&& properties.type === 'string' && properties.format !== 'date') {
            (properties as any)["enum"] = value;
          }
          break
        default:
          (properties as any)["type"] = "string";
          break
      }
    });
    return {
      properties,
      required
    }
  }

  private prepareParameter(): any {
    return JSON.parse(this.parametherTemplate)
  }
  private preparePath(): any {
    let path = {};
    Object.keys(this.rules).forEach((element) => {
      let generatedPath = buildTemplateContent(this.pathTemplate,
        {
          PATH: element.toLowerCase(),
          TAG: toTitleCase(element),
        }
      )
      path = {
        ...path,
        ...{
          ...JSON.parse(generatedPath)
        }
      }
    });
    return path;
  }

}
