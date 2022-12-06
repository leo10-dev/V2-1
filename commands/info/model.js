const { 
    Client, CommandInteraction, MessageEmbed,
    MessageActionRow, Modal, TextInputComponent , MessageButton
} = require("discord.js");
module.exports = {
    name: "gg",
    aliases: ['g'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("b1")
            .setLabel("Button 1") // text in button
            .setStyle("PRIMARY") // background color
            .setEmoji("✅") // Emoji with text in button
        )

        const m = message.channel.send({ content: "Button", components: [row] })
        
         const ifilter = i => i.user.id === message.author.id;

        const collector = m.createMessageComponentCollector({ filter: ifilter, time: 60000 })

        collector.on("collect", async i => {
            if(i.customId === "b1") {
                const modal = new Modal()
                .setCustomId('myModal')
                .setTitle('Send Code');
              const short = new TextInputComponent()
                .setCustomId('short')
                .setLabel("Write a title for the code")
                .setStyle('SHORT')
                .setRequired();
             const paragraph = new TextInputComponent()
                .setCustomId('paragraph')
                .setLabel("Code")
                .setStyle('PARAGRAPH')
                .setRequired();
             
                const firstActionRow = new MessageActionRow().addComponents(short);
                const secondActionRow = new MessageActionRow().addComponents(paragraph);
                modal.addComponents(firstActionRow, secondActionRow);
                 interaction.showModal(modal);
            }
        })
     
    

    }
}