const { Client, CommandInteraction, MessageEmbed , Permissions} = require("discord.js");
const {color} = require("../../config.json")
module.exports = {
    name: "move",
    description: "Moves user to your voice channel.",
    userPermissions: ["MOVE_MEMBERS"],
    options: [
        {
            name : "user",
            description : "The user you want to move.",
            type : 'USER',
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


        const voiceChannel = interaction.member.voice.channel;
        const user = interaction.options.getMember('user');
        if(!interaction.member.permissions.has(Permissions.FLAGS.MOVE_MEMBERS)){
            return interaction.followUp({embeds : [
              new MessageEmbed()
              .setColor(color)
              .setDescription(`**You do not have Move members permissions**`)
            ]})
           }

        if (!voiceChannel) return interaction.followUp({
            embeds: [
                new MessageEmbed().setColor(color).setDescription("You must be in a voice channel.")
            ], ephemeral: true
        });

        if (user.id === interaction.user.id) return interaction.followUp({
            embeds: [
                new MessageEmbed().setColor(color).setDescription("You can't move yourself.")
            ], ephemeral: true
        });

        const userVoiceChannel = user.voice.channel;
        if (!userVoiceChannel) return interaction.followUp({
            embeds: [
                new MessageEmbed().setColor(color).setDescription("The user must be in a voice channel.")
            ], ephemeral: true
        });

        if (userVoiceChannel.id === voiceChannel.id) return interaction.followUp({
            embeds: [
                new MessageEmbed().setColor(color).setDescription(`${user} is already in your voice channel.`)
            ], ephemeral: true
        });

        const moved = await user.voice.setChannel(voiceChannel).catch(error => {
            interaction.followUp({
                embeds: [
                    new MessageEmbed()
                       .setColor(color).setDescription(`**${user}** don't have permission to join **${voiceChannel}**`)

                ], ephemeral: true
            });
        });

        if (moved) {
            interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setColor(color).setDescription(`**${user}** has been moved from **${userVoiceChannel}** to **${voiceChannel}**`)

                ], ephemeral: true
            });
        }


        

    }
}
     
    