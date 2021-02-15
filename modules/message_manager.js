const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const classes = require('./classes.js');

const ChannelMessageManager = new classes.ProcessQueue(2500);

/** @type {CommandoClient} */
let client;
/** @type {import('./app.js')} */
let app;

/**
 * @param {CommandoClient} CommandoClient 
 */
module.exports.initialize = (CommandoClient) => {
    client = CommandoClient;
    app = client.modules.app;
}

/**
 * @param {Discord.GuildChannelResolvable} GuildChannelResolvable
 * @param {any} content
 * @returns {Promise<null>}
 */
module.exports.sendToChannel = (GuildChannelResolvable, content) => {
    return new Promise(async (resolve) => {
        console.log(`MessageChannelSend: Queueing ${ChannelMessageManager.processID}`);
        await ChannelMessageManager.queue();

        try {
            /** @type {Discord.TextChannel} */
            const channel = app.channel(GuildChannelResolvable);
            await channel.send(content);
        } catch (error) {
            console.error(error)
        } finally {
            console.log(`MessageChannelSend: Finished ${ChannelMessageManager.currentID}`);
            ChannelMessageManager.finish();
            resolve();
        }
    });
}