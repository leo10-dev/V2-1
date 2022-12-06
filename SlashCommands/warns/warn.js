const { Client, CommandInteraction, MessageEmbed, Permissions } = require("discord.js");
const {color} = require("../../config.json")
const warnModel = require("../../models/warnModel")
module.exports = {
    name: "warn",
    description: "warn a member",
    userPermissions: ["KICK_MEMBERS"],
    options: [
        {
            name : "target",
            description : "target to warn",
            type : 'USER',
            required : true 
        },
        {
            name : "reason",
            description : "reason to this warn",
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
        const user = interaction.options.getMember("target")
        const reason = interaction.options.getString("reason")
        if(!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)){
            return interaction.followUp({embeds : [
              new MessageEmbed()
              .setColor(color)
              .setDescription(`**You do not have permissions**`)
            ]})
           }
        
        new warnModel({
            userId: user.id,
            gulidId: interaction.guild.id,
            moderatorId: interaction.user.id,
            reason,
            timestamp: Date.now(),

        }).save();
       
       user.send({embeds : [
        new MessageEmbed()
        .setColor(color)
        .setDescription(`You have been warned in ${interaction.guild.name}`)
        .addField("Reason:", `${reason}`)
       ]})

        interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setColor(color)
                .setDescription(`${user} has been warned for ${reason}`)
            ]
        })

    }
}