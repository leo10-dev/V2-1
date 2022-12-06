const AFK = require('../models/afkModel');
const { GuildMember } = require('discord.js');

/**

 * @param {Client} client 
 * @param {GuildMember} user 
 * @param {Guild} guild 
 * @returns {boolean} 
 */
function getAfk(client, user, guild) {
    return client.afkusers.get(`${user.id}-${guild.id}`);
}

/**
 *
 * @param {Client} client 
 * @param {GuildMember} user 
 * @param {Guild} guild 
 * @param {String} status
 * @param {String} time
 */
function setAfk(client, user, guild, status, time ) {

    AFK.findOne({ userId: user.id, guildId: guild.id },
        async (err, data) => {
            if (err) throw err;
            data = new AFK({
                userId: user.id,
                guildId: guild.id,
                status,
                time: parseInt(time / 1000),
                isAfk: true
            });
            await data.save();
            client.afkusers.set(`${user.id}-${guild.id}`, data);
        })
}

/**

 * @param {CLient} 
 * @param {GuildMember} 
 * @param {Guild}
 */
async function removeAfk(client, user, guild) {
    client.afkusers.delete(`${user.id}-${guild.id}`);
    await AFK.deleteOne({ userId: user.id, guildId: guild.id });
}

module.exports = {
    getAfk,
    removeAfk,
    setAfk
}