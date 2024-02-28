import { IDatabaseBaseClassMap } from "../contacts/Database";
import { ISchemaOperationClassMap } from "../contacts/SchemaOperationClassMap";
import { MySQLDatabase } from "../databases/MySQLDatabase";
import { PostgresDatabase } from "../databases/PostgresDatabase";
import { SqliteDatabase } from "../databases/SqliteDatabase";
import { SchemaOperationForMysql } from "../schemas-operations/SchemaOperationForMysql";
import { SchemaOperationForPostgres } from "../schemas-operations/SchemaOperationForPostgres";
import { SchemaOperationForSqlite } from "../schemas-operations/SchemaOperationForSqlite";

export const CLASS_NAME_SUFFIX = `{{className}}RequestValidator`

export const REQUEST_VALIDATION_TYPE_VINE = 'vine'
export const REQUEST_VALIDATION_TYPE_JOI = 'joi'
export const REQUEST_VALIDATION_TYPE_VALIDATORJS = 'validatorJs'

export const DATABASE_MYSQL="mysql";
export const DATABASE_POSTGRES="postgres";
export const DATABASE_SQLITE="sqlite";

export const schemaOperationClass: ISchemaOperationClassMap = {
    [DATABASE_MYSQL]:SchemaOperationForMysql,
    // [DATABASE_POSTGRES]:SchemaOperationForPostgres,
    // [DATABASE_SQLITE]:SchemaOperationForSqlite,
  }

export const databaseClassMap:IDatabaseBaseClassMap={
     [DATABASE_MYSQL]:MySQLDatabase,
     [DATABASE_POSTGRES]:PostgresDatabase,
     [DATABASE_SQLITE]:SqliteDatabase
}

export const openapiDefaultConfig={
  "v2":{
     'paths':{

      },
      'definitions':{

      },
      'securityDefinitions':{

      }
  },
  "v3":{
    'paths':{

    },
    'components':{

    },
    'securityDefinitions':{

    }
  }
}

export const defaulResponse={
  "200": {
    "description": "",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Pet"
        }
      }
    }
  },
  "default": {
    "description": "Unexpected error",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorModel"
        }
      }
    }
  }
}
