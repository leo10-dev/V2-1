//const client = require("../index")
const express = require("express");
const mongoose = require("mongoose")
const url = require("url");
const Settings = require("./settings.json");
const path = require("path");
const {Permissions} = require("discord.js");
const ejs = require("ejs");
const passort = require("passport");
const bodyParser = require("body-parser");
const Strategy = require("passport-discord").Strategy;
const BotConfig = require("../config.json");
const passport = require("passport");

module.exports  = client => {
    const logModel = require("../models/logModel");
    const app = express();
    const session = require("express-session");
    const MemoryStore = require("memorystore")(session);
    
    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((obj, done) => done(null, obj))
    passport.use(new Strategy({
        clientID: Settings.config.clientID,
        clientSecret: Settings.config.secret,
        callbackURL: Settings.config.callback,
        scope: ["identify", "guilds", "guilds.join" , "guilds.members.read"] 
    },
    (accessToken, refreshToken, profile, done) => {
        process.nextTick(()=>done(null, profile))
    }
    ))
    app.use(session({
        store: new MemoryStore({checkPeriod: 86400000 }),
        secret: `sthj9Nav0hm9LAS7hnsAh9cndmFHKWfLSH6TzTyb8ed42ZQEjafpcgqmNXLHfmZ`,
        resave: false,
        saveUninitialized: false
    }))



    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.static(path.join(__dirname, "./public")));


    
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "./views"));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.static(path.join(__dirname, "./public")));





    const checkAuth = (req, res, next) => {
        if(req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    }

    app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), async (req, res) => {
        let banned = false //client.settings.get("bannedusers")
        if(banned) {
            req.session.destroy()
            res.json({login: false, message: "You are banned from the dashboard", logout: true})
            req.logout();
        } else {
            res.redirect("/Dashboard")
        }
    });


    app.get("/home" , (req , res , next) => {

        res.render("index", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            Permissions: Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
        })
    })
    app.get("/login", (req, res, next) => {
        if(req.session.backURL){
            req.session.backURL = req.session.backURL
        } else if(req.headers.referer){
            const parsed = url.parse(req.headers.referer);
            if(parsed.hostname == app.locals.domain){
                req.session.backURL = parsed.path
            }
        } else {
            req.session.backURL = "/Dashboard"
        }
        next();
        }, passport.authenticate("discord", { prompt: "none"})
    );

    

    app.get("/logout", function(req, res) {
        req.session.destroy(()=>{
            req.logout();
            res.redirect("/home");
        })
    })

    app.get("/Dashboard", (req, res) => {
        if(!req.isAuthenticated() || !req.user)
        return res.redirect("/login")
        if(!req.user.guilds)
        return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot%20applications.commands&guild_id=${guild.id}&response_type=code&redirect_uri=${encodeURIComponent(`${callback}`)}`)
        res.render("dashbord", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            Permissions: Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
            guilds : req.user.guilds.filter(u => (u.permissions & 2146958591) === 2146958591)
        })
    })
   
    app.get("/Dashboard/:guildID", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID)
        if(!guild)
        return res.redirect("/?error=" + encodeURIComponent("I am not in this Guild yet, please add me before!"))
        let member = guild.members.cache.get(req.user.id);
        if(!member) {
            try{
                member = await guild.members.fetch(req.user.id);
            } catch{

            }
        }
        if(!member)
        return res.redirect("/?error=" + encodeURIComponent("Login first please! / Join the Guild again!"))
        if(!member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
        return res.redirect("/?error=" + encodeURIComponent("You are not allowed to do that"))
        client.settings.ensure(guild.id, {
            prefix: BotConfig.prefix,
            hellomsg: "Hello World!",
            roles: [],
        });
        res.render("settings", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            guild: guild,
            bot: client,
            Permissions: Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
           
        })
    })

    app.post("/Dashboard/:guildID", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID)
        if(!guild)
        return res.redirect("/?error=" + encodeURIComponent("I am not in this Guild yet, please add me before!"))
        let member = guild.members.cache.get(req.user.id);
        let data = req.body
        client.channels.cache.get(`${data.tt}`).send({content : `${data.say}`})
        if(!member) {
            try{
                member = await guild.members.fetch(req.user.id);
            } catch{

            }
        }
        if(!member)
        return res.redirect("/?error=" + encodeURIComponent("Login first please! / Join the Guild again!"))
        if(!member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
        return res.redirect("/?error=" + encodeURIComponent("You are not allowed to do that"))

        client.settings.ensure(guild.id, {
            prefix: BotConfig.prefix,
            hellomsg: "Hello World!",
            roles: [],
        });
        if(req.body.prefix) client.settings.set(guild.id, req.body.prefix, "prefix");
        if(req.body.hellomsg) client.settings.set(guild.id, req.body.hellomsg, "hellomsg");
        if(req.body.roles) client.settings.set(guild.id, req.body.roles, "roles");
        res.render("settings", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            guild: guild,
            bot: client,
            Permissions: Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
           
        })
    })

    app.get("/Dashboard/:guildID/logs", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID)
        if(!guild)
        return res.redirect("/?error=" + encodeURIComponent("I am not in this Guild yet, please add me before!"))
        let data = req.body
        let c = data.tt
        logModel.findOne({ Guild: guild.id }, async(err, data) => {

            if(data) {
              data.Channel = c;
              data.save()
            } else {
              new logModel({
                Guild: guild.id,
                Channel: c,
              }).save()
            }
        })
                res.render("say", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            guild: guild,
            bot: client,
            Permissions: Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
           
        })

    })
    app.post("/Dashboard/:guildID/logs", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID)
        if(!guild)
        return res.redirect("/?error=" + encodeURIComponent("I am not in this Guild yet, please add me before!"))
        let data = req.body
        let c = data.tt
        logModel.findOne({ Guild: guild.id}, async(err, data) => {

            if(data) {
              data.Channel = c;
              data.save()
            } else {
              new logModel({
                Guild: guild.id,
                Channel: c,
              }).save()
            }
        })
        res.render("say", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            guild: guild,
            bot: client,
            Permissions: Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
           
        })


    })
    
   
    
   

    
    const http = require("http").createServer(app);
    http.listen(5000 , () => {
        console.log(`- now online on port 5000`);
    })
    
  
    
}

   /*
   logModel.findOne({ Guild: interaction.guild.id }, async(err, data) => {

            if(data) {
              data.Channel = channel.id;
              data.save()
            } else {
              new logModel({
                Guild: interaction.guild.id,
                Channel: channel.id,
              }).save()
            }
        }

   */