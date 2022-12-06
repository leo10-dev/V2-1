const { Client, CommandInteraction, MessageEmbed , Permissions } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const {color} = require("../../config.json")
module.exports = {
    name: "join",
    description: "join bot foe your channel",
    options: [
        {
            name : "channel",
            description : "Select Channel to join",
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
     
        const channel = interaction.options.getChannel("channel")
        let connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.channel.guild.id,
            adapterCreator: interaction.channel.guild.voiceAdapterCreator,
        });  
        let player = createAudioPlayer();
        connection.subscribe(player);

        interaction.followUp({
            embeds : [
                new MessageEmbed()
                .setColor(color)
                .setDescription(`done`)
            ] 
          })
    

        

    
             

    }


    }