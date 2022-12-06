const { Client, CommandInteraction, MessageEmbed , Permissions } = require("discord.js");
const {color} = require("../../config.json")
module.exports = {
    name: "lock",
    description: "Locks a text channel",
    options: [
        {
            name : "channel",
            description : "Text channel mention to lock.",
            type : 'CHANNEL',
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

     const channel = interaction.options.getChannel("channel") || interaction.channel;

  
    channel.edit({
        permissionOverwrites: [
            { type: 'role', id: interaction.guild.roles.everyone, deny: ['SEND_MESSAGES'] },
        ],
    });


      interaction.followUp({
        embeds : [
            new MessageEmbed()
            .setColor(color)
            .setDescription(`**${channel.name}** has been locked.`)
        ]
      })



    
    }


    }