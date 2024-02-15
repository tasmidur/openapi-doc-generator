import { config } from '../config/config';
import {
  IRequestSchemaClassMap,
} from '../contacts/RequestSchemaClassMap'
import { IOptions} from '../contacts/IOptions'


export class DocGenerator {
  private options: IOptions;
  private mode:string;
  private rules:string[];
  private path:string;
  private swaggerBaseConfig:Record<string,string>

  constructor(options: IOptions) {
    this.options = options
    this.mode=this.options.model;
    this.rules=this.options.rules;
    this.path=this.options.stroreDir;
    this.swaggerBaseConfig=config.openApiBaseConfig;
  }

  public generate(){
    
  }

  private prepare(){
    
  }

}
