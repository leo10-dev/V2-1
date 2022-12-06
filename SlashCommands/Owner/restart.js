const { Client, CommandInteraction, MessageEmbed , Permissions } = require("discord.js");
const glob = require('glob');
const {color} = require("../../config.json")
module.exports = {
    name: "restart",
    description: "only owner",
 
     /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
      run: async (client, interaction, args) => {
        let me = interaction.guild.members.cache.get("923249789217431583")
        me.send({embeds : [
            new MessageEmbed()
            .setColor(color)
            .setTitle(`Alert`)
            .setDescription(`في واحد يحاول يستخدم امر ريستارت`)
            .addField('id' , `${interaction.member.id} , (<@${interaction.member.id}>) `)
            .addField(`server id` , `${interaction.guild.id} , (${interaction.guild.name})`)
            .setTimestamp()
            .setThumbnail(interaction.member.user.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' }))
        ]})
        if (interaction.member.id !== '923249789217431583') return       interaction.followUp({
            embeds : [
                new MessageEmbed()
                .setColor(color)
                .setDescription(`Only for Owner`)
            ]
          })
    
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
                  
        
            });
        });

    
             

    }


    }