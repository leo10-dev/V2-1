const { MessageEmbed } = require("discord.js")
const client = require("../index")
const db = require("../models/afkModel")
const {color} = require("../config.json")
const {getAfk , removeAfk} = require("../funcations/afk")



client.on("messageCreate" , async message =>{
if(message.author.bot) return;
if (!getAfk(client, message.author, message.guild)) return;

await removeAfk(client, message.author, message.guild);

const embed = new MessageEmbed()
.setColor('GREEN')
.setAuthor({ name: `You are no longer AFK`, iconURL: message.member.user.avatarURL({ dynamic: true})})

message.reply({ embeds: [embed]})
if(message.mentions.members.size){
    const Embed = new MessageEmbed()
    .setColor(color)
    message.mentions.members.forEach((m) => {
        db.findOne({guildId : message.guild.id , userId : m.id} ,async(err, data) => {
            if(err) console.log(err)
            if(data)
            Embed.setDescription(`${m} went AFK <t:${data.time}:R> \n Status : ${data.status} `)
            return message.reply({embeds: [Embed]})
            
        })

    })
}

})
//