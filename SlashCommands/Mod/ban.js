const { Client, CommandInteraction, MessageEmbed, Permissions } = require("discord.js");
const {color} = require("../../config.json")
module.exports = {
    name: "ban",
    description: "ban a member",
    userPermissions: ["BAN_MEMBERS"],
    options: [
        {
            name : "target",
            description : "target to Ban",
            type : 'USER',
            required : true 
        },
        {
            name : "reason",
            description : "reason to this ban",
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
       if (target.id === client.user.id) {
        let embed = new MessageEmbed()
          .setDescription(`**You must ban the bot manually**`)
          .setColor(color)
       return interaction.followUp({ embeds: [embed] })
      }

       if (target.id === interaction.member.id) {
        let embed = new MessageEmbed()
          .setDescription(`**You can not ban yourself**`)
          .setColor(color)
       return interaction.followUp({ embeds: [embed] })
      }
       if(!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)){
        return interaction.followUp({embeds : [
          new MessageEmbed()
          .setColor(color)
          .setDescription(`**You do not have ban members permissions**`)
        ]})
       }

       if(target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({embeds: [
        new MessageEmbed()
        .setColor(color)
        .setDescription("You can't take action on this user as their role highest tahn yours")
        
       ]})
       try {

        await target.send({embeds: [
          new MessageEmbed()
           .setColor(color)
           .setDescription(`You have been banned from ${interaction.guild.name}`)
          // .addField("Banned:", `${target.user.tag}`)
         //  .addField("Moderator:", `${interaction.author.username}`)
           .addField("Reason:", `${reason}`)
         ]})
    

         
    
        } catch (err) {
         console.log("Can't send message")
        }
    

        try{

        target.ban({reason});
        interaction.followUp({embeds:[
          new MessageEmbed()
          .setColor(color)
          .setDescription(`Banned ${target.user.tag} successfully!`)
         ]})

        }catch(err){
          console.log(err)
        }


       client.modlogs(
        {
        Member : target,
        Action : "ban",
        Reason : reason,
      //  Mod : `<@${interaction.target.id}>`,
        Color : color,
    },
      interaction
    )


    },
};
