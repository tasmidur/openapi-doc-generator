import { errorMessage } from '../utils/messages'
import { IValidationSchema } from '../contacts/ValidationRule'
import { SqliteDatabase } from '../databases/SqliteDatabase';

export class SchemaOperationForSqlite {
  public integerTypes: any = {
    integer: { min: '-9223372036854775808', max: '9223372036854775807' },
  }

  private databaseConfig: any;
  private database: SqliteDatabase;
  private table: [];

  constructor(table: [], databaseConfig: any) { 
    this.table = table;
    this.databaseConfig = databaseConfig;
    this.database = new SqliteDatabase(this.databaseConfig);
  }

  public async generateColumnRules(): Promise<any> {
    let rules:any={};
    await this.database.connect();
    try {
      let sql=`SELECT name FROM sqlite_master WHERE type='table'`;
      if(this.table.length){
         sql +=` AND name in (${this.table.map(_it=>`'${_it}'`).join(',')})`;
      }
      const tables = await this.database.query(sql) ?? [];
     
      if (!tables.length) {
        throw new Error(errorMessage(`There is no table exist!`))
      }
      for(let table of tables){
        if(table['name']){
          rules[table['name']]=await this.getRules(table['name']);
        }
      }
      
    }catch (error: any) {
      console.error(error.message)
    } finally {
      // Close the database connection
      await this.database.end();
    }
    return rules;
  }

  private async getRules(tableName:string): Promise<any> {
    const rules: IValidationSchema = {}
    let tableSchema = await this.getTableSchema(tableName); 
    tableSchema.forEach(({ name, type, notnull, dflt_value, pk }) => {
      let columnRules = []
      let dataType = type.toLowerCase()

      switch (true) {
        case dataType === 'tinyint(1)':
          columnRules.push('integer')
          break
        case dataType === 'boolean':
            columnRules.push('boolean')
            break
        case dataType.includes('varchar') || dataType === 'text':
          columnRules.push('string')
          if (dataType.includes('varchar'))
            columnRules.push('max:' + parseInt(dataType.replace(/\D/g, ''), 10))
          break
        case dataType.includes('int'):
          columnRules.push('integer')
          columnRules.push('min:' + this.integerTypes.integer.min)
          columnRules.push('max:' + this.integerTypes.integer.max)
          break
        case dataType.includes('real') ||
          dataType.includes('numeric') ||
          dataType.includes('float'):
          // Add more specific validation as needed
          columnRules.push('numeric')
          break
        case dataType.includes('date') || dataType=='timestamp' || dataType=='time':
          columnRules.push('date')
          break
        default:
          // Skip BLOB for now
          break
      }
      columnRules.push(!Boolean(notnull) ? 'nullable' : 'required')
      rules[name] = columnRules
    })
    return rules
  }

  private async getTableSchema(tableName:string): Promise<any[]> {
    //await this.database.connect();
    let schema: any[] = [];
    try {
      schema= (await this.database.query(`PRAGMA table_info('${tableName}')`)) ?? []
    } catch (error: any) {
      console.error(error.message)
    } finally {
      // Close the database connection
     // await this.database.end();
    }
    return schema;
  }
}
