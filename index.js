const { Client, Collection, MessageEmbed , MessageAttachment , MessageButton , MessageActionRow , MessageSelectMenu} = require("discord.js");
const { entersState, joinVoiceChannel, VoiceConnectionStatus, EndBehaviorType , createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const RPC = require('discord-rpc')
const { createWriteStream } = require('node:fs');
const prism = require('prism-media');
 // THIS IS THE WRONG BIT
const { pipeline } = require('node:stream');
const ffmpeg = require('ffmpeg');
const sleep = require('util').promisify(setTimeout);
const translate = require('@asmagin/google-translate-api');
const AFK = require('./funcations/afk');
const { GiveawaysManager } = require('discord-giveaways');
const fs = require("fs")
const express = require('express')
const app = express()
const DiscordOauth2 = require("discord-oauth2");
var cookieParser = require('cookie-parser')
const Enmap = require("enmap");
const DisMod = require("dismod");

const client = new Client({
    intents: 32767,
});
module.exports = client;

const rpc = new RPC.Client({ transport: 'websocket' });
const scopes = ['rpc', 'rpc.api', 'messages.read'];



const autoModerator = new DisMod.Manager(client);
const discordModals = require('discord-modals'); // Define the discord-modals package!
 // discord-modals needs your client in order to interact with modals

const manager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    default: {
        botsCanWin: false,
        embedColor: '#6a529e',
        embedColorEnd: '#6a529e',
        reaction: '🎉'
    }
});
// We now have a giveawaysManager property to access the manager everywhere!
client.giveawaysManager = manager;
//client.settings = new Enmap({ name: "settings",dataDir: "./databases/settings"});
client.settings = new Enmap({name: "settings"});

// Global Variables
app.enable("trust proxy")
app.set("etag" , false)
app.use(express.static(__dirname + "/dashbord"))
app.set("views" , __dirname)
app.set("view engine" , "ejs")
app.use(cookieParser())

const oauth = new DiscordOauth2({
    clientId: "994771571669471233",
	clientSecret: "YxAgFoz8SFncMi26cMNGx7rhpH2oZDNB",
    redirectUri: "http://localhost:5000/callback",


})
client.commands = new Collection();
client.slashCommands = new Collection();
client.afkusers = new Collection();
client.voiceManager = new Collection()
const modlogs = require("./models/logModel");
const e = require("express");
//client.settings = new Enmap({ name: "settings",dataDir: "./databases/settings"});
client.modlogs = async function({Member , Action , Color , Reason  , Mod}, message){
const data = await modlogs.findOne({ Guild: message.guild.id});
if(!data) return;

const channel = message.guild.channels.cache.get(data.Channel)
const logEmbed = new MessageEmbed()
.setColor(Color)
.setDescription(`Reason : ${Reason || 'no Reason !'}`)
.addField(`Member :`, `${Member}`)
.addField(`Mod : `, `${Mod}`)
.setTitle(`Action Took : ${Action}`)
.setTimestamp()
.setThumbnail(Member.displayAvatarURL({ dynamic: false, format: 'png' }))
channel.send({embeds : [logEmbed]})


};


// handler req
let files = fs.readdirSync("./dashbord/public").filter(F => {F.endsWith(".js")})
files.forEach(f =>{
    const file = require(`./dashbord/public/${f}`)
    if(file && file.name){
        app.get(file.name , file.run)
        console.log(`[Dashbord] loaded ${file.name}`)
    }

})
discordModals(client);
client.config = require("./config.json");

// Initializing the project
require("./handler")(client);

client.on("ready", () => {
  require("./events/reload")(client);
})

client.on("ready", () => {
    require("./dashbord/index")(client);
  })
  

process.on("unhandledRejection", (reason, p) => {
    console.log(" [Error_Handling] :: Unhandled Rejection/Catch");
    console.log(reason, p);
  });
  process.on("uncaughtException", (err, origin) => {
    console.log(" [Error_Handling] :: Uncaught Exception/Catch");
    console.log(err, origin);
  });
  process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(" [Error_Handling] :: Uncaught Exception/Catch (MONITOR)");
    console.log(err, origin);
  });
  process.on("multipleResolves", (type, promise, reason) => {
    // console.log(" [Error_Handling] :: Multiple Resolves");
    // console.log(type, promise, reason);
  });




  function createListeningStream(receiver, userId, user) {
    const opusStream = receiver.subscribe(userId, {
        end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 100,
        },
    });

    const oggStream = new prism.opus.OggLogicalBitstream({
        opusHead: new prism.opus.OpusHead({
            channelCount: 2,
            sampleRate: 48000,
        }),
        pageSizeControl: {
            maxPackets: 10,
        },
    });

    const filename = `./recordings/${user.id}.mp3`;

    const out = createWriteStream(filename, { flags: 'a' });
    console.log(`👂 Started recording ${filename}`);

    pipeline(opusStream, oggStream, out, (err) => {
        if (err) {
            console.warn(`❌ Error recording file ${filename} - ${err.message}`);
        } else {
            console.log(`✅ Recorded ${filename}`);
        }
    });
}
  client.on('messageCreate', async (message) => {
    /* If content starts with `!record` */
    if (message.content.startsWith('!record')) {
        /* If member do not have admin perms */
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('You do not have permission to use this command.'); 
        /* Get the voice channel the user is in */
        const voiceChannel = message.member.voice.channel
        /* Check if the bot is in voice channel */
        let connection = client.voiceManager.get(message.channel.guild.id)

        /* If the bot is not in voice channel */
        if (!connection) {
            /* if user is not in any voice channel then return the error message */
            if(!voiceChannel) return message.channel.send("You must be in a voice channel to use this command!")

            /* Join voice channel*/
            connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                selfDeaf: false,
                selfMute: true,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            /* Add voice state to collection */
            client.voiceManager.set(message.channel.guild.id, connection);
            await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
            const receiver = connection.receiver;

            /* When user speaks in vc*/
            receiver.speaking.on('start', (userId) => {
                if(userId !== message.author.id) return;
                /* create live stream to save audio */
                createListeningStream(receiver, userId, client.users.cache.get(userId));
            });

            /* Return success message */
            return message.channel.send(`🎙️ I am now recording ${voiceChannel.name}`);
        
            /* If the bot is in voice channel */
        } else if (connection) {
            /* Send waiting message */
            const msg = await message.channel.send("Please wait while I am preparing your recording...")
            /* wait for 5 seconds */
            await sleep(5000)

            /* disconnect the bot from voice channel */
            connection.destroy();

            /* Remove voice state from collection */
            client.voiceManager.delete(message.channel.guild.id)
            
            const filename = `./recordings/${message.author.id}`;

            /* Create ffmpeg command to convert pcm to mp3 */
            const process = new ffmpeg(`${filename}.pcm`);
            process.then(function (audio) {
                audio.fnExtractSoundToMP3(`${filename}.mp3`, async function (error, file) {
                    //edit message with recording as attachment
                   
                    //delete both files
                  //  fs.unlinkSync(`${filename}.pcm`)
                    fs.unlinkSync(`${filename}.mp3`)
                });
            }, function (err) {
                /* handle error by sending error message to discord */
                return msg.edit(`❌ An error occurred while processing your recording: ${err.message}`);
            });

        }
    }
})





client.on("messageCreate" , msg => {
    if (msg.content.startsWith('!My-rec')) {

        let voiceChannel = msg.member.voice.channel;
        if(!voiceChannel){
            msg.reply(`no`)
        }
        let player = createAudioPlayer();
        let resource = createAudioResource(`./recordings/${msg.author.id}.mp3`);


        let connection = joinVoiceChannel({
            channelId: msg.member.voice.channel.id,
            guildId: msg.channel.guild.id,
            adapterCreator: msg.channel.guild.voiceAdapterCreator,
        });

        player.play(resource);
        connection.subscribe(player);  
        player.on(AudioPlayerStatus.Idle, () => {  
            connection.disconnect();  
        });  


    }
}) 

client.on("messageCreate" , msg => {
    if(msg.content.startsWith("!rules")){
      const embed = new MessageEmbed()
        .setColor("#6a529e")
        .setDescription(`
        ** 1- يمنع التطرق للمواضيع الدينية أو السياسية

        يمنع منعًا باتًا الشتم والقذف والعنصرية بجميع انواعة・-2

        3- عدم اثارة المشاكل داخل السيرفر・

        4-・ ممنوع طلب اكواد 

        ممنوع استخدام برامج الصوت للتلاعب او الازعاج・-5

        يمنع التكرار الكلام السبام وطلب فك (باند - ميوت)・-6

        يمنع التحرش والإيحاءات الجنسية・-7

        ممنوع البيع والشراء ・-8

        احترام خصوصية الاخرين・-9

        يمنع وضع اسم , صور او وصف مخل للاداب・-10

        11- ・ يمنع نشر صورة مخله للادب

        12-・ يمنع ذكر اسماء سيرفرات اخرى**
        `)
        .setAuthor({ name: msg.guild.name, iconURL: msg.guild.iconURL({ dynamic: true, size: 1024, format: 'png' })})
        .setThumbnail(msg.guild.iconURL({ dynamic: true, size: 1024, format: 'png' }))
        msg.channel.send({embeds : [embed]})
    }
   
})
  



client.on("messageCreate", (message) => {
    if(!message.guild || message.author.bot) return;
    client.settings.ensure(message.guild.id, {
        prefix: client.config.prefix,
        hellomsg: "Hello World!",
        roles: [],
    });
    //Get the settings
    let { prefix, hellomsg, roles } = client.settings.get(message.guild.id)
    //Get the arguments
    let args = message.content.slice(prefix.length).trim().split(" ");
    let cmd = args.shift()?.toLowerCase();
    //If there is a command, execute it
    if(cmd && cmd.length > 0 && message.content.startsWith(prefix)){
        if(cmd == "prefix"){
            message.reply(`Current prefix is \`${prefix}\`!\n**Go to the Dashboard to change it!**\n> `).catch(console.error);
        }
        if(cmd == "hello"){
            message.reply(hellomsg).catch(console.error);
        }
        if(cmd == "roles"){
            message.reply(roles.map(r=>`<@&${r}>`).join(", ")).catch(console.error);
        }
    }
})



/**
 const { Util, MessageEmbed } = require('discord.js');
const { GOOGLE_API_KEY } = require('../../config');
const YouTube = require("simple-youtube-api");
const youtube = new YouTube(GOOGLE_API_KEY);
const Discord = require("discord.js");
const disbut = require('discord-buttons');
const { MessageActionRow, MessageButton } = require("discord-buttons");
const ytdl = require('ytdl-core');
const { prefix, developerID, bot, support } = require("../../config.json");
const {b, bnn, c, d, i, inv, m, p, pr, r, s, v, vo, lofi, su, dot, dev, lang, pau, on, off, fp} = require("../../emojis.json")
 const ba = bnn;
module.exports = {

        name: 'help',
        description: 'Play command',
        aliases: ["h"],
        category: "music",
        usage: '[song (name | link)]',
        accessableby: "everyone",
        premium: false,
    run: async (client, message, args, ops) => {


const db =require("quick.db");
let color = db.get(`color_${message.author.id}`);
  if(color === null) color = "#EFB9BE";

  
    }
};
  */
    



client.login(client.config.token);




  
autoModerator.on("badWordUsage", (message, usedBadWords) => {
    message.channel.send("Don't use bad word");
    //warnUserSomeHow()
    message.delete();
  });


  autoModerator.on("repeatedText", (message, repeatedCount) => {
    if (repeatedCount > 6) {
      message.channel.send(
        `Don't send repated text! (${repeatedCount} repeated messages!)`
      );
      //warnUserSomeHow()
    }
  });

  autoModerator.on("fastMessageSpam", (message) => {
    message.channel.send("chill daddy chill");
    //warnUserSomeHow()
    message.delete();
  });



    client.settings = new Enmap({name: "settings"});
    client.on("messageCreate", async (message) => {
      if(!message.guild || message.author.bot) return;
    
      let args = message.content.slice(client.config.prefix).trim().split(" ");
      let cmd = args.shift()?.toLowerCase();
    
      if(!message.content.startsWith(client.config.prefix) || !cmd || cmd.length == 0) return;
    
      client.settings.ensure(message.guildId, {
          TicketSystem1: {
              channel: "",
              message: "",
              category: "964439499901915166",
          }
      })
    
      if(message.content.startsWith( client.config.prefix + "ping")) {
          return message.reply(`Pong! \`${client.ws.ping}ms\``)
      }
      if(message.content.startsWith( client.config.prefix + "close")) {
          let TicketUserId = client.settings.findKey(d => d.channelId == message.channelId);
    
          if(!client.settings.has(TicketUserId)){
              return message.reply({
                  content: `:x: This Channel is not a ticket`
              })
          }
          client.settings.delete(TicketUserId);
          message.reply("Closed the Ticket deleting in 3 seconds");
      
      }
      if(message.content.startsWith( client.config.prefix + "setup")) {
    
          let channel = message.mentions.channels.first()
          if(!channel) return message.reply(":x: Please ping the Channel");
    
          let TicketEmbed = new MessageEmbed()
              .setColor("LUMINOUS_VIVID_PINK")
              .setTitle("🎫 Create a Ticket")
              .setDescription("Select for what you need help with")
              .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}));
          
              let Menu = new MessageSelectMenu()
              .setCustomId("FirstTicketOpeningMenu")
              .setPlaceholder("Click me to open a Ticket")
              .setMaxValues(1) 
              .setMinValues(1)
              .addOptions([ //maximum 25 items
                  {
                      label: "General Help".substr(0, 25), //maximum 25 Letters long
                      value: "general_help".substr(0, 25), //maximum 25 Letters long
                      description: "If you have a Question about our stuff".substr(0, 50), //maximum 50 Letters long
                      emoji: "👌", //optional
                  },
                  {
                      label: "Ordering Help".substr(0, 25), //maximum 25 Letters long
                      value: "ordering_help".substr(0, 25), //maximum 25 Letters long
                      description: "If you need help with ordering".substr(0, 50), //maximum 50 Letters long
                      emoji: "👍", //optional
                  }
              ])
          let row = new MessageActionRow().addComponents(Menu);
          
          channel.send({
              embeds: [TicketEmbed],
              components: [row]
          }).then((msg) => {
              client.settings.set(message.guildId, channel.id, "TicketSystem1.channel")
              client.settings.set(message.guildId, msg.id, "TicketSystem1.message")
              client.settings.set(message.guildId, channel.parentId, "TicketSystem1.category")
              return message.reply("👍 **Setupped**");
          }).catch((e) => {
              return message.reply("Something went wrong");
          })
      }
    })
    
    client.on("interactionCreate", async (interaction) => {
      if(!interaction.isSelectMenu() || !interaction.guildId || interaction.message.author.id != client.user.id) return
      
      client.settings.ensure(interaction.guildId, {
          TicketSystem1: {
              channel: "964440133480882206",
              message: "",
              category: "964439499901915166",
          }
      })
    
      let data = client.settings.get(interaction.guildId)
      if(!data.TicketSystem1.channel || data.TicketSystem1.channel.length == 0) return
    
      //right ticket system
      if(interaction.channelId == data.TicketSystem1.channel && interaction.message.id == data.TicketSystem1.message) {        
          switch(interaction.values[0]){
              case "general_help": {
                  let channel = await CreateTicket({
                      OpeningMessage: "Now creating the General Help Ticket ...",
                      ClosedMessage: `General Ticket Opened in: <#{channelId}>`,
                      embeds: [ new MessageEmbed().setColor("LUMINOUS_VIVID_PINK").setDescription("Thank you for creating a ticket! The support team will be here to help you in a sec.<@&957743234161975336> to close ticket use -close ").setTimestamp()]
                  }).catch(e=>{
                      return console.log(e)
                  })
                  console.log(channel.name); //work in the channel ... Awaiting message .. application etc.
              } break;
              case "ordering_help": {
                  let channel = await CreateTicket({
                      OpeningMessage: "Now creating the Ordering Help Ticket ...",
                      ClosedMessage: `Ordering Ticket Opened in: <#{channelId}>`,
                      embeds: [ new MessageEmbed().setColor("LUMINOUS_VIVID_PINK").setDescription(` Thank you for creating a ticket! The support team will be here to help you in a sec <@&957743234161975336> to close ticket use -close`).setTimestamp()]
                  }).catch(e=>{
                      return console.log(e)
                  })
                  console.log(channel.name); //work in the channel ... Awaiting message .. application etc.
              } break;
          }
          
          async function CreateTicket(ticketdata) {
              return new Promise(async function(resolve, reject) {
                  await interaction.reply({
                      ephemeral: true,
                      content: ticketdata.OpeningMessage
                  })
                  let { guild } = interaction.message;
                  let category = guild.channels.cache.get(data.TicketSystem1.category);
                  if(!category || category.type != "GUILD_CATEGORY") category = interaction.message.channel.parentId || null; 
                  let optionsData = {
                      type: "GUILD_TEXT",
                      topic: `${interaction.user.tag} | ${interaction.user.id}`,
                      permissionOverwrites: [],
                  }
                  if(client.settings.has(interaction.user.id)){
                      let TicketChannel = guild.channels.cache.get(client.settings.get(interaction.user.id, "channelId"))
                      if(!TicketChannel) {
                          client.settings.delete(interaction.user.id)
                      } else {
                          return interaction.editReply({
                              ephemeral: true,
                              content: `you already have a Ticket <#${TicketChannel.id}>`
                          })
                      }
                  }
                  optionsData.permissionOverwrites = [...guild.roles.cache.values()].sort((a, b) => b?.rawPosition - a.rawPosition).map(r => {
                      let Obj = {}
                      if(r.id){
                          Obj.id = r.id;
                          Obj.type = "role";
                          Obj.deny = ["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "ADD_REACTIONS", "ATTACH_FILES"]
                          Obj.allow = [];
                          return Obj;
                      } else {
                          return false;
                      }
                  }).filter(Boolean);
                  //Add USER ID Permissions to the TICKET
                  optionsData.permissionOverwrites.push({
                      id: "857855865532186625",
                      type: "role",
                      allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "ADD_REACTIONS", "ATTACH_FILES"],
                      deny: [],
                  })
    
                  optionsData.permissionOverwrites.push({
                    id: interaction.user.id,
                    type: "member",
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "ADD_REACTIONS", "ATTACH_FILES"],
                    deny: [],
                })
                  //if there are too many, remove the first ones..
                  while (optionsData.permissionOverwrites.length >= 99){
                  optionsData.permissionOverwrites.shift();
                  }
                  if(category) optionsData.parent = category;
                  guild.channels.create(`ticket-${interaction.user.username.split(" ").join("-")}`.substr(0, 32), optionsData).then(async channel => {
                      await channel.send({
                          content: `<@${interaction.user.id}>`,
                          embeds: ticketdata.embeds
                      }).catch(()=>{});
                      client.settings.set(interaction.user.id, {
                          userId: interaction.user.id,
                          channelId: channel.id,
                      })
                      await interaction.editReply({
                          ephemeral: true,
                          content: ticketdata.ClosedMessage.replace("{channelId}", channel.id)
                      }).catch(()=>{});
                      resolve(channel);
                  }).catch((e)=>{
                      reject(e)
                  });
              })
              
          }
    
      } 
    })
    

client.on('messageCreate' , message => {
    if(message.content.startsWith('-close')){
        const channel = message.channel
        if(channel.name.startsWith('ticket')){
            channel.delete();
        }else {
            if(channel.name != 'ticket'){
                message.reply(':x: This Channel is not a ticket')
            }
        }
    }
})



client.on('messageCreate' , message => {
    if(message.content.startsWith('-q')){
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("b1")
            .setLabel("Button 1") // text in button
            .setStyle("PRIMARY") // background color
            .setEmoji("✅") // Emoji with text in button
        )

        const m =  message.channel.send({ components: [row] })
        
         const ifilter = i => i.user.id === message.author.id;

        const collector = m.createMessageComponentCollector({ filter: ifilter, time: 60000 }) //createMessageComponentCollector

        collector.on("collect", async i => {
            if(i.customId === "b1") {
                await i.deferUpdate()
                i.editReply({ content: "Button command is work!", components: [] })
            }
        })
    }

    
})





client.on('messageCreate' , async message => {
    if(message.content.startsWith('-card')) {
    let embed = new MessageEmbed()
    .setColor('LUMINOUS_VIVID_PINK')
    .setTitle('لو تبي تزيد طاقات وتتحول لي بطاقه مختلفه لازم تتفاعل في السيرفر')
    .setImage('https://cdn.discordapp.com/attachments/1001480217359028295/1047060448660439071/leo_1.png')

         message.channel.send({embeds : [embed]})

     }   
})














client.on('messageCreate', async message => {
  

    if (message.content.startsWith('توظيف')){
        const user = message.mentions.members.first();
        if (!user) return message.reply({
            embeds : [
                new MessageEmbed()
                .setColor('GOLD')
                .setDescription('منشن العضو')
            ]
        })
        if (user.id === message.author.id) return message.reply({
            embeds : [
                new MessageEmbed()
                .setColor('GOLD')
                .setDescription('ماتقدر تعطي نفسك رتبه ')
            ]
        })
     //   if(!message.member.roles.cache.has('898245987385086063')) //ايدي رتبة الي تقدر تستعمل الامر

            
      
        let zs = new MessageEmbed()
        .setColor('GOLD')
        .setTitle(`توظيف`)
        .setDescription(`اختر جهة التوظيف`)
        .setFooter(`by ${message.author.tag}`)
        

        let row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('b9')
                .setPlaceholder('Menu open')
                .addOptions(
                    {
                        label: '𝗟.𝗦.𝗣.𝗗 ',
                        emoji : '<:emoji_1:1049465843928539226>',
                        value: 'a',
                    },
                    {
                        label: ' 𝗦.𝗪.𝗔.𝗧 - 𝗧𝗲𝗮𝗺',
                         emoji : '<:emoji_1:1049465843928539226>',
                        value: 'x',
                    },
                    {
                        label: '𝗪.𝗟 𝗼𝗙𝗙𝗶𝗰𝗲𝗿𝘀',
                        emoji: '<:emoji_1:1049465843928539226>',
                        value: 'b',   
                    },
                    {
                        label: '𝗧𝗵𝗲 𝗕𝗹𝗼𝗼𝗱𝘀',
                        emoji: '<:emoji_1:1049465843928539226>',
                        value: 'c',
                    },
                    {
                        label: '𝗦𝗼𝗼𝗻 -  قـريـبـاً ',
                        emoji: '<:emoji_1:1049465843928539226> ',
                        value: 'd',
                    },
                    {
                        label: '𝗦𝗼𝗼𝗻 -  قـريـبـاً ',
                        emoji: '<:emoji_1:1049465843928539226> ',
                        value: 'e',
                    }
                ),
        );

      let x =   message.channel.send({ embeds: [zs], components: [row] });

     
      const filter = async interaction => {

        if (interaction.user.id !== interaction.user.id) {
            interaction.reply({
                content: "<:AAcross_box:864690410232610836> Don't help other people to select the menu",
                ephemeral: true
            });
            return false;
        };
        return true;
    }

    const collector = message.channel.createMessageComponentCollector({
        filter,
        componentType: 'SELECT_MENU',
        time: 50000,
    })

    collector.on('collect', async (interaction) => {
        if (interaction.values  == 'x') {
            let role = interaction.guild.roles.cache.find(r => r.id === '1001480226775248996')
            let role1 = interaction.guild.roles.cache.find(r => r.id === '1049439617088225370')
            let role3 = interaction.guild.roles.cache.find(r => r.id === '1049447023226662912')
            let role4 = interaction.guild.roles.cache.find(r => r.id === '1049447126221991987')// ايدي الرتبة 
            if (!role) return;
            user.roles.add(role)
            user.roles.add(role1)
            user.roles.add(role3)
            user.roles.add(role4)
            interaction.update({
                embeds: [
                    zs.setDescription(`تمت إضافة رتب القوات الخاصه الي العضو`).setFooter(`by ${message.author.tag}`).setColor('GOLD')
                ]
            })
        }

        if (interaction.values  == 'a') {
            let role = interaction.guild.roles.cache.find(r => r.id === '1001480226775248996')
            let role1 = interaction.guild.roles.cache.find(r => r.id === '1049439617088225370')
            let role3 = interaction.guild.roles.cache.find(r => r.id === '1049447023226662912')
            let role4 = interaction.guild.roles.cache.find(r => r.id === '1049447126221991987')// ايدي الرتبة 
            if (!role) return;
            user.roles.add(role)
            user.roles.add(role1)
            user.roles.add(role3)
            user.roles.add(role4)
            interaction.update({
                embeds: [
                    zs.setDescription(`تمت إضافة رتب القوات الخاصه الي العضو`).setFooter(`by ${message.author.tag}`).setColor('GOLD')
                ]
            })
        }

        if (interaction.values  == 'b') {
            let role = interaction.guild.roles.cache.find(r => r.id === '1001480226775248996')
            let role1 = interaction.guild.roles.cache.find(r => r.id === '1049439617088225370')
            let role3 = interaction.guild.roles.cache.find(r => r.id === '1049447023226662912')
            let role4 = interaction.guild.roles.cache.find(r => r.id === '1049447126221991987')// ايدي الرتبة 
            if (!role) return;
            user.roles.add(role)
            user.roles.add(role1)
            user.roles.add(role3)
            user.roles.add(role4)
            interaction.update({
                embeds: [
                    zs.setDescription(`تمت إضافة رتب القوات الخاصه الي العضو`).setFooter(`by ${message.author.tag}`).setColor('GOLD')
                ]
            })
        }
        if (interaction.values  == 'c') {
            let role = interaction.guild.roles.cache.find(r => r.id === '1001480226775248996')
            let role1 = interaction.guild.roles.cache.find(r => r.id === '1049439617088225370')
            let role3 = interaction.guild.roles.cache.find(r => r.id === '1049447023226662912')
            let role4 = interaction.guild.roles.cache.find(r => r.id === '1049447126221991987')// ايدي الرتبة 
            if (!role) return;
            user.roles.add(role)
            user.roles.add(role1)
            user.roles.add(role3)
            user.roles.add(role4)
            interaction.update({
                embeds: [
                    zs.setDescription(`تمت إضافة رتب القوات الخاصه الي العضو`).setFooter(`by ${message.author.tag}`).setColor('GOLD')
                ]
            })
        }
        if (interaction.values  == 'd') {
            let role = interaction.guild.roles.cache.find(r => r.id === '1001480226775248996')
            let role1 = interaction.guild.roles.cache.find(r => r.id === '1049439617088225370')
            let role3 = interaction.guild.roles.cache.find(r => r.id === '1049447023226662912')
            let role4 = interaction.guild.roles.cache.find(r => r.id === '1049447126221991987')// ايدي الرتبة 
            if (!role) return;
            user.roles.add(role)
            user.roles.add(role1)
            user.roles.add(role3)
            user.roles.add(role4)
            interaction.update({
                embeds: [
                    zs.setDescription(`تمت إضافة رتب القوات الخاصه الي العضو`).setFooter(`by ${message.author.tag}`).setColor('GOLD')
                ]
            })
        }
        if (interaction.values  == 'e') {
            let role = interaction.guild.roles.cache.find(r => r.id === '1001480226775248996')
            let role1 = interaction.guild.roles.cache.find(r => r.id === '1049439617088225370')
            let role3 = interaction.guild.roles.cache.find(r => r.id === '1049447023226662912')
            let role4 = interaction.guild.roles.cache.find(r => r.id === '1049447126221991987')// ايدي الرتبة 
            if (!role) return;
            user.roles.add(role)
            user.roles.add(role1)
            user.roles.add(role3)
            user.roles.add(role4)
            interaction.update({
                embeds: [
                    zs.setDescription(`تمت إضافة رتب القوات الخاصه الي العضو`).setFooter(`by ${message.author.tag}`).setColor('GOLD')
                ]
            })
        }
    })
    }
})
 




client.on('messageCreate', async message => {
  

    if (message.content.startsWith('تقاعد')){
        const user = message.mentions.members.first();
        if (!user) return message.reply({
            embeds : [
                new MessageEmbed()
                .setColor('GOLD')
                .setDescription('منشن العضو')
            ]
        })
            
        if (user.id === message.author.id) return message.reply({
            embeds : [
                new MessageEmbed()
                .setColor('GOLD')
                .setDescription('ماتقدر تعطي نفسك رتبه ')
            ]
        })
     //   if(!message.member.roles.cache.has('898245987385086063')) //ايدي رتبة الي تقدر تستعمل الامر
       
      
        let zs = new MessageEmbed()
        .setColor('GOLD')
        .setTitle(`تقاعد`)
        .setDescription(`اختر جهة الاستقاله`)
        .setFooter(`by ${message.author.tag}`)
        

        let row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('b9')
                .setPlaceholder('Menu open')
                .addOptions(
                    {
                        label: '𝗟.𝗦.𝗣.𝗗 ',
                        emoji : '<:emoji_1:1049465843928539226>',
                        value: '1',
                    },
                    {
                        label: ' 𝗦.𝗪.𝗔.𝗧 - 𝗧𝗲𝗮𝗺',
                        emoji : '<:emoji_1:1049465843928539226>',
                        value: '2',
                    },
                    {
                        label: '𝗪.𝗟 𝗼𝗙𝗙𝗶𝗰𝗲𝗿𝘀',
                        emoji: '<:emoji_1:1049465843928539226>',
                        value: '3',   
                    },
                    {
                        label: '𝗧𝗵𝗲 𝗕𝗹𝗼𝗼𝗱𝘀',
                        emoji: '<:emoji_1:1049465843928539226>',
                        value: '4',
                    },
                    {
                        label: '𝗦𝗼𝗼𝗻 -  قـريـبـاً ',
                        emoji: '<:emoji_1:1049465843928539226> ',
                        value: '5',
                    },
                    {
                        label: '𝗦𝗼𝗼𝗻 -  قـريـبـاً ',
                        emoji: '<:emoji_1:1049465843928539226> ',
                        value: '6',
                    }
                ),
        );

      message.channel.send({ embeds: [zs], components: [row] , fetchReply: true  });

     
      const filter = async interaction => {

        if (interaction.user.id !== interaction.user.id) {
            interaction.reply({
                content: "<:AAcross_box:864690410232610836> Don't help other people to select the menu",
                ephemeral: true
            });
            return false;
        };
        return true;
    }

    const collector = message.channel.createMessageComponentCollector({
        filter,
        componentType: 'SELECT_MENU',
        time: 50000,
    })

    collector.on('collect', async (interaction) => {
        if (interaction.values  == '1') {
            let role = interaction.guild.roles.cache.find(r => r.id === '')
            let role1 = interaction.guild.roles.cache.find(r => r.id === '')
            let role3 = interaction.guild.roles.cache.find(r => r.id === '')
            let role4 = interaction.guild.roles.cache.find(r => r.id === '')// ايدي الرتبة 
            if (!role) return;
            user.roles.remove(role)
            user.roles.remove(role1)
            user.roles.remove(role3)
            user.roles.remove(role4)
            interaction.update({
                embeds: [
                    zs.setDescription('تم إزالة رتب القوات الخاصه').setFooter(`by ${message.author.tag}`).setColor('GOLD')
                ]
            })
        }

        if (interaction.values  == '2') {
            let role = interaction.guild.roles.cache.find(r => r.id === '')
            let role1 = interaction.guild.roles.cache.find(r => r.id === '')
            let role3 = interaction.guild.roles.cache.find(r => r.id === '')
            let role4 = interaction.guild.roles.cache.find(r => r.id === '')// ايدي الرتبة 
            if (!role) return;
            user.roles.remove(role)
            user.roles.remove(role1)
            user.roles.remove(role3)
            user.roles.remove(role4)
            interaction.update({
                embeds: [
                    zs.setDescription('تم إزالة رتب القوات الخاصه').setFooter(`by ${message.author.tag}`).setColor('GOLD')
                ]
            })
        }

        if (interaction.values  == '3') {
            let role = interaction.guild.roles.cache.find(r => r.id === '')
            let role1 = interaction.guild.roles.cache.find(r => r.id === '')
            let role3 = interaction.guild.roles.cache.find(r => r.id === '1049447023226662912')
            let role4 = interaction.guild.roles.cache.find(r => r.id === '1049447126221991987')// ايدي الرتبة 
            if (!role) return;
            user.roles.remove(role)
            user.roles.remove(role1)
            user.roles.remove(role3)
            user.roles.remove(role4)
            interaction.update({
                embeds: [
                    zs.setDescription('تم إزالة رتب القوات الخاصه').setFooter(`by ${message.author.tag}`).setColor('GOLD')
                ]
            })
        }
        if (interaction.values  == '4') {
            let role = interaction.guild.roles.cache.find(r => r.id === '1001480226775248996')
            let role1 = interaction.guild.roles.cache.find(r => r.id === '1049439617088225370')
            let role3 = interaction.guild.roles.cache.find(r => r.id === '1049447023226662912')
            let role4 = interaction.guild.roles.cache.find(r => r.id === '1049447126221991987')// ايدي الرتبة 
            if (!role) return;
            user.roles.remove(role)
            user.roles.remove(role1)
            user.roles.remove(role3)
            user.roles.remove(role4)
            interaction.update({
                embeds: [
                    zs.setDescription('تم إزالة رتب القوات الخاصه').setFooter(`by ${message.author.tag}`).setColor('GOLD')
                ]
            })
        }
        if (interaction.values  == '5') {
            let role = interaction.guild.roles.cache.find(r => r.id === '1001480226775248996')
            let role1 = interaction.guild.roles.cache.find(r => r.id === '1049439617088225370')
            let role3 = interaction.guild.roles.cache.find(r => r.id === '1049447023226662912')
            let role4 = interaction.guild.roles.cache.find(r => r.id === '1049447126221991987')// ايدي الرتبة 
            if (!role) return;
            user.roles.remove(role)
            user.roles.remove(role1)
            user.roles.remove(role3)
            user.roles.remove(role4)
            interaction.update({
                embeds: [
                    zs.setDescription('تم إزالة رتب القوات الخاصه').setFooter(`by ${message.author.tag}`).setColor('GOLD')
                ]
            })
        }
        if (interaction.values  == '6') {
            let role = interaction.guild.roles.cache.find(r => r.id === '1001480226775248996')
            let role1 = interaction.guild.roles.cache.find(r => r.id === '1049439617088225370')
            let role3 = interaction.guild.roles.cache.find(r => r.id === '1049447023226662912')
            let role4 = interaction.guild.roles.cache.find(r => r.id === '1049447126221991987')// ايدي الرتبة 
            if (!role) return;
            user.roles.remove(role)
            user.roles.remove(role1)
            user.roles.remove(role3)
            user.roles.remove(role4)
            interaction.update({
                embeds: [
                    zs.setDescription('تم إزالة رتب القوات الخاصه').setFooter(`by ${message.author.tag}`).setColor('GOLD')
                ]
            })
        }
    })
    }
})
 
                                      