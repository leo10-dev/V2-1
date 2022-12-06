const { MessageEmbed, Client } = require("discord.js");
const { inspect } = require("util")
const {color} = require("../../config.json")
const fs = require("fs")

module.exports = {
    name: "cmd",
    aliases: ['cm'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const Questions = require('../../players.json');
        const item = Questions[Math.floor(Math.random() * Questions.length)];
        const filter = response => {
            return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
        };

        setTimeout(async function () {
            const QuestionEmbed = new MessageEmbed()
                .setColor(message.guild.members.cache.get(client.user.id).displayHexColor)
                .setTitle('ما هو اسم الدولة؟')
                .setImage(item.question)
                .setDescription('لديك 15 ثانية لإنتهاء الوقت!')
                .setFooter(`Requested by ${message.guild.members.cache.get(message.author.id).nickname || message.author.username}`, message.author.avatarURL())
            message.reply({ embeds: [QuestionEmbed] }).then(async () => {
                message.channel.awaitMessages({ filter: filter, max: 1, time: 15000, errors: ['time'] })
                    .then(async collected => {
                        const winnerFirstTimeEmbed = new MessageEmbed()
                            .setColor(message.guild.members.cache.get(client.user.id).displayHexColor)
                            .setDescription(`**${collected.first().author}** مبروك!`)
                            .setFooter(`Requested by ${message.guild.members.cache.get(message.author.id).nickname || message.author.username}`, message.author.avatarURL())
                        message.channel.send({ embeds: [winnerFirstTimeEmbed] }).then(winner => { winner.react('🎉'); });
                    })
                    .catch(collected => {
                        const looserEmbed = new MessageEmbed()
                            .setColor(message.guild.members.cache.get(client.user.id).displayHexColor)
                            .setDescription('مرت 15 ثانية و محد جابها للأسف')
                            .setFooter(`Requested by ${message.guild.members.cache.get(message.author.id).nickname || message.author.username}`, message.author.avatarURL())
                        message.channel.send({ embeds: [looserEmbed] });
                        // console.log(collected)
                    });
            });
        });
    }
}