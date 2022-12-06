const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const child = require('child_process');
const {color} = require("../../config.json")
module.exports = {
    name: 'execute',
    description: 'Execute code to the child process',
    options: [
        {
            name: 'code',
            description: 'The code to execute',
            required: true,
            type: 'STRING'
        },
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async(client, interaction) => {
        const code = interaction.options.getString("code");
        if(interaction.member.id != "972963457097932920" ) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setColor(color)
                .setDescription(`Only for Owner`)
            ]
        })
        child.exec(code, async(err, stdout, stderr) => {
            if(err) {
                interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`<:No:984300709933621299> **Error**\n\n\`\`\`${err}\`\`\``)
                            .setColor("36393e")
                    ]})
                } else {
                    const reply = await interaction.followUp({ content: `Executing...`, fetchReply: true })
                    reply.edit({
                        content: "<:Yes:984300666044432404> **Success**",
                        embeds: [
                            new MessageEmbed()
                                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                                .setDescription(`\`\`\`${stdout}\`\`\``)
                                .setColor(color)
                        ]})
                }
        })
    } 
}