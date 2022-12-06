const {DB} = require("../../models/afkModel")
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const {color} = require("../../config.json");
const { setAfk, getAfk, removeAfk } = require('../../funcations/afk')
module.exports = {
    name: "afk",
    description: "afk command",
    userPermissions: ["MANGE_CHANNEL"],
    options: [
        {
            name: "set",
            description: "Set your afk status",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "status",
                    description: "The status to be set",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "return",
            description: "Return from being AFK",
            type: "SUB_COMMAND"
        },
        {
            name: "check",
            description: "Check if a user is AFK",
            type: "SUB_COMMAND",
            options: [{
                name: "user",
                description: "who do you want to check",
                type: "USER",
                required: true
            }]
        }
    ],
     /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
      run: async (client, interaction, args) => {
        const { options, user, createdTimestamp, guild } = interaction;
        const TYPE = options.getSubcommand(['set', 'return', 'check']);
        const STATUS = options.getString("status");

        const embed = new MessageEmbed()
        embed.setColor(color)

        switch (TYPE) {
            case "set": {
                // If a user is already afk return
                if (getAfk(client, user, guild)) return interaction.followUp({ embeds: [embed.setDescription('You are already AFK')], ephemeral: true});
                
                // Else set them as afk
                await setAfk(client, user, guild, STATUS, createdTimestamp);

                embed.setAuthor({ name: `You are now AFK`, iconURL: user.avatarURL({ dynamic: true})})
                embed.setDescription(`**Reason**: ${STATUS}`)

           

                return interaction.followUp({ embeds: [embed]})
            }
            case "return": {
                // If a user is not afk return
                if (!getAfk(client, user, guild)) return interaction.followUp({ embeds: [embed.setDescription('You are not AFK')], ephemeral: true});

                // Else remove them from afk
                await removeAfk(client, user, guild);

                embed.setAuthor({ name: `Welcome back!`, iconURL: user.avatarURL({ dynamic: true})})
                return interaction.followUp({ embeds: [embed]});
            }
            case "check": {
                let target = options.getUser('user')
                let isAfk = getAfk(client, target, guild);

                const embed = new MessageEmbed()
                .setColor(isAfk ? 'RED' : 'GREEN')
                .setAuthor({ name: `${target.tag} ${isAfk ? "IS afk" : "is NOT afk"}`, iconURL: target.avatarURL({ dynamic: true})})
                if (isAfk) {
                    embed.setDescription(`
                    Reason: \`${isAfk.status}\`
                    Time: <t:${isAfk.time}:R>
                    `)
                } 

                interaction.followUp({ embeds: [embed]})
            }
        }

      
   
    }


    }
