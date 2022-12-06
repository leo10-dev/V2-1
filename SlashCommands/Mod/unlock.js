const { Client, CommandInteraction, MessageEmbed , Permissions } = require("discord.js");
const {color} = require("../../config.json")
module.exports = {
    name: "unlock",
    description: "Unlocks a text channel",
    options: [
        {
            name : "channel",
            description : "Text channel mention to unlock.",
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

     if(!interaction.member.permissions.has(Permissions.FLAGS.TIMEOUT_MEMBERS)){
        return interaction.followUp({embeds : [
          new MessageEmbed()
          .setColor(color)
          .setDescription(`**You do not have permissions to unlock channel**`)
        ]})
    }
    channel.edit({
        permissionOverwrites: [
            { type: 'role', id: interaction.guild.roles.everyone, allow: ['SEND_MESSAGES'] },
        ],
    });


      interaction.followUp({
        embeds : [
            new MessageEmbed()
            .setColor(color)
            .setDescription(`**${channel.name}** has been unlocked.`)
        ]
      })



    
    }


    }