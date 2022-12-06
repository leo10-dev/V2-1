const { MessageEmbed, Client } = require("discord.js"); 
  module.exports = {   
      name: "ping",    
       aliases: ['pi'],     /**      *      * @param {Client} client      * @param {Message} message      * @param {String[]} args      */     run: async (client, message, args) => {      
       message.reply(`${client.ws.ping}ms!`)     } }