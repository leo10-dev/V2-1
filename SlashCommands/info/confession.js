const { Client, CommandInteraction, MessageEmbed , Permissions } = require("discord.js");
const {color} = require("../../config.json")
module.exports = {
    name: "confession",
    description: "hmm",
    options: [
        {
            name : "confession",
            description : "Your confession",
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
        
        const suggestionchannel = client.channels.cache.get('1011308709269483650');
     const msg = interaction.options.getString('confession')


         interaction.followUp({ content :
          ` Your confession has been submitted!`
         });
    
        const embed = new MessageEmbed()
          .setTitle("confession")
          .setDescription(`${msg}`)
          .setColor("LUMINOUS_VIVID_PINK")
          .setTimestamp()
          .setFooter(`${interaction.user.tag}`)
    
        suggestionchannel.send({ embeds: [embed] })
          .then(function (message, str) {
            message.react("✨");
          })
          .catch(function () {});

      }
    }