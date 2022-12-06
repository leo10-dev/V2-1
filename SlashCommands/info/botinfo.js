const { Client, CommandInteraction, MessageEmbed , Permissions } = require("discord.js");
const { version } = require("discord.js");
const moment = require("moment");
const os = require("os")
const m = require("moment-duration-format");
const ms = require("ms")

const {color} = require("../../config.json")
module.exports = {
    name: "botinfo",
    description: "bot information",

 
     /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
      run: async (client, interaction, args) => {

        

 
    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    const botinfo = new MessageEmbed()
    .setAuthor({ name: `GalaxyBot information`, iconURL: interaction.client.user.avatarURL({ dynamic: true})})       
        .setColor(color)
      //  .addField("⏳ Mem Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`)
   //   .setDescription(`[invite me](https://discord.com/api/oauth2/authorize?client_id=994771571669471233&permissions=8&scope=bot)`)
      .setDescription(`[invite me](https://discord.com/api/oauth2/authorize?client_id=994771571669471233&permissions=8&scope=bot) | [Support Server](https://discord.gg/As2P2gQx)\n\n⏳ Uptime : **${duration}**\n📁 Users : ** ${client.users.cache.size}**\n📁 Servers : **${client.guilds.cache.size}** \n👾 Discord.js : **v${version}**\n📆 Created On : **<t:${Math.floor(interaction.client.user.createdTimestamp / 1000)}:R>**\n🎴API Latency : ${(client.ws.ping)}ms\n👑 Owner : <@923249789217431583> | **923249789217431583**
      
      
        `)
     
      .setThumbnail(interaction.client.user.avatarURL({ dynamic: true}))
       
         
      
       .setFooter(`GalaxyBot Developer : leo#2211`)
     interaction.followUp({embeds: [botinfo]})

     
    
    }


    }