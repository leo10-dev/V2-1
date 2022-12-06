const { 
    Client, CommandInteraction, MessageEmbed,
    MessageActionRow, Modal, TextInputComponent, Message 
} = require("discord.js");
//const client = require("../..");

module.exports = {
    name: "report",
    description: "report bug",
    modal: true,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const modal = new Modal()
			.setCustomId('myModal')
			.setTitle('ReportBug');
		const short = new TextInputComponent()
			.setCustomId('short')
			.setLabel("Write a title for the bug")
			.setStyle('SHORT')
            .setRequired();
		const paragraph = new TextInputComponent()
			.setCustomId('paragraph')
			.setLabel("Write a description for the bug")
			.setStyle('PARAGRAPH')
            .setRequired();
		const firstActionRow = new MessageActionRow().addComponents(short);
		const secondActionRow = new MessageActionRow().addComponents(paragraph);
		modal.addComponents(firstActionRow, secondActionRow);
		await interaction.showModal(modal);
      
    },
};








