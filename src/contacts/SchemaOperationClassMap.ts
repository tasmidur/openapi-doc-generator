import { SchemaOperationForPostgres } from "src/schemas-operations/SchemaOperationForPostgres";
import { SchemaOperationForMysql } from "../schemas-operations/SchemaOperationForMysql";
import { DATABASE_MYSQL, DATABASE_POSTGRES, DATABASE_SQLITE } from "../utils/constants";
import { SchemaOperationForSqlite } from "src/schemas-operations/SchemaOperationForSqlite";

export interface ISchemaOperationClassMap{
    [DATABASE_MYSQL]:typeof SchemaOperationForMysql,
    [DATABASE_POSTGRES]:typeof SchemaOperationForPostgres,
    [DATABASE_SQLITE]:typeof SchemaOperationForSqlite,
}

export interface ISchemaOperation{
    generateColumnRules():Promise<any>
}
