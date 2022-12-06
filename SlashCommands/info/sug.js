const { Client, CommandInteraction, MessageEmbed , Permissions } = require("discord.js");
const {color} = require("../../config.json")
module.exports = {
    name: "suggestion",
    description: "hmm",
    options: [
        {
            name : "suggestion",
            description : "Your suggestion",
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
        
        const suggestionchannel = client.channels.cache.get('1011280855114715156');
     const msg = interaction.options.getString('suggestion')
        if (!suggestionchannel) {
          return interaction.followUp({content :
            'This Server has no channel named "suggestions", if the channel exists with some other name, I recommend you to change the channel name to `suggestions`'
        });
        }
         interaction.followUp({ content :
          ` Your Suggestion has been submitted!`
         });
    
        const embed = new MessageEmbed()
          .setTitle("New Suggestion")
          .setDescription(`${msg}`)
          .setFooter(`Suggested by ${interaction.user.tag}`)
          .setColor("LUMINOUS_VIVID_PINK");
    
        suggestionchannel.send({ embeds: [embed] })
          .then(function (message, str) {
            message.react("⬇️");
            message.react("⬆️");
          })
          .catch(function () {});

      }
    }