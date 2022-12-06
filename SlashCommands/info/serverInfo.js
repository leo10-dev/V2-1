const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const {color} = require("../../config.json")

module.exports = {
    name: "server-info",
    description: "server info",
    
     /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
      run: async (client, interaction, args) => {
     
        await interaction.guild.members.fetch();
        const members = interaction.guild.members.cache;
        const channels = interaction.guild.channels.cache;
        const emojis = interaction.guild.emojis.cache.size;
        const firstFiveEmojis = interaction.guild.emojis.cache.map(emoji => emoji).slice(0, 5).join(' ');
        const boostCount = interaction.guild.premiumSubscriptionCount;
        const verificationLevel = interaction.guild.verificationLevel;
        const rolesCount = interaction.guild.roles.cache.size;
        
        
        await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setAuthor({ name: `${interaction.guild.name}'s Information`, iconURL: interaction.guild.iconURL({ dynamic: true, size: 1024, format: 'png' }) })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024, format: 'png' }))
                    .addFields(
                        { name: '🆔 Server ID:', value: `${interaction.guildId}`, inline: true },
                        { name: '📆 Created On:', value: `**<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:R>**`, inline: true },
                        { name: '👑 Owned by:', value: `<@!${interaction.guild.ownerId}>`, inline: true },
                        { name: `👥  Members (${interaction.guild.memberCount}):`, value: `**${members.filter(member => member.presence?.status === 'online').size + members.filter(member => member.presence?.status === 'idle').size + members.filter(member => member.presence?.status === 'dnd').size}** Online | Idle | DND\n**${members.filter(member => !['online', 'idle', 'dnd'].includes(member.presence?.status)).size}** Offline\n**${members.filter(member => member.user.bot).size}** Bot`, inline: true },
                        { name: `💬 Channels (${interaction.guild.channels.cache.size}):`, value: `**${channels.filter(channel => channel.type === 0).size}** Text | **${channels.filter(channel => channel.type === 2).size}** Voice\n**${channels.filter(channel => channel.type === 4).size}** Category`, inline: true },
                        { name: `🌐 Others:`, value: `Verification Level: **${verificationLevel}**\nBoosts: **${boostCount}** <:boost:966837290896855070>\nRoles: **${rolesCount}**`, inline: true },
                        { name: `🛡️ Emojis (${emojis}):`, value: `**${firstFiveEmojis}**`, inline: true },
                    )
            ], 
        });



    }


    }