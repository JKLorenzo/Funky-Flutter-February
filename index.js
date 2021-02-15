const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const app = require('./modules/app.js');
const database = require('./modules/database.js');
const sheets = require('./modules/sheets.js');
const message_manager = require('./modules/message_manager.js');

const client = new CommandoClient({
    commandPrefix: 'fff ',
    owner: '393013053488103435'
});

client.modules = {
    app: app,
    database: database,
    sheets: sheets,
    message_manager: message_manager
}

client.registry
    .registerDefaultTypes()
    .registerGroups([
		['general', 'General Commands']
	])
    .registerDefaultGroups()
    .registerDefaultCommands({
        eval: false,
        prefix: false,
        commandState: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', async () => {
    console.log('Startup: Initializing')
    try {
        message_manager.initialize(client);
        console.log('Startup: Message Manager initialized');

        const sheetInstant = await sheets.initialize(process.env.SHEET_ID);
        console.log('Startup: Google API initialized');

        app.initialize(client, sheetInstant);
        console.log('Startup: App initialized');

        client.user.setActivity(`Ready!`, {
            type: 'PLAYING'
        });
    } catch (error) {
        console.error(`Startup Failed: ${error}`);
    }
});

client.on('rateLimit', (rateLimitInfo) => {
    console.error(`RateLimit: ${rateLimitInfo}`);
});

client.on('error', (error) => {
    console.error(`ClientError: ${error}`);
});

console.log('Startup: Logging In')
client.login(process.env.BOT_TOKEN);