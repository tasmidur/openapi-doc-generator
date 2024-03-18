require("dotenv").config();
const schemaConfig = {
  defaultDatabase: 'sqlite',
  databases: {
    postgres: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: '123456',
      database: 'testing'
    },
    mysql: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '123456',
      database: 'smar_office_2024'
    },
    sqlite: { database: './schema_builder.db' }
  },
  openApiConfig:{
    "openapi": "3.0.0",
    "info": {
        "version": "1.0.0",
        "title": "OpenAPI 3.0 specification from database schema",
        "description": "A basic OpenAPI 3.0 specification from database schema",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "name": "Swagger API Team",
            "email": "apiteam@swagger.io",
            "url": "http://swagger.io"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
        }
    },
    "servers": [
        {
            "url": "http://localhost/api",
            "description": "The API server",
        }
    ]
}
};
module.exports = schemaConfig;