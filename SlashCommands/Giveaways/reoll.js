const { Client, CommandInteraction, MessageEmbed , Permissions } = require("discord.js");
const ms = require('ms');
const {color} = require("../../config.json")
module.exports = {
    name: "reroll",
    description: "Rerolls a giveaway.",

    options: [
        {
            name : "message",
            description : "giveaway message id",
            type : 'INTEGER',
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

        if(!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)){
        return interaction.followUp({embeds : [
          new MessageEmbed()
          .setColor(color)
          .setDescription(`**:boom: You need to have the \`MANAGE_MESSAGES\` permission to reroll giveaways.**`)
        ]})
       }

       const id = interaction.options.getInteger('message')

       let giveaway =
    //   client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
       client.giveawaysManager.giveaways.find((g) => g.messageID === id);


       client.giveawaysManager.reroll(id)
       .then(() => {
           interaction.followUp({embeds : [
          new MessageEmbed()
          .setColor(color)
          .setDescription(`Giveaway rerolled!`)


        ]});
       })
       .catch((e) => {
           if (e.startsWith(`Giveaway with message ID ${id} has not ended.`)) {
            interaction.followUp({embeds : [
                new MessageEmbed()
                .setColor(color)
                .setDescription(`This giveaway has not ended!`)
      
      
              ]});
           } else {
               console.error(e);
               console.log('An error occurred...');
           }
       });

    
    }


    }