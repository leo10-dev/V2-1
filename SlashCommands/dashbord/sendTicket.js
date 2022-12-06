const { Client, CommandInteraction, MessageEmbed , Permissions , MessageActionRow , MessageSelectMenu } = require("discord.js");
const {color} = require("../../config.json")
const ticmodel = require('../../models/ticketModel')

module.exports = {
    name: "send-ticket",
    description: "ticket",
    options: [
        {
            name : "channel",
            description : "channel ?",
            type : 'CHANNEL',
            required : true, 
        },
        {
            name : "category",
            description : "category ?",
            type : 'CHANNEL',
            required : true, 
        }
    ],
     /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
      run: async (client, interaction, args) => {
        
        const category = interaction.options.getChannel('category')
        const ticketChannel = interaction.options.getChannel('channel')
         const message = '1012280986609909821'
      
        ticmodel.findOne({ Guild: interaction.guild.id }, async(err, data) => {

            if(data) {
              data.Channel = ticketChannel.id;
              data.save()
            } else {
              new ticmodel({
                Guild: interaction.guild.id,
                Channel: ticketChannel.id,
                Category : category.id,
                message : message
              }).save()
            }

        })



          let TicketEmbed = new MessageEmbed()
          .setColor("LUMINOUS_VIVID_PINK")
          .setTitle("🎫 Create a Ticket")
          .setDescription("Select for what you need help with")
          .setFooter(interaction.guild.name, interaction.guild.iconURL({dynamic: true}));
      
          let Menu = new MessageSelectMenu()
          .setCustomId("FirstTicketOpeningMenu")
          .setPlaceholder("Click me to open a Ticket")
          .setMaxValues(1) 
          .setMinValues(1)
          .addOptions([ //maximum 25 items
              {
                  label: "General Help".substr(0, 25), //maximum 25 Letters long
                  value: "general_help".substr(0, 25), //maximum 25 Letters long
                  description: "If you have a Question about our stuff".substr(0, 50), //maximum 50 Letters long
                  emoji: "👌", //optional
              },
              {
                  label: "Ordering Help".substr(0, 25), //maximum 25 Letters long
                  value: "ordering_help".substr(0, 25), //maximum 25 Letters long
                  description: "If you need help with ordering".substr(0, 50), //maximum 50 Letters long
                  emoji: "👍", //optional
              }
          ])
      let row = new MessageActionRow().addComponents(Menu);
      
      ticketChannel.send({
          embeds: [TicketEmbed],
          components: [row]
      }).then((m) => {
        interaction.followUp({
            content : '👍 **Setupped**'
        })
      })
  
       
      

      }
    }