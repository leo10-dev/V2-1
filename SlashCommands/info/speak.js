const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const {color} = require("../../config.json")
let { getAudioUrl } = require("google-tts-api");
let { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    name: "speak",
    description: "Speak in voice channel",
   // userPermissions: [""],
    options: [
        {
            name : "speak",
            description : "The text you want him to speak it",
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

        const speak = interaction.options.getString("speak")
        let voiceChannel = interaction.member.voice.channel;
     
    
        if (speak.length > 800) return interaction.followUp({embeds : [
            new MessageEmbed()
            .setColor(color)
            .setDescription("I can only speak 800 words!")
        ]})
        if (!voiceChannel) return interaction.followUp({embeds : [
            new MessageEmbed()
            .setColor(color)
            .setDescription("Please join a voice channel to use this command!")
        ]})

        let audioUrl = await getAudioUrl(speak, {
            lang: "en",
            slow: false,
            host: 'https://translate.google.com',
            timeout: 20000,
        });

        let player = createAudioPlayer();
        let resource = createAudioResource(audioUrl);

        let connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.channel.guild.id,
            adapterCreator: interaction.channel.guild.voiceAdapterCreator,
        });

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            connection.disconnect();
        });

        interaction.followUp({embeds : [
            new MessageEmbed()

            .setColor(color)
            .setDescription(`done`)
                ]})
    
    }


    }