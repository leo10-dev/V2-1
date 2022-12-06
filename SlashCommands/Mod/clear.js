const { Client, CommandInteraction, MessageEmbed , Permissions} = require("discord.js");
const ms = require("ms");
const {color} = require("../../config.json")
module.exports = {
    name: "clear",
    description: "remove messages",
    userPermissions: ["MANGE_MESSAGES"],
    options: [
        {
            name : "amount",
            description : "amount of message that is gonna be deleted ",
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

        const amount = interaction.options.getInteger("amount")
     

        if(amount > 100) return interaction.followUp({embeds: [
            new MessageEmbed()
        
            .setColor(color)
            .setDescription("The maximum of messages you can delete is 100 messages")

        ]})

        const message = await interaction.channel.messages.fetch({
            limit: amount + 1
        })

        const filtered = message.filter((msg) => Date.now() - msg.createdTimestamp < ms("14 days"))
        await interaction.channel.bulkDelete(filtered)

        interaction.channel.send({embeds: [
            new MessageEmbed()
            .setColor(color)
            .setDescription(`Deleted ${filtered.size - 1} messages`)
        ]
       }).then((msg) => {

        setTimeout(() => msg.delete(),ms("5 seconds"))

       })

      

     

    }


    }