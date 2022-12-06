const { MessageEmbed, Client } = require("discord.js");


const glob = require('glob');

module.exports = {
    name: "ss",
    aliases: ['rest'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        if (message.author.id !== '923249789217431583') return;
        client.commands.sweep(() => true);
        glob(`${__dirname}/../**/*js`, async (err, filePath) => {
            if (err) return console.log(err);
            filePath.forEach((file) => {
                delete require.cache[require.resolve(file)];
                const pull = require(file);
                if (pull.name) {
                    console.log(`Reloaded ${pull.name} (cmd)`)
                    client.commands.set(pull.name, pull);
                }
                if (pull.aliases && Array.isArray(pull.aliases)) {
                    pull.aliases.forEach((alias) => {
                        client.aliases.set(alias, pull.name);
                    });
                }
                message.reply(`Reloaded ${pull.name} (cmd)`)
            });
        });
    }
    
}