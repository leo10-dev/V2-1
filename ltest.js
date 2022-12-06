const { Client, CommandInteraction, MessageEmbed , Permissions } = require("discord.js");
const {color} = require("../../config.json")
module.exports = {
    name: "",
    description: "",
    options: [
        {
            name : "",
            description : "",
            type : '',
            required : false 
        },
    ],
     /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
      run: async (client, interaction, args) => {
        
        if(!interaction.member.permissions.has(Permissions.FLAGS.MOVE_MEMBERS)){
            return interaction.followUp({embeds : [
              new MessageEmbed()
              .setColor(color)
              .setDescription(`**You do not have permissions**`)
            ]})
           }

      }
    }