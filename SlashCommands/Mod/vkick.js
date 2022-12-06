const { Client, CommandInteraction, MessageEmbed , Permissions } = require("discord.js");
const {color} = require("../../config.json")
module.exports = {
    name: "vkick",
    description: "Disconnects a member from a voice channel.",
    options: [
        {
            name : "user",
            description : "User to disconnect from voice channel.",
            type : 'USER',
            required : false 
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

           

        const mentionedMember = interaction.options.getUser('user');
        if (mentionedMember.voice.channel) {
            if (mentionedMember.roles.highest.position >= interaction.member.roles.highest.position) return await interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setColor(color)
                        .setDescription(`❌ You can't disconnect someone have same your role or highest role more than you.`)
                ]
            });
            if (mentionedMember) {
                const memberVoiceChannel = mentionedMember.voice.channel;
                mentionedMember.voice.disconnect().catch(async err => {
                    // console.log(err);
                    await interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`❌ I can't disconnect **${mentionedMember.user.tag}**'`)
                        ]
                    });
                });
                await interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setColor(color)
                            .setDescription(`✅ **${mentionedMember.user.tag}**'s has been disconnected from ${memberVoiceChannel}`)
                    ]
                });
            }
        } else {
            await interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setColor(color)
                        .setDescription(`❌ User muse be in a voice channel.`)
                ]
            });
        }

      }
    }