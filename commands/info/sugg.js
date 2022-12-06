const {MessageEmbed, MessageButton , MessageActionRow , MessageSelectMenu } = require('discord.js')

module.exports = {
    name: "suggestion",
    aliases: ['sug'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const msg = args.join(" ");
        message.delete();
        if (!msg) {
          return message.channel.send("Add a suggestion please");
        }
        const suggestionchannel = client.channels.cache.get('1001480221708537968');
     
        if (!suggestionchannel) {
          return message.channel.send(
            'This Server has no channel named "suggestions", if the channel exists with some other name, I recommend you to change the channel name to `suggestions`'
          );
        }
         message.channel.send(
          `${message.author}, Your Suggestion has been submitted!`
        );
    
        const embed = new MessageEmbed()
          .setTitle("New Suggestion")
          .setDescription(`${msg}`)
          .setFooter(`Suggested by ${message.author.tag}`)
          .setColor("LUMINOUS_VIVID_PINK");
    
        suggestionchannel
          .send({ embeds: [embed] })
          .then(function (message, str) {
            message.react("⬇️");
            message.react("⬆️");
          })
          .catch(function () {});

    }}