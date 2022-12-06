const { Client, CommandInteraction, MessageEmbed , Permissions} = require("discord.js");
const {color} = require("../../config.json")
module.exports = {
    name: "kick",
    description: "kick a member",
    userPermissions: ["KICK_MEMBERS"],
    options: [
        {
            name : "target",
            description : "target to kick",
            type : 'USER',
            required : true 
        },
        {
            name : "reason",
            description : "reason to this kick",
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
       const target = interaction.options.getMember("target")
       const reason = interaction.options.getString("reason") || "No Reason"

         if(!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)){
          return interaction.followUp({embeds : [
            new MessageEmbed()
            .setColor(color)
            .setDescription(`**You do not have kick members permissions**`)
          ]})
         }
       

       if(target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({embeds: [
        new MessageEmbed()
        .setColor(color)
        .setDescription("You can't take action on this user as their role highest tahn yours")
        
       ]})
      await target.send({embeds: [
        new MessageEmbed()
         .setColor(color)
         .setDescription(`You have been kick from ${interaction.guild.name}`)
       //  .addField("Kicked:", `${target.user.username}`)
      //   .addField("Moderator:", `<@${interaction.author.id}>`)
         .addField("Reason:", `${reason}`)
       ]})

       target.kick(reason);
       interaction.followUp({embeds:[
        new MessageEmbed()
        .setColor(color)
        .setDescription(`Kicked ${target.user.tag} successfully!`)
       ]})

       client.modlogs(
        {
        Member : target,
        Action : "Kick",
        Reason : reason,
      //  Mod : `<@${interaction.target.id}>`,
        Color : color,
    },
      interaction
    )

       
    },


};
