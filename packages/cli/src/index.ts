import dotenv from 'dotenv';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import server from "@/commands/server";

void yargs(hideBin(process.argv))
    .version(false)
    .option('env', {
        alias: ['env-file'],
        describe: 'The path to your .env file',
        type: "string",
        default: '.env'
    })
    .middleware(({env}) => {
        dotenv.config({path: env});
    })
    .command(server)
    .demandCommand(1)
    .showHelpOnFail(false, `Specify --help for available options`)
    .strict()
    .parse()