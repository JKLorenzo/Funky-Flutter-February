const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const constants = require('./constants.js');
const classes = require('./classes.js');
const functions = require('./functions.js');
/** @type {import('./database.js')} */
let database;
/** @type {import('./sheets.js')} */
let sheets;
/** @type {import('./message_manager.js')} */
let message_manager;

/** @type {CommandoClient} */
let client;
/** @type {classes.SheetInstant} */
let sheetInstant;

const processManager = new classes.ProcessQueue(60000);

/**
 * Initializes this module.
 * @param {CommandoClient} CommandoClient 
 * @param {classes.SheetInstant} this_sheetInstant
 */
module.exports.initialize = (CommandoClient, this_sheetInstant) => {
    client = CommandoClient;
    database = client.modules.database;
    sheets = client.modules.sheets;
    message_manager = client.modules.message_manager;
    sheetInstant = this_sheetInstant;
}

/**
 * Gets the Commando Client Instance.
 * @returns {CommandoClient} CommandoClient object
 */
module.exports.client = () => {
    return client;
}

/**
 * Gets the Quarantine Gaming Guild.
 * @returns {Discord.Guild} Guild object
 */
module.exports.guild = () => {
    return this.client().guilds.cache.get(constants.guild);
}

/**
 * Resolves a Guild Channel Resolvable to a Guild Channel object.
 * @param {Discord.GuildChannelResolvable} GuildChannelResolvable A GuildChannel object or a Snowflake.
 * @returns {Discord.GuildChannel} GuildChannel object
 */
module.exports.channel = (GuildChannelResolvable) => {
    return this.guild().channels.resolve(GuildChannelResolvable) || this.guild().channels.resolve(functions.parseMention(GuildChannelResolvable));
}

let count = -1;
let running = false;
let status = '';

/** @param {Number} index */
async function run(index) {
    running = true;
    count = index;

    while (running) {
        await processManager.queue();
        try {
            if (status != `${count - 2} Finishers`) {
                status = `${count - 2} Finishers`;
                client.user.setActivity(status, {
                    type: 'WATCHING'
                });
                console.log(`Waiting for finisher #${count - 1}`);
            }
            const response = await sheets.fetch(sheetInstant, `A${count}:F`);
            if (response && response.status == 200 && response.data.values && response.data.values.length > 0) {
                for (const data of response.data.values) {
                    const this_finisher = new classes.Finisher(data);
                    const reference = await database.push(this_finisher);
                    const embed = new Discord.MessageEmbed();
                    const finished_date = new Date(this_finisher.timestamp);
                    embed.setAuthor(`Developer Student Clubs`, 'https://dscgt.club/images/dsc-logo-2.png');
                    embed.setThumbnail('https://flutter.dev/images/flutter-mono-81x100.png');
                    embed.setTitle(`Funky Flutter February 2021`);
                    embed.setDescription(`Congratulations to **${this_finisher.fullname}** ${this_finisher.address ? `of ${this_finisher.address}`: ''}!`)
                    embed.setImage('https://cdn.discordapp.com/attachments/460064472711692301/810867508256833546/fff_logo_horizontal.PNG');
                    embed.setFooter(`Finisher ID: ${reference.id} --- ${finished_date.toUTCString()}`);
                    embed.setColor('#2c2f33');

                    await message_manager.sendToChannel(constants.channels.finishers, embed);
                    count++;
                }
            }
        } catch (error) {
            console.error(`Runtime Error: ${error}`);
        }
        processManager.finish();
    }
    client.user.setActivity(`STOPPED`, {
        type: 'PLAYING'
    });
    running = false;
    console.error(`HALT: Process stopped at count ${count - 2}`);
}

/** @param {Number} index */
module.exports.start = (index) => {
    if (!running && count == -1) {
        run(index + 1); // offset for the sheet header row
        return true;
    } else {
        return false;
    }
}