const Commando = require('discord.js-commando');

module.exports = class Stop extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			group: 'general',
            memberName: 'stop',
			description: 'Stops listening to finishers.',
            userPermissions: ['ADMINISTRATOR'],
		});
	}

	/** @param {Commando.CommandoMessage} message */
	async run(message) {
        /** @type {import('../../modules/app.js')} */
        const app = this.client.modules.app;
        if (app.stop()){
            message.reply(`Stopping.`);
        } else {
            message.reply(`The bot is already stopped.`);
        }
	}
};