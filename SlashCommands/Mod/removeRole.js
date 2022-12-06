const { MessageEmbed , Permissions } = require("discord.js");
const {color} = require("../../config.json")
module.exports = {
    name: "removerole",
    description: "returns websocket ping",
    options: [
        {
            name: "user",
            description: "User ?",
            type: "USER",
            required: true,
        },
        {
            name: "role",
            description: "ROLE ?",
            type: "ROLE",
            required: true,
        },
    ],
    /**
         *
         * @param {Client} client
         * @param {CommandInteraction} interaction
         * @param {String[]} args
         */
        run: async (client, interaction, args) => {
            if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)){
                return interaction.followUp({embeds : [
                  new MessageEmbed()
                  .setColor(color)
                  .setDescription(`**You need the ``MANAGE_ROLES`` permission to use this command!**`)
                ]})
               }
    



            const member = interaction.options.getMember("user")
            const roleto = interaction.options.getRole("role")
           
        
            if (roleto.position >= interaction.member.roles.highest.position) return interaction.followUp({
                embeds : [
                    new MessageEmbed()
                    .setColor(color)
                    .setDescription(`I couldn't change the roles for that user. Please check my permissions and role position.`)
                ]
              })
        
            if(roleto.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({
                embeds : [
                    new MessageEmbed()
                    .setColor(color)
                    .setDescription(`I couldn't change the roles for that user. Please check my permissions and role position.`)
                ]
              })
        

            member.roles.remove(roleto)
            interaction.followUp({embeds : [
                new MessageEmbed().setColor(color)
                .setDescription(`Added the ${roleto} role to ${member}`)
            ]})
        },
    };