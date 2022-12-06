const { MessageEmbed } = require('discord.js');
const client = require('../index');

client.on('interactionCreate', interaction => {
	if (!interaction.isModalSubmit()) return;
    interaction.deferReply({ ephemeral: true });
	const short = interaction.fields.getTextInputValue('short');
	const paragraph = interaction.fields.getTextInputValue('paragraph');
    let me = interaction.guild.members.cache.get("923249789217431583")
    me.send({embeds : [
        new MessageEmbed()
        .setColor("#6a529e")
        .setTitle(`⚠⚠⚠`)
        .setDescription(`${paragraph} \n ${short}`)
        .addField('id' , `${interaction.member.id} , (<@${interaction.member.id}>) `)
        .addField(`server id` , `${interaction.guild.id} , (${interaction.guild.name})`)
        .setTimestamp()
        .setThumbnail(interaction.member.user.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' }))
    ]})
	
});