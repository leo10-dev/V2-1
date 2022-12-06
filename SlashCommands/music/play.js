const { QueryType } = require("discord-player");

const ytdl = require('ytdl-core')
const { joinVoiceChannel  , createAudioPlayer , createAudioResource} = require('@discordjs/voice');

module.exports = {
    name: "play",
    description: "play a song",
    options: [
        {
            name: "songtitle",
            description: "title of the song",
            type: "STRING",
            required: true,
        },
    ],
    run: async (client, interaction) => {
        const songTitle = interaction.options.getString("songtitle");
       
            if (!interaction.member.voice.channel)
            return interaction.followUp({
                content: "Please join a voice channel first!",
            });

                let connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                    selfDeaf: false

                });

                const stream = await ytdl(`${songTitle}`, { filter: 'audioonly' });
                const player = createAudioPlayer();
                var resource = createAudioResource(stream, { seek: 0, volume: 1 });
                player.play(resource);
                connection.subscribe(player);

                interaction.followUp({
                   content : `Playing ${songTitle}`
                  })
            
    },
};


