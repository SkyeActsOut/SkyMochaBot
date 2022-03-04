const Discord = require("discord.js");

var client = new Discord.Client();

const config = require ('./config.json');
const settings = require ('./settings.json');

const JSONdb = require('simple-json-db');
const db = new JSONdb('skydb.json');
const fs = require('fs');

const lb = require('./leaderboard')
const LeaderBoard = new lb();

var smGuild;
var smGeneral;
var smRoles;
var smIntroductions;
var smLogs;

const schedule = require('node-schedule');

client.on ('ready', () => { 
    smGuild = client.guilds.cache.get ('374361004894846987');
    smGeneral = client.channels.cache.get ('391413861904809995');
    smRoles = client.channels.cache.get ('726473676903415828')
    smIntroductions = client.channels.cache.get ('726489767264518146')
    smLogs = client.channels.cache.get ("913581241800982578")

    client.user.setActivity("SkyMocha", { type: "WATCHING" })
    console.log (`BOT IS ON UNDER ${client.user.tag}`);
    
})

const expire = settings.leveling.expire;
const points = settings.leveling.points;
const cooldown = settings.leveling.cooldown;
let cd = new Set();

// Checks roles at midnight to see who needs to be p u r g e d
const job = schedule.scheduleJob('0 22 * * *', function(){

    console.log ('MIDNIGHT')

    let role_remove = ''
    let role_add = ''

    Object.entries(db.JSON()).forEach(e => {

        msgs = JSON.parse(e[1]).msgs;

        for (let i = 0; i < msgs.length; i++) { // subtracts one from all 
            msgs[i] = msgs[i] - 1;
        }
        msgs = msgs.filter(x => x >= 0) // removes all 0's/negatives

        let mem = smGuild.member(e[0])
        if (mem != null && msgs.length > points && !mem.roles.cache.has("456557964241666077")) { // if length of msgs array less than points remove
            mem.roles.add("456557964241666077") // Adds
            role_add += `${mem.user.username}, `
        }

        if (mem != null && msgs.length < points && mem.roles.cache.has("456557964241666077")) { // if length of msgs array less than points remove
            mem.roles.remove("456557964241666077") // removes regular role
            role_remove += `${mem.user.username}, `
        }

        db.set(e[0], JSON.stringify({
            msgs: msgs
        }))

    })

    let final = ''
    if (role_remove.length > 1 && role_add > 1)
        final = `${role_remove} are no longer regulars! :( \n\n ${role_add} are now regulars! :)`
    else if (role_remove.length > 1)
        final = `${role_remove} are no longer regulars! :(`
    else if (role_add.length > 1)
        final = `${role_add} are now regulars! :)`
    
    if (final.length > 1)
        smLogs.send (final);

});

client.on ('message', async (message) => {

    if (message.author.bot)
        return

    let msg = message.content.toLowerCase();

    if (message.author.id == "340148471338106880" && msg.startsWith("!invoke")) { // invokes midnight command
        let args = msg.split(' ')[1]
        if (args != undefined) {
            for (let i = 0; i < parseInt(args); i++)
                job.invoke();
        }
        else {
            args = '1';
            job.invoke();
        }
        message.channel.send(`Invoking Midnight CronJob ${args} Times`);
    }
    if (message.author.id == "340148471338106880" && msg == "!raw") { // prints out the raw JSON file
        let s = 'First 1,000 chars of skydb.JSON\n'
        Object.entries(db.JSON()).forEach(e => {
            s += `${e[0]}: ${e[1]}\n`
        })
        if (s.length > 1000)
            s = s.slice(0, 1000)
        message.channel.send (s)
    }

    let leader_spelling = ['!leader', '!leaderboard', '!lb', '!lead']
    if (leader_spelling.includes (msg)) {
        message.channel.send ( LeaderBoard.leader( db.JSON(), smGuild ) )
    }

    // Sends a mee6 like card for server stats
    let card_spelling = ['!card', '!crd', '!rank']
    if (card_spelling.includes (msg)) {
        let name = ''
        if (message.member.nickname != null)
            name = message.member.nickname
        else
            name = message.member.user.username

        let card = await LeaderBoard.card (
            name, 
            message.member.joinedAt.toString().split (' ').slice(1, 4).join (' '),
            JSON.parse(db.get(message.author.id)).msgs.length,
            message.author.displayAvatarURL().replace('webp', 'jpg'),
        )
        message.channel.send ( new Discord.MessageAttachment ( await card ) )
    }

    // Simple cooldown system
    if (cd.has(message.author.id))
        return setTimeout(() => {
            cd.delete(message.author.id)
        }, cooldown*1000);
    else
        cd.add(message.author.id)

    
    if (db.has (message.author.id)) { // if user in DB add user
        let prev = JSON.parse(db.get(message.author.id)) // gets the current db user
        
        prev.msgs.push(expire) // pushes the expirey date

        prev.msgs = prev.msgs.filter(x => x != 0) // removes all 0's

        if (prev.msgs.length > points & !message.member.roles.cache.has('456557964241666077')) { // if above points needed
            message.member.roles.add("456557964241666077") // adds regular role
            smLogs.send(`${message.author} is now a regular! 😄`) // sends message
        }

        db.set(message.author.id, JSON.stringify(prev)) // updates DB in a string format
    }
    else { // if user not in DB add user
        db.set (message.author.id, JSON.stringify({
            msgs: [expire]
        }))
    }

})

client.on ('guildMemberUpdate', (oldUser, newUser) => {

    // If the new user has the member role added to them
    if (smGuild.member (newUser).roles.cache.has('398856287498272771') && !smGuild.member (oldUser).roles.cache.has('398856287498272771'))
        smGeneral.send(`Welcome, officially, to SkyMocha Café, ${newUser}.\nIf you haven't already, grab your ${smRoles} and make a ${smIntroductions}!`)

})

client.login(config.TOKEN);