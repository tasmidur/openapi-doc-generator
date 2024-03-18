import { config } from './config/config'
import {
  schemaOperationClass
} from './utils/constants'
import { DocGenerator } from './doc-generator'
import { ISchemaOperationClassMap } from './contacts/SchemaOperationClassMap'
import { IOptions } from './contacts/IOptions'

export class Executor {
  private table: []
  private databaseType: (keyof ISchemaOperationClassMap)
  private databaseConfig: any
  private options: any

  constructor(options: any) {  
    this.options = options;
    this.table = this.options?.table??[];
    this.databaseType = this.options?.database ?? config.defaultDatabase
    this.databaseConfig = config.databases[this.databaseType]
  }

  public async execute(): Promise<boolean> {
    try {
      const columnRules = await this.initializeSchemaOperation().generateColumnRules();     
      const docGeneratorConfig:IOptions={
         rules:columnRules,
         stroreDir:"openapi-doc"
      }
      const doc=new DocGenerator(docGeneratorConfig).generate();
    } catch (error: any) {
      console.error(error.message)
    } finally {
    
    }
    return true;
  }
  private initializeSchemaOperation(): InstanceType<ISchemaOperationClassMap[keyof ISchemaOperationClassMap]> {
    const SchemaOperationClass = schemaOperationClass[this.databaseType]  
    if (SchemaOperationClass) {
      return new SchemaOperationClass(this.table, this.databaseConfig)
    } else {
      throw new Error(`Unsupported request validation type: ${this.databaseType}`)
    }
  }
}
