const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const {color} = require("../../config.json")
const config = require("../../config.json")
const ms = require("ms");
module.exports = {
    name: "start",
    description: "start giveaway",
    userPermissions: ["MANGE_SERVER"],
    options: [
        {
            name : "channel",
            description : "channel to send giveaway",
            type : 'CHANNEL',
            required : true 
        },
        {
            name : "time",
            description : "giveaway time",
            type : 'STRING',
            required : true 
        },
        {
            name : "number",
            description : "giveaway number of winners",
            type : 'INTEGER',
            required : true 

        },
        {
            name : "prize",
            description : "giveaway prize",
            type : 'STRING',
            required : true 
        }
    ],
     /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
      run: async (client, interaction, args) => {


        const giveawayChannel = interaction.options.getChannel("channel")
        const giveawayDuration = interaction.options.getString("time")
        const giveawayNumberWinners = interaction.options.getInteger("number")
        const  giveawayPrize  = interaction.options.getString("prize")

        if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
            return interaction.followUp({embeds : [
                new MessageEmbed()
                .setColor(color)
                .setDescription(`:boom: Hm. you haven\'t provided a duration. Can you try again?`)
            ]});
        }

        if (isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)) {
            return interaction.followUp({embeds : [
                new MessageEmbed()
                .setColor(color)
                .setDescription(":boom: Uh... you haven\'t provided the amount of winners.")
            ]});

        }

        giveawayChannel.send(`<@&${config["Giveaway_Options"].giveawayRoleID}>`).then((msg) => msg.delete({ timeout: 1000 }))
            client.giveawaysManager.start(giveawayChannel, {
                duration: ms(giveawayDuration),
                prize: giveawayPrize,
                winnerCount: parseInt(giveawayNumberWinners),
                hostedBy: config["Giveaway_Options"].hostedBy ? interaction.author : null,
                interaction: {
                    giveaway: ":tada: **GIVEAWAY** :tada:",
                    giveawayEnded: ":tada: **GIVEAWAY ENDED** :tada:",
                    timeRemaining: "Time remaining: **{duration}**!",
                    inviteToParticipate: "React with 🎉 to participate!",
                    winMessage: "Congratulations, {winners}! You won the **{prize}**!",
                    embedFooter: "Giveaways",
                    noWinner: "Not enough entrants to determine a winner!",
                    hostedBy: "Hosted by: {user}",
                    winners: "winner(s)",
                    endedAt: "Ended at",
                    units: {
                        seconds: "seconds",
                        minutes: "minutes",
                        hours: "hours",
                        days: "days",
                        pluralS: false
                    }
                }
            });
            



                    interaction.followUp({embeds : [
                        new MessageEmbed()
                        .setColor(color)
                        .setDescription("done")
                    ]})


     

    
    }


    }