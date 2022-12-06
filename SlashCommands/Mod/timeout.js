const { Client, CommandInteraction, MessageEmbed , Permissions} = require("discord.js");
const {color} = require("../../config.json")
const muteModel = require("../../models/muteModel")
const ms = require("ms");
module.exports = {
    name: "timeout",
    description: "mute members use set-mute before use mute command",
    userPermissions: ["MUTE_MEMBERS"],
    options: [
        {
            name : "user",
            description : "user to timeout ",
            type : 'USER',
            required : true 
        },
        {
            name : "time",
            description : "Duration of timeout ",
            type : 'STRING',
            required : true 

        },
        {
            name : "reason",
            description : "reason to mute ",
            type : 'STRING',
            required : true 
        }
    ],
     /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
      run: async (client, interaction, args) => {
        const user = interaction.options.getMember("user")
        const time = interaction.options.getString("time")
        const reason = interaction.options.getString("reason")
        if(!interaction.member.permissions.has(Permissions.FLAGS.TIMEOUT_MEMBERS)){
            return interaction.followUp({embeds : [
              new MessageEmbed()
              .setColor(color)
              .setDescription(`**You do not have timeout members permissions**`)
            ]})
           }
        const member = interaction.guild.members.cache.get(user.id)
        const timeinMs = ms(time);
        if(!timeinMs) return interaction.followUp({embeds : [
            new MessageEmbed()
            .setDescription("Please specify a valid time!")
            .setColor(color)
        ]})

        member.timeout(timeinMs, reason)
        interaction.followUp({embeds : [
            new MessageEmbed()
            .setColor(color)
            .setDescription(`${user} has been timeouted for ${time}`)
        ]})
      
      
        client.modlogs(
            {
            Member : member,
            Action : "timeout",
            Reason : reason,
          //  Mod : `<@${interaction.target.id}>`,
            Color : color,
        },
          interaction
        )
         
       
    
    }


    }