const { MessageEmbed } = require("discord.js");


module.exports = {
    name: "tsts",
    aliases: ['lo'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const me = message.guild.members.cache.get('972963457097932920')
        const fetchBans = message.guild.bans.fetch();
        if (!fetchBans) {
         
            const NoBannedUsersEmbed = new MessageEmbed()
                .setColor('#3300EE')
                .setDescription('This server does not have any banned members.')
                .setFooter(client.user.username, client.user.displayAvatarURL())
            return me.send(NoBannedUsersEmbed);
        } else {

            const bannedMembers = (await fetchBans)

            .map((member) => ` User Tag: - \`${member.user.tag}\`  User ID: -  \`${member.user.id}\` Ban Reason: - \`${member.reason}\``)
            .join(" \n ")
           

           me.send(`${bannedMembers}`)
        }

     }
    }
