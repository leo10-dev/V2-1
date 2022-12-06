const { Client, CommandInteraction, MessageEmbed , Permissions} = require("discord.js");
const {color} = require("../../config.json")
const logModel = require("../../models/logModel")
module.exports = {
    name: "disable-log",
    description: "disable log channel",
    userPermissions: ["MANGE_SERVER"],
   
     /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
      run: async (client, interaction, args) => {
      
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANGE_SERVER)){
            return interaction.followUp({embeds : [
              new MessageEmbed()
              .setColor(color)
              .setDescription(`**You do not have Mange server permissions**`)
            ]})
           }
       // const channel = interaction.options.getChannel("channel")

        logModel.findOne({ Guild: interaction.guild.id}, async(e, data) => {
      
            if(!data) return;
          
           data.delete();
           
        })

        interaction.followUp({embeds : [
            new MessageEmbed()
            .setColor(color)
            .setDescription("successfully log channel has been deleted")
        ]})
        
        


       
    }


    }