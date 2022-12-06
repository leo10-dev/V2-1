const { Client, CommandInteraction, MessageEmbed, Permissions } = require('discord.js');
const autoroleModel = require('../../models/autoroleModel');
const {color} = require("../../config.json")
module.exports = {
    name: 'setup-autorole',
    description: 'setup a auto role',
    directory: "guild",
    options: [
        {
            name: 'role',
            description: 'the role to give to the user',
            type: 'ROLE',
            required: true
        },
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args 
     */
    run: async(client, interaction, args) => {
        const role = interaction.options.getRole('role');
        let missingperms = new MessageEmbed().setColor(color)

        .setDescription(`:x: | You Need To Have \`Manage Roles\``).setColor(color)
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
           return interaction.followUp({ embeds: [missingperms] });
        }

        let postionerror = new MessageEmbed().setColor(color)
        .setDescription(`:x: | Please Move My Role Higher Than The One You Want To Make A Auto Role!`)
        if(role.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({ embeds: [postionerror] });


        autoroleModel.findOne({ GuildId: interaction.guildId }, async (err, data) => {
            if(data) {
                new autoroleModel({
                    GuildId: interaction.guild.id,
                    Role: role.id,
                }).save()
            } else {
                new autoroleModel({
                    GuildId: interaction.guild.id,
                    Role: role.id,
                }).save()
            }
        })
        let embed = new MessageEmbed()
        .setAuthor(`Setup Auto Role`, client.user.displayAvatarURL())
        .setDescription(`Auto role is now binded to ${role}!`)
        .setColor(color)

        interaction.followUp({ embeds: [embed]})
    }
}