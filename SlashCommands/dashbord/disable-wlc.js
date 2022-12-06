const { Client, CommandInteraction, MessageEmbed , Permissions} = require("discord.js");
const {color} = require("../../config.json")
const WelcomeModel = require("../../models/WelcomeModel")
module.exports = {
    name: "disable-welcome",
    description: "disable log channel",
    userPermissions: ["MANGE_CHANNEL"],
  
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
        WelcomeModel.findOne({ Guild: interaction.guild.id}, async(e, data) => {
      
            if(!data) return;
          
           data.delete();
           
        })

        interaction.followUp({embeds : [
            new MessageEmbed()
            .setColor(color)
            .setDescription("successfully welcome channel has been deleted")
        ]})
        
        
        
    
    }


    }