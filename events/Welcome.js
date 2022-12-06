const client = require("../index");
const {color} = require("../config.json")
const WelcomeModel = require("../models/WelcomeModel");
const { MessageEmbed } = require("discord.js");

client.on('guildMemberAdd', async(member) => {

 
    WelcomeModel.findOne({ Guild: member.guild.id}, async(e, data) => {
      
      if(!data) return;
    
      
    const user = member.user;
 
    const channel = member.guild.channels.cache.get(data.Channel)
    
    channel.send({embeds : [

        new MessageEmbed()
        .setTitle(`Welcome to ${member.guild.name}`)
        .setColor(color)
        .setDescription(`**
  > Username : ${member.user.username}
  > Members Server : ${member.guild.memberCount}
  > Joined Discord : <t:${parseInt(member.user.createdAt / 1000)}:R>
  **`)
  .setThumbnail(member.user.avatarURL({ dynamic: true }))
  .setFooter({text:member.guild.name, iconURL:member.guild.iconURL({ dynamic: true })})
        

    ]})
    })
    
    })
    