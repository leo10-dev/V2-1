const client = require("../index")
const autoroleModel = require("../models/autoroleModel")
const { MessageEmbed } = require("discord.js")

client.on(`guildMemberAdd`, async (member) => {
   autoroleModel.findOne({ GuildId: member.guild.id }, async (err, data) => {
       if(!data) return console.log(`l didn't found data for this fucking gulid idk why he did use this fucking bot lol :)`)

       const roletoadd = member.guild.roles.cache.get(data.Role);

       member.roles.add(roletoadd.id);
   })
})