const { Client, CommandInteraction, MessageEmbed , Permissions } = require("discord.js");
const ms = require('ms');
const {color} = require("../../config.json")
module.exports = {
    name: "end",
    description: "Ends a giveaway.",

    options: [
        {
            name : "messageid",
            description : "giveaway message id",
            type : 'STRING',
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

       const id = interaction.options.getString('messageid')

    
       client.giveawaysManager.end(id, {
        setEndTimestamp: Date.now()
    })
        .then(() => {
            interaction.followUp({embeds : [
                new MessageEmbed()
                .setColor(color)
                .setDescription('Success! Giveaway ended!')
      
      
              ]});
        })
        .catch((e) => {
            if (e.startsWith(`Giveaway with message ID ${id} has already ended.`)) {

                interaction.followUp({embeds : [
                    new MessageEmbed()
                    .setColor(color)
                    .setDescription(`This giveaway has already ended!`)
          
          
                  ]});

            } else {
                console.error(e);
              console.log('An error occurred...');
            }
        });


    }
}