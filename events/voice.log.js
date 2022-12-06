const client = require("../index");
const Voice = require("../models/voicelogModel");
const {color} = require("../config.json")

const {
    MessageEmbed
} = require('discord.js');
    




client.on("voiceStateUpdate", (oldState, newState) => {
        
Voice.findOne({ Guild: oldState.guild.id}, async(e, data) => {
      

    let channel = newState.guild.channels.cache.get(data.Channel)
    if(!data) return console.log(`no no no`)

    let usertag = newState.member.user.tag;
    if (!oldState.streaming && newState.streaming) return channel.send({embeds : [
        new MessageEmbed()
        .setColor(color)
        .setDescription(`${usertag} is ${newState.streaming ? "" : "not "}streaming`)
        .setTimestamp()
      //  .setThumbnail(usertag.displayAvatarURL({ dynamic: false, format: 'png' }))
    ]})
    if (oldState.streaming && !newState.streaming) return channel.send({embeds : [
        new MessageEmbed()
        .setColor(color)
        .setDescription(`${usertag} is ${newState.streaming ? "" : "not )"}streaming`)
        .setTimestamp()
        //.setThumbnail(usertag.displayAvatarURL({ dynamic: false, format: 'png' }))

    ]})
    if (!oldState.serverDeaf && newState.serverDeaf) return channel.send({embeds : [
        new MessageEmbed()
        .setColor(color)
        .setDescription(`${usertag} is ${newState.serverDeaf ? "" : "un"}deafed (Server)`)
        .setTimestamp()
       // .setThumbnail(usertag.displayAvatarURL({ dynamic: false, format: 'png' }))
    ]});
    if (oldState.serverDeaf && !newState.serverDeaf) return channel.send({embeds : [
        new MessageEmbed()
        .setColor(color)
        .setDescription(`${usertag} is ${newState.serverDeaf ? "" : "un"}deafed (Server)`)
        .setTimestamp()
       // .setThumbnail(usertag.displayAvatarURL({ dynamic: false, format: 'png' }))
    ]});
    if (!oldState.serverMute && newState.serverMute) return channel.send({embeds : [
        new MessageEmbed()
        .setColor(color)
        .setDescription(`${usertag} is ${newState.serverMute ? "" : "un"}muted (Server)`)
        .setTimestamp()
       // .setThumbnail(usertag.displayAvatarURL({ dynamic: false, format: 'png' }))
    ]});
    if (oldState.serverMute && !newState.serverMute) return channel.send({embeds : [
        new MessageEmbed()
        .setColor(color)
        .setDescription(`${usertag} is ${newState.serverMute ? "" : "un"}muted (Server)`)
        .setTimestamp()
       // .setThumbnail(usertag.displayAvatarURL({ dynamic: false, format: 'png' }))
    ]});
    if (!oldState.selfDeaf && newState.selfDeaf) return channel.send({embeds : [
        new MessageEmbed()
        .setColor(color)
        .setDescription(`${usertag} is ${newState.selfDeaf ? "" : "un"}deafed (self)`)
        .setTimestamp()
        //.setThumbnail(usertag.displayAvatarURL({ dynamic: false, format: 'png' }))
    ]});
    if (oldState.selfDeaf && !newState.selfDeaf) return channel.send({embeds : [
        new MessageEmbed()
        .setColor(color)
        .setDescription(`${usertag} is ${newState.selfDeaf ? "" : "un"}deafed (self)`)
        .setTimestamp()
    ]});
    if (!oldState.selfMute && newState.selfMute) return channel.send({embeds : [
        new MessageEmbed()
        .setColor(color)
        .setDescription(`${usertag} is ${newState.selfMute ? "" : "un"}muted (self)`)
        .setTimestamp()
    ]});
    if (oldState.selfMute && !newState.selfMute) return channel.send({embeds : [
        new MessageEmbed()
        .setColor(color)
        .setDescription(`${usertag} is ${newState.selfMute ? "" : "un"}muted (self)`)
        .setTimestamp()
    ]});
    if (oldState.sessionID != newState.sessionID) return channel.send({embeds : [
    new MessageEmbed()
    .setColor(color)
    .setDescription(`${usertag} sessionID on: ${newState.sessionID}`)
    .setTimestamp()
    ]});
    if (!oldState.selfVideo && newState.selfVideo) return channel.send({embeds : [
        new MessageEmbed()
        .setColor(color)
        .setDescription(`${usertag} is ${newState.selfVideo ? "" : "not "}self Video Sharing`)
        .setTimestamp()
    ]});
    if (oldState.selfVideo && !newState.selfVideo) return channel.send({embeds : [
        new MessageEmbed()
        .setColor(color)
        .setDescription(`${usertag} is ${newState.selfVideo ? "" : "not "}self Video Sharing`)
        .setTimestamp()
    ]});
   
    
  


})
   
  });


