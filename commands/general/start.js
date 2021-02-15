const Commando = require('discord.js-commando');

module.exports = class Start extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'start',
			group: 'general',
            memberName: 'start',
			description: 'Starts listening to finishers.',
            userPermissions: ['ADMINISTRATOR'],
			args: [
				{
					key: 'position',
					prompt: '[Optional] The 1-based index of the next finisher.',
					type: 'integer',
					default: -200,
                    validate: input => input > 0 || input == -200
				},
			],
		});
	}

	/**
     * @param {Commando.CommandoMessage} message
     * @param {{position: Number}}
     */
	async run(message, { position }) {
        /** @type {import('../../modules/database.js')} */
        const database = this.client.modules.database;
        /** @type {import('../../modules/app.js')} */
        const app = this.client.modules.app;
        if (position == -200){
            // Default
            position = await database.getLastCount();
        } else {
            position = 0;
        }

		if (app.start(position + 1)) {
            message.reply(`Starting... Listening to finisher #${position + 1}.`);
        } else {
            message.reply(`Failed to start the application. (APP_IS_RUNNING)`);
        }
	}
};