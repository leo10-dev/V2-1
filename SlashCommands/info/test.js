const { Client, CommandInteraction, MessageEmbed , Permissions } = require("discord.js"); module.exports = {     name: "st",     description: "test",      /**      *      * @param {Client} client      * @param {CommandInteraction} interaction      */       run: async (client, interaction) => {        interaction.followUp({         embeds : [             new MessageEmbed()             .setDescription(`sl`)         ]       })         }       }