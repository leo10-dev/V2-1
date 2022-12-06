const { Client, CommandInteraction, MessageEmbed , Permissions} = require("discord.js");
const {color} = require("../../config.json")
const warnModel = require("../../models/warnModel")
const moment = require("moment")
module.exports = {
    name: "warnings",
    description: "display all warnings that a user has",
   // userPermissions: ["KICK_MEMBERS"],
    options: [
        {
            name : "target",
            description : "target to display warnings",
            type : 'USER',
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

        const user = interaction.options.getMember("target")
        if(!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)){
            return interaction.followUp({embeds : [
              new MessageEmbed()
              .setColor(color)
              .setDescription(`**You do not have permission**`)
            ]})
           }
        const userWarnings = await warnModel.find({

            userId: user.id,
            gulidId: interaction.guild.id,
            
        })

        if(!userWarnings?.length) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setColor(color)
                .setDescription(`${user} has no warnings in the server`)
            ]
            
        })
        const embedDis = userWarnings.map((warn) =>{
          //  const moderator = interaction.members.cache.get(
               // warn.moderatorId
          //  )
            return [
                `WarnId: ${warn._id}`
              //  `Moderator: ${moderator || "Has left"}`,
                `Date: ${moment(warn.timestamp).format("MMMM do YYYY")}`,
                `Reason: ${warn.reason}`
            ].join("\n")
        })
        .join("\n\n")
        const embed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${user.tag} Warnings`)
        .setDescription(`${embedDis}`)
        interaction.followUp({embeds: [embed]})
        

        
     

     }
    }