const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const axios = require("axios")
const {color} = require("../../config.json")


module.exports = {
  name: "banner",
  description: "Get the banner of the specified member",
  options: [
    {
      name: "member",
      description: "Input member to get banner",
      type: "USER",
      required: true,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const { user } = interaction.options.get("member");

    function decimalToHexString(number){
  if (number < 0)
  {
    number = 0xFFFFFFFF + number + 1;
  }

  return number.toString(16).toUpperCase();
}



    axios.get(`https://discord.com/api/users/${user.id}`, {
      headers: {
        Authorization: `Bot ${client.config.token}`
      },
    })
    .then((res) => {
      const { banner, accent_color } = res.data;

      let hexStr = decimalToHexString(accent_color);



let ur = `https://singlecolorimage.com/get/${hexStr}/400x100`

      if (banner) {
        const extension = banner.startsWith("a_") ? ".gif" : ".png";
        const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=2048`;

       
        const embed = new MessageEmbed()
        .setTitle(`${user.tag}'s Banner`)
        .setImage(url)
       .setColor(color);
        
        interaction.followUp({ embeds: [embed] })
      } else {
        if (accent_color) {
          const embed = new MessageEmbed()
       
          .setImage(ur)
          .setColor(color)
          .setDescription(`hex number : ${hexStr}`)

          interaction.followUp({ embeds: [embed] })
        } else {
        
        }
      }
    });
  },
};