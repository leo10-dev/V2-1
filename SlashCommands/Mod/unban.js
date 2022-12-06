const { Client, CommandInteraction, MessageEmbed, Message , Permissions} = require("discord.js");
const {color} = require("../../config.json")
module.exports = {
    name: "unban",
    description: "unban a member",
    userPermissions: ["BAN_MEMBERS"],
    options: [
        {
            name : "userid",
            description : "userid that you want to unban",
            type : 'STRING',
            required : true 
        },
        {
            name : "reason",
            description : "reason that you want to unban",
            type : 'STRING',
            required : false 
        }
    ],
      /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
     const user1  = interaction.options.getString("userid")
     const Reason = interaction.options.getString("Reason")
     if(!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)){
        return interaction.followUp({embeds : [
          new MessageEmbed()
          .setColor(color)
          .setDescription(`**You do not have unban members permissions**`)
        ]})
       }
        interaction.guild.members.unban(user1).then((user) => {
            interaction.followUp({embeds : [
                new MessageEmbed()
                .setColor(color)
                .setDescription(`${user.tag} is unbanned from this server`)
            ]})

        }).catch(() => {
            interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .color(color)
                    .setDescription("Please specify a valid banned member's id")
                ]
            })
        }

        )
      
      


       

    }
}