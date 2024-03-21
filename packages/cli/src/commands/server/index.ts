import type { CommandModule } from 'yargs';

const server: CommandModule = {
    command: ['server'],
    describe: 'Start server',
    handler: async () => {

    }
}

export default server