
const {pagination} = require('../../funcations/embeds');
const {
    Client, CommandInteraction, MessageEmbed,
    MessageActionRow, MessageSelectMenu
} = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
    name: 'help',
    description: 'Get help!',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let embeds = [];
        let Embed1 = new MessageEmbed().setDescription("Page1").setColor("DARK_BUT_NOT_BLACK");

        let Embed2 = new MessageEmbed().setDescription("Page 2").setColor("DARK_BUT_NOT_BLACK");
    
        let Embed3 = new MessageEmbed().setDescription("Page3").setColor("DARK_BUT_NOT_BLACK");
    
        embeds.push(Embed1, Embed2, Embed3)
    
        pagination(interaction, embeds);
  
    }
}