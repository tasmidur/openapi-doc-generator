import { SchemaOperationForMysql } from "../schemas-operations/SchemaOperationForMysql";
import { DATABASE_MYSQL, DATABASE_POSTGRES, DATABASE_SQLITE } from "../utils/constants";
import { IValidationSchema } from "./ValidationRule";

export interface ISchemaOperationClassMap{
    [DATABASE_MYSQL]:typeof SchemaOperationForMysql,
    // [DATABASE_POSTGRES]:typeof SchemaOperationForPostgres,
    // [DATABASE_SQLITE]:typeof SchemaOperationForSqlite,
}

export interface ISchemaOperation{
    generateColumnRules():Promise<any>
}
