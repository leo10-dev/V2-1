const WelcomeModel = require("../../models/WelcomeModel")
const { Client, CommandInteraction, MessageEmbed , Permissions} = require("discord.js");
const {color} = require("../../config.json")
module.exports = {
    name: "set-welcome",
    description: "set welcome command",
    userPermissions: ["MANGE_CHANNEL"],
    options: [
        {
            name : "channel",
            description : "set welcome channel",
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
        WelcomeModel.findOne({ Guild: interaction.guild.id }, async(err, data) => {

            if(data) {
              data.Channel = channel.id;
              data.save()
            } else {
              new WelcomeModel({
                Guild: interaction.guild.id,
                Channel: channel.id,
              }).save()
            }
            interaction.followUp({embeds : [
                new MessageEmbed()
                .setColor(color)
                .setDescription(`${channel} Has Been Set As Welcome Channel!`)
            ]})
            })
            
    }


    }
