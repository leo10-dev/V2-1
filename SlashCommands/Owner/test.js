const { Client, CommandInteraction, MessageEmbed , Permissions } = require("discord.js");
const {color} = require("../../config.json")
module.exports = {
    name: "first",
    description: "nnn",
    options: [
        {
            name : "ddd",
            description : "sss",
            type : 'CHANNEL',
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
        
        if(!interaction.member.permissions.has(Permissions.FLAGS.MOVE_MEMBERS)){
            return interaction.followUp({embeds : [
              new MessageEmbed()
              .setColor(color)
              .setDescription(`**You do not have permissions**`)
            ]})
           }
        const user = client.user.id
        
        const bot = interaction.guild.members.cache.get(user)
           const firstMessage = interaction.bot.messages.fetch({limit: 1, after: 1})
           

      }
    }