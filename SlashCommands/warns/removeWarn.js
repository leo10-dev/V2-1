const { Client, CommandInteraction, MessageEmbed , Permissions} = require("discord.js");
const {color} = require("../../config.json")
const warnModel = require("../../models/warnModel")
module.exports = {
    name: "remove-warn",
    description: "Remove warn using an id",
    userPermissions: ["KICK_MEMBERS"],
    options: [
        {
            name : "warnid",
            description : "warnId that you want to delete",
            type : 'STRING',
            required : true 
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
     run: async (client, interaction, args) => {

       const warnId = interaction.options.getString("warnid")
       if(!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)){
        return interaction.followUp({embeds : [
          new MessageEmbed()
          .setColor(color)
          .setDescription(`**You do not have permission**`)
        ]})
       }
       const data = await warnModel.findById(warnId);
       

       if(data) return interaction.followUp({embeds: [

        new MessageEmbed()
        .setColor(color)
        .setDescription(`${warnId} is not valid id!`)

       ]})
       data.delete();
       const user = interaction.guild.members.cache.get(data.userId)
       return interaction.followUp({embeds: [
        new MessageEmbed()
            .setColor(color)
            .setDescription(`Removed 1 ${user}'s warnings`)
        
       ]})

       


     }
    }