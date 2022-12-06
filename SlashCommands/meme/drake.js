const { Client, Collection, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');

module.exports = {
    name: 'drake',
    description: 'the drake meme',
    options: [
        {
            name: 'line_1',
            type: 'STRING',
            description: 'WHAT am i putting in fist line',
            required: true
        },
        {
            name: 'line_2',
            type: 'STRING',
            description: 'WHAT am i putting in the second line',
            required: true
        }
    ],
      /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
    run: async (client, interaction,) => {
        const text1 = interaction.options.getString('line_1')
        const text2 = interaction.options.getString('line_2')

        const finalLink = 'https://luminabot.xyz/api/image/drake?yes=' + encodeURIComponent(text2) + '&no=' + encodeURIComponent(text1)

        const attach = new MessageAttachment(finalLink, 'drake.png')

        interaction.followUp({ files: [attach] });
    }
}