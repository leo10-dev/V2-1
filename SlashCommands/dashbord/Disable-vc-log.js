const voicelogModel = require("../../models/voicelogModel")
const { Client, CommandInteraction, MessageEmbed , Permissions} = require("discord.js");
const {color} = require("../../config.json")
module.exports = {
    name: "disable-voice-log",
    description: "disable voice log command",
    userPermissions: ["MANGE_CHANNEL"],
    options: [
        {
            name : "channel",
            description : "disable voice log channel",
            type : 'CHANNEL',
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
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANGE_SERVER)){
          return interaction.followUp({embeds : [
            new MessageEmbed()
            .setColor(color)
            .setDescription(`**You do not have Mange server permissions**`)
          ]})
         }
      
        const channel = interaction.options.getChannel("channel")
        voicelogModel.findOne({ Guild: interaction.guild.id }, async(err, data) => {

            if(!data) return;
          
            data.delete();
        

           
            interaction.followUp({embeds : [
                new MessageEmbed()
                .setColor(color)
                .setDescription(`${channel} Has Been Set As log Channel!`)
            ]})
            })
            
    }


    }
