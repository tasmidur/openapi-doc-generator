import { errorMessage } from '../utils/messages'
import { IValidationSchema } from '../contacts/ValidationRule'
import { PostgresDatabase } from '../databases/PostgresDatabase';
import { ClientConfig } from 'pg';


export class SchemaOperationForPostgres {
  public integerTypes: any = {
    smallint: { min: '-32768', max: '32767' },
    integer: { min: '-2147483648', max: '2147483647' },
    bigint: { min: '-9223372036854775808', max: '9223372036854775807' },
  }

  private databaseConfig: ClientConfig;
  private database: PostgresDatabase;
  private table: [];

  constructor(table: [], databaseConfig: ClientConfig) {
    this.table = table;
    this.databaseConfig = databaseConfig;
    this.database = new PostgresDatabase(this.databaseConfig);
  }


  public async generateColumnRules(): Promise<any> {
    let rules:any={};
    await this.database.connect();
    try {
      let sql=`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_catalog='${String(this.databaseConfig.database)}'`;
      if(this.table.length){
        sql +=` AND table_name in (${this.table.map(_it=>`'${_it}'`).join(',')})`;
      }
      const tables = await this.database.query(sql) ?? [];
      if (!tables.rows.length) {
        throw new Error(errorMessage(`There is no table exist!`))
      }
      
      for(let table of tables.rows){
        if(table['table_name']){
          rules[table['table_name']]=await this.getRules(table['table_name']);
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
    let tableSchema = await this.getTableSchema(tableName)
    tableSchema.forEach(
      ({
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
      }) => {
       

        let columnRules = []
        let type = data_type

        switch (true) {
          case type === 'boolean':
            columnRules.push('boolean')
            break
          case type.includes('char'):
            columnRules.push('string')
            columnRules.push('max:' + character_maximum_length ?? '255')
            break
          case type === 'text':
            columnRules.push('string')
            break
          case type.includes('int'):
            columnRules.push('integer')
            columnRules.push('min:' + this.integerTypes.integer.min.toString())
            columnRules.push('max:' + this.integerTypes.integer.max.toString())
            break
          case type.includes('double') ||
            type.includes('decimal') ||
            type.includes('numeric') ||
            type.includes('real'):
            columnRules.push('numeric')
            break
          case type.includes('date') || type.includes('time'):
            columnRules.push('date')
            break
          case type.includes('json'):
            columnRules.push('json')
            break
          default:
            // Skip for other type
            break
        }
        columnRules.push(is_nullable === 'YES' ? 'nullable' : 'required')
        rules[column_name] = columnRules
      },
    )
    return rules
  }

  private async getTableSchema(tableName:string): Promise<any[]> {
    //await this.database.connect();
    let schema: any;
    try {
      schema = await this.database.query(`
                      SELECT table_name,column_name, data_type, character_maximum_length, is_nullable, column_default
                      FROM 
                      information_schema.columns
                      WHERE 
                      table_name = '${tableName}' 
                      ORDER BY ordinal_position ASC;
          `);

    } catch (error: any) {
      console.error(error.message)
    } finally {
      // Close the database connection
      //await this.database.end();
    }
    return schema?.rows??[];
  }

}
