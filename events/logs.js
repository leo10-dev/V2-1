const client = require("../index");
const logModel = require("../models/logModel");
const {color} = require("../config.json")

const {
    MessageEmbed , MessageActionRow , MessageButton
} = require('discord.js');
    
client.on("messageDelete", message => {
    
logModel.findOne({ Guild: message.guild.id}, async(e, data) => {
      
    if(!data) return console.log(`${e} data has been not found`)
  

    if(!message.guild) return;
    if (message.deleted == true){
    if (message.content.length == 0) return;
    let channel = message.guild.channels.cache.get(data.Channel)
    let embed = new MessageEmbed()
    .setTitle('Messgae Deleted')
    .setThumbnail(message.author.avatarURL())
    .setDescription(`Messgae : \`\`\`${message.content}\`\`\`\nBy : <@${message.author.id}>\nChannel ${message.channel}`)
    .setTimestamp()
    .setColor(color)
    channel.send({embeds: [embed]})
    }
    })
})
    
    client.on("messageUpdate", (oldMessage, newMessage) => {
        
logModel.findOne({ Guild: newMessage.guild.id}, async(e, data) => {
      
    if(!data) return console.log(`${e} data has been not found`)
  


      if (oldMessage.author.bot) return;
      if (!oldMessage.channel.type === "dm") return;
    let channel = oldMessage.guild.channels.cache.get(data.Channel)
    let embed = new MessageEmbed()
    .setTitle('Messgae Edit')
    .setThumbnail(oldMessage.author.avatarURL())
    .setDescription(`Old Message:\n\`\`\`${oldMessage}\`\`\`\nNew Message:\`\`\`${newMessage}\`\`\`\nBy : <@${oldMessage.author.id}>\nChannel${oldMessage.channel} `)
    .setTimestamp()
    .setColor(color)
    channel.send({embeds: [embed]})
    })
})
    
    client.on("channelCreate", (channel , message)  => {
        
logModel.findOne({ Guild: channel.guild.id}, async(e, data) => {
      
    if(!data) return  console.log(`${e} data has been not found`)
  

    channel.guild.fetchAuditLogs().then(logs => { 
    var userid = logs.entries.first().executor.id; 
    let channelc = channel.guild.channels.cache.get(data.Channel)
    let member = channel.guild.members.cache.get(userid);
    let embed = new MessageEmbed()
    .setTitle('Channel Create')
    .setDescription(`Channel Name : ${channel.name}\`\`\`\nChannel <#${channel.id}>  `)
     .addField(`Created by:`,`\n<@${userid}>\n`)
     .setThumbnail(member.avatarURL())
    .setTimestamp()
    .setColor(color)
    channelc.send({embeds: [embed]})
    })
    })
})
    
    client.on("channelDelete", channel => {
        
logModel.findOne({ Guild: channel.guild.id}, async(e, data) => {
      
    if(!data) return  console.log(`${e} data has been not found`)
  

    channel.guild.fetchAuditLogs().then(logs => { 
    var userID = logs.entries.first().executor.id; 
    let channelc = channel.guild.channels.cache.get(data.Channel)
    let embed = new MessageEmbed()
    .setTitle('Channel Delete')
    .setDescription(`Channel Name : ${channel.name}`)
    .setTimestamp()
    .setColor(color)
    channelc.send({embeds: [embed]})
    })
    })
})
    
    client.on("roleCreate", role => {
        
logModel.findOne({ Guild: role.guild.id}, async(e, data) => {
      
    if(!data) return console.log(`${e} data has been not found`)
  

    role.guild.fetchAuditLogs().then(logs => { 
    var userID = logs.entries.first().executor.id; 
    let channel = role.guild.channels.cache.get(data.Channel)
    let embed = new MessageEmbed()
    .setTitle('Role Create')
    .setDescription(`Role Name: \n\`\`\`${role.name}\`\`\``)
    .setTimestamp()
    .setColor(color)
    channel.send({embeds: [embed]})
    })
    })
})
    
    client.on("roleDelete", role => {
        
logModel.findOne({ Guild: role.guild.id}, async(e, data) => {
      
    if(!data) return console.log(`${e} data has been not found`)
  

    role.guild.fetchAuditLogs().then(logs => { 
    var userID = logs.entries.first().executor.id; 
    let channel = role.guild.channels.cache.get(data.Channel)
    let embed = new MessageEmbed()
    .setTitle('Role Delete')
    .setDescription(`Role Name: \n\`\`\`${role.name}\`\`\``)
    .setTimestamp()
    .setColor(color)
    channel.send({embeds: [embed]})
    })
    })
})






client.on("channelUpdate" ,(oldChannel, newChannel) => {
    logModel.findOne({ Guild: oldChannel.guild.id}, async(e, data) => {
        if(!data) return console.log(`${e} data has been not found`)
        oldChannel.guild.fetchAuditLogs().then(logs => { 
            let userID = logs.entries.first().executor.id; 
        let channel = oldChannel.guild.channels.cache.get(data.Channel)
        let guild = oldChannel.guild.id;
        let member = oldChannel.guild.members.cache.get(userID);
    if (oldChannel.name !== newChannel.name) {
        const nameEmbed = new MessageEmbed()
        .setTitle('Channel Updates')
        .addField('Channel Name Changed', `${oldChannel.name} to ${newChannel.name} `)
        .addField('By', `<@${userID}>`)
        .setColor(color)
     .setThumbnail(member.user.displayAvatarURL())
     .setTimestamp()


        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel("Jump to channel") // text in button
            .setStyle("LINK") // color
          
            .setURL(`https://discord.com/channels/${guild}/${newChannel.id}`) 
        );

     


        channel.send({ embeds: [nameEmbed] , components: [row] })

    } else if (oldChannel.topic !== newChannel.topic) {
        const topicEmbed = new MessageEmbed()
        .setTitle('Channel Updates')
        .addField('Channel Topic Changed', `${oldChannel.topic} to ${newChannel.topic}`)
        .setColor(color)
        .setTimestamp()
        .addField('By', `<@${userID}>`)
        .setThumbnail(member.user.displayAvatarURL())
        const row2 = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel("Jump to channel") // text in button
            .setStyle("LINK") // color
          
            .setURL(`https://discord.com/channels/${guild}/${newChannel.id}`) 
        );

     

        channel.send({ embeds: [topicEmbed] , components : [row2]})

    } else if (oldChannel.position !== newChannel.position) {
        const positionEmbed = new MessageEmbed()
        .setTitle('Channel Updates')
        .addField('Channel Position Changed', `${oldChannel.position} -> ${newChannel.position}`)
        .setColor(color)
        .setTimestamp()
        .addField('By', `<@${userID}>`)
        .setThumbnail(member.user.displayAvatarURL())
        const row3 = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel("Jump to channel") // text in button
            .setStyle("LINK") // color
          
            .setURL(`https://discord.com/channels/${guild}/${newChannel.id}`) 
        );

        channel.send({ embeds: [positionEmbed] , components: [row3] })

    } else if (oldChannel.type !== newChannel.type) {
        const typeEmbed = new MessageEmbed()
        .setTitle('Channel Updates')
        .addField('Channel Type Changed', `${oldChannel.type} -> ${newChannel.type}`)
        .setColor(color)
        .addField('By', `<@${userID}>`)
        .setTimestamp()

        channel.send({ embeds: [typeEmbed] })

    } else if (oldChannel.nsfw !== newChannel.nsfw) {
        const nsfwEmbed = new MessageEmbed()
        .setTitle('Channel Updates')
        .addField('Channel NSFW Changed', `${oldChannel.nsfw} -> ${newChannel.nsfw}`)
        .addField('By', `<@${userID}>`)
        .setColor(color)
        .setTimestamp()

        channel.send({ embeds: [nsfwEmbed] })

    } else if (oldChannel.bitrate !== newChannel.bitrate) {
        const bitrateEmbed = new MessageEmbed()
        .setTitle('Channel Updates')
        .addField('Channel Bitrate Changed', `${oldChannel.bitrate} -> ${newChannel.bitrate}`)
        .addField('By', `<@${userID}>`)
        .setColor(color)
        .setTimestamp()

        channel.send({ embeds: [bitrateEmbed] })

    } else if (oldChannel.userLimit !== newChannel.userLimit) {
        const userLimitEmbed = new MessageEmbed()
        .setTitle('Channel Updates')
        .addField('Channel UserLimit Changed', `${oldChannel.userLimit} -> ${newChannel.userLimit}`)
        .setColor(color)
        .addField('By', `<@${userID}>`)
        .setTimestamp()

        channel.send({ embeds: [userLimitEmbed] })

    } else if  (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
        const rateLimitPerUserEmbed = new MessageEmbed()
        .setTitle('Channel Updates')
        .addField('Channel RateLimitPerUser Changed', `${oldChannel.rateLimitPerUser} to ${newChannel.rateLimitPerUser}`)
        .setColor(color)
        .setTimestamp()
        .addField('By', `<@${userID}>`)

     channel.send({ embeds: [rateLimitPerUserEmbed] })

    } else {
 
 
        return;
    }

        })
})
})

client.on("guildUpdate" , async(oldGuild, newGuild) => {
    logModel.findOne({ Guild: oldGuild.id}, async(e, data) => {
        if(!data) return  console.log(`${e} data has been not found`)
        oldGuild.fetchAuditLogs().then(logs => {
            let userID = logs.entries.first().executor.id; 
            let channel = oldGuild.channels.cache.get(data.Channel)
           // let guild = oldChannel.guild.id;
          //  let member = oldChannel.guild.members.cache.get(userID);

            if (newGuild.name !== oldGuild.name) {
                const embed = new MessageEmbed()
                    .setColor(color)
                    .setTitle("Server Updates")
                    .addField('Server Name Changed', `${oldGuild.name} to ${newGuild.name}`)
                    .setThumbnail(`${newGuild.iconURL()}`)
                    .addField('By', `<@${userID}>`)
                    .setTimestamp()
        
                channel.send({ embeds: [embed]})
        
            } else if (newGuild.iconURL() !== oldGuild.iconURL()) {
                const embed = new MessageEmbed()
                    .setColor(color)
                    .setTitle("Server Updates")
                    .addField('Server Icon Changed', `[Old Icon](${oldGuild.iconURL()}) to [New Icon](${newGuild.iconURL()})`)
                    .setThumbnail(`${newGuild.iconURL()}`)
                    .addField('By', `<@${userID}>`)
                    .setTimestamp()
        
                channel.send({ embeds: [embed]})
        
            } else if (newGuild.splashURL() !== oldGuild.splashURL()) {
                const embed = new MessageEmbed()
                    .setColor(color)
                    .setTitle("Server Updates")
                    .addField('Server Splash Changed', `[Old Splash](${oldGuild.splashURL()}) => [New Splash](${newGuild.splashURL()})`)
                    .setThumbnail(`${newGuild.splashURL()}`)
                    .addField('By', `<@${userID}>`)
                    .setTimestamp()
        
               channel.send({ embeds: [embed]})
        
            } else if (newGuild.memberCount !== oldGuild.memberCount) {
                const embed = new MessageEmbed()
                    .setColor(color)
                    .setTitle("Server Updates")
                    .addField('Server Members Changed', `${oldGuild.memberCount} => ${newGuild.memberCount}`)
                    .setThumbnail(`${newGuild.iconURL()}`)
                    .addField('By', `<@${userID}>`)
                    .setTimestamp()
        
               channel.send({ embeds: [embed]})
        
            } else if (newGuild.ownerId !== oldGuild.ownerId) {
                const embed = new MessageEmbed()
                    .setColor(color)
                    .setTitle("Server Updates")
                    .addField('Server Owner Changed', `${oldGuild.owner.user.username} => ${newGuild.owner.user.username}`)
                    .setThumbnail(`${newGuild.iconURL()}`)
                    .addField('By', `<@${userID}>`)
                    .setTimestamp()
        
               channel.send({ embeds: [embed]})
            } else {
                return;
            }
              
    
    
        })
        

    


    })

})



