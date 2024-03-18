#!/usr/bin/env ts-node

import { Option, program } from 'commander';
import { Executor } from './executor';
import { config as dotenvConfig } from 'dotenv';
import {
  DATABASE_MYSQL,
  DATABASE_POSTGRES,
  DATABASE_SQLITE,
} from './utils/constants';
import { initSchema } from './utils/utils';


// Load environment variables from a .env file if present
dotenvConfig();

// Define the CLI program
program
  .version('1.0.0')
  .description('A simple CLI app for dynamic schema rules generation');

program
.command("init")
.action(()=>{
  initSchema().then(()=>{})
})

program
  .command("generate")
  .option('-t, --table <table>', 'Specify the table name')
  .addOption(new Option('-db, --database <database>', 'Specify the database').choices([DATABASE_MYSQL, DATABASE_POSTGRES, DATABASE_SQLITE]))
  .action(async (cmd) => {
    try {
      const { table="", database} = cmd;     
      const options = {
        table: table.split(',').filter(Boolean),
        database:database
      };
      // Execute the main logic
      await new Executor(options).execute();

    } catch (error:any) {
      console.error(error.message);
    } finally {
      process.exit();
    }
  });

program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('$ ndVr joi -t my_table -db mysql -c column1,column2');
});

// Parse the command line arguments
program.parse(process.argv);

/**
 * chmod +x dist/cli.js
 */
