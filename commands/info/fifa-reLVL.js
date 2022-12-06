const Canvas = require('canvas');

const { MessageEmbed, MessageAttachment } = require('discord.js');

const { request } = require('undici');




module.exports = {
    name: "lvl",
    aliases: ['l'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        let say = message.content.split(" ").slice(1).join(" ");
      //  if (!say) return message.channel.send({ embeds: [new MessageEmbed().setDescription('You need to say something to put on the image!').setColor('GREY')] });
let x = 0 
let y = 0
        const canvas = Canvas.createCanvas(427, 597);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('https://cdn.discordapp.com/attachments/1003847474223525919/1027589945713496076/unknown.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	//ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
   // ctx.font = '32px Wahran';
    //ctx.fillStyle = '#00000';
    //ctx.fillText(`${say}`, 200, 230);
  
    //ctx.textAlign = "start";
   // ctx.fillText(`${say}`, canvas.width / 2.5, canvas.height / 2.0);

//    ctx.font = '28px sans-serif';
//ctx.fillStyle = '#ffffff';
//ctx.fillText('Profile', canvas.width / 2.5, canvas.height / 3.5);
ctx.font = '32px hyperjump';
ctx.fillStyle = '#00000';
ctx.fillText(` ${message.member.displayName}`, canvas.width / 1.9, canvas.height / 3.09);

	
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


ctx.arc(80, 400, 37, 0, Math.PI * 2, true);
     ctx.stroke();
    ctx.closePath();
     ctx.clip();
  

    const { body } = await request(message.author.displayAvatarURL({ format: 'jpg' }));
    const avatar = new Canvas.Image();
avatar.src = Buffer.from(await body.arrayBuffer());
   
ctx.drawImage(avatar, 40, 359, 80, 80);   
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
       ctx.beginPath();
     
      // ctx.strokeStyle = '#74037b';





  

        const attachment = new MessageAttachment(canvas.toBuffer(), 'wallpaper.png');
        message.channel.send({ files: [attachment]  });
    }}