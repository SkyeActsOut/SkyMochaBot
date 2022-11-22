// Expirimental or in-progress features

const Discord = require("discord.js");

const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.USER, Discord.Intents.FLAGS.GUILD_MEMBER],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
});

const config = require ('../config.json');
const settings = require ('../settings.json');

const JSONdb = require('simple-json-db');
const db = new JSONdb('skydb.json');
const fs = require('fs');

const lb = require('./leaderboard')
const LeaderBoard = new lb();

const schedule = require('node-schedule');

var swears = {};
const swear_list = require('../filter.json');

// const TwitterAPI = require('./twitter')
// var twitter = []

const _Channels = require('../channels');
const Channels = new _Channels(client);
let emojis = {}, roles = {};

function addRole (role) {
    return Channels.getGuild("SkyMocha").roles.cache.find ( r => r.name.toLowerCase() == role.toLowerCase());
}
function getRole (role) {
    return roles[role.toLowerCase()];
}
function addRoleToUser (u, r) {
    return Channels.getGuild("SkyMocha").members.fetch(u.id).then (user => {
        user.roles.add (r)
    })
}
function removeRoleFromUser (u, r) {
    Channels.getGuild("SkyMocha").members.fetch(u.id).then (user => {
        user.roles.remove (r);
    })
}

client.on ('ready', async () => {
    // ADD GUILDS
    await Channels.addGuild("SkyMocha", "970308742514090034");

    // ADD CHANNELS
    await Channels.addChannel ("Bot Logs", "971019786349846568");
    await Channels.addChannel ("Roles", "970308742983876620")
    await Channels.addChannel ("Logs", "970309357029978112")
    
    // ADD USERS
    await Channels.addUser ("SkyMocha", "340148471338106880");

    emojis = {
        "He": "🤷‍♂️",
        "She": "🤷‍♀️",
        "They": "🤷",

        "Minor": "0️⃣",
        "Adult": "1️⃣",

        "OpenDM": "📬",
        "AskDM": "📭",
        "CloseDM": "📪",

        "Question": "❓"
    }

    Channels.getGuild("SkyMocha").roles.cache.array().forEach (r => {
        roles[r.name.toLowerCase()] = addRole(r.name.toLowerCase());
    })

    // twitter = new TwitterAPI(client, Discord.MessageEmbed);

    // twitter.send ();

    // setInterval(() => {
        
    //     try {
    //         twitter.send();
    //     }
    //     catch {
    //         Channels.err ("Twitter")
    //     }

    // }, 1000 * 60 * 15);

    client.user.setActivity("SkyMocha", { type: "WATCHING" })
    let msg = `BOT IS ON UNDER ${client.user.tag} @ ${Channels.date()}`

    console.log (msg);
    
})

// const expire = settings.leveling.expire;
// const points = settings.leveling.points;
// const cooldown = settings.leveling.cooldown;
// let cd = new Set();

// Checks roles at midnight to see who needs to be p u r g e d
// const job = schedule.scheduleJob('0 22 * * *', function(){

//     console.log ('MIDNIGHT')

//     let role_remove = ''
//     let role_add = ''

//     Object.entries(db.JSON()).forEach(e => {

//         msgs = JSON.parse(e[1]).msgs;

//         for (let i = 0; i < msgs.length; i++) { // subtracts one from all 
//             msgs[i] = msgs[i] - 1;
//         }
//         msgs = msgs.filter(x => x >= 0) // removes all 0's/negatives

//         let mem = smGuild.member(e[0])
//         if (mem != null && msgs.length > points && !mem.roles.cache.has("456557964241666077")) { // if length of msgs array less than points remove
//             mem.roles.add("456557964241666077") // Adds
//             role_add += `${mem.user.username}, `
//         }

//         if (mem != null && msgs.length < points && mem.roles.cache.has("456557964241666077")) { // if length of msgs array less than points remove
//             mem.roles.remove("456557964241666077") // removes regular role
//             role_remove += `${mem.user.username}, `
//         }

//         db.set(e[0], JSON.stringify({
//             msgs: msgs
//         }))

//     })

//     let final = ''
//     if (role_remove.length > 1 && role_add > 1)
//         final = `${role_remove} are no longer regulars! :( \n\n ${role_add} are now regulars! :)`
//     else if (role_remove.length > 1)
//         final = `${role_remove} are no longer regulars! :(`
//     else if (role_add.length > 1)
//         final = `${role_add} are now regulars! :)`
    
//     if (final.length > 1)
//         smLogs.send (final);

// });

function includes_swear () {
    
}

client.on ('message', async (message) => {

    if (message.author.bot)
        return

    let msg = message.content.toLowerCase();
    let msg_spit = msg.split('\n').join(' ').split(' '); // miss-spelled split oop
    var swear_flag = false;

    // Goes through all words and checks for swears
    // Each swear found is tallied up based on individual users
    msg_spit.forEach (w => {
        if (swear_list.words.includes(w)) {

            try {
                message.delete()
            } catch {
                console.error ('Already deleted')
            }

            if (swears[message.author.id] != undefined) {
                swears[message.author.id] += 1;
            }
            else {
                swears[message.author.id] = 1
            }
            // If there are more than 3 swears to a user, ban them and log in #Logs
            if (swears[message.author.id] > 3) {
                swears[message.author.id] = null;
                let ban_msg = `${message.author.username} BANNED FOR SLURS`
                Channels.getChannel('Logs').send(
                    ban_msg
                ).then (() => {
                    message.author.send (`
                        YOU HAVE BEEN BANNED FOR SLURS. 
                        IF YOU THINK THIS WAS A MISTAKE PLEASE PLEASE FILL OUT THIS FORM:
                        testurl`)
                }).then (() => {
                    if (message.author.id != Channels.getUserID('SkyMocha'))
                        message.member.ban( { 'reason': ban_msg } )
                    else
                        message.channel.send ('NOT BANNING SKYMOCHA (duh)');
                })
            }
            else {
                swear_flag = true;
                // message.channel.send (`Please do not use slurs or derogatory language. You are at strike ${swears[message.author.id]}/3.`);
            }
        }
    })
    // If the swear flag is true it warns the user
    if (swear_flag && swears[message.author.id]){ 
        message.channel.send (`Please do not use slurs or derogatory language. You are at strike ${swears[message.author.id]}/3.`);
    }

    // Bans a user
    if (msg.startsWith('!ban') && message.member.permissions.has('BAN_MEMBERS')) {
        let u = message.mentions.users.first();
        if (u == undefined)
            return message.channel.send (`NO BAN SPECIFIED`)
        let reason = msg_spit.slice(2) // #0 is command #1 is user
        let ban_msg = `USER **${u.username}** BANNED BY **${message.author.username}** FOR *${reason.join(' ')}*`
        if (reason == undefined || reason == '')
            ban_msg = `USER **${u.username}** BANNED BY **${message.author.username}**`
        Channels.getChannel('Logs').send (ban_msg).then (() => {
            u.send (ban_msg += `\n\nAPPEALS FORMS CAN BE FOUND HERE: asdfghjkk`);
        }).then (() => {
            if (message.author.id != Channels.getUserID('SkyMocha'))
                message.member.ban( { 'reason': ban_msg } )
            else
                message.channel.send ('NOT BANNING SKYMOCHA (duh)');
        })
    }

    // Invokes chron-job immedietly
    // if (message.author.id == Channels.getUserID("SkyMocha") && msg.startsWith("!invoke")) { // invokes midnight command
    //     let args = msg.split(' ')[1]
    //     if (args != undefined) {
    //         for (let i = 0; i < parseInt(args); i++)
    //             job.invoke();
    //     }
    //     else {
    //         args = '1';
    //         job.invoke();
    //     }
    //     message.channel.send(`Invoking Midnight CronJob ${args} Times`);
    // }
    // if (message.author.id == Channels.getUserID("SkyMocha") && msg == "!raw") { // prints out the raw JSON file
    //     let s = 'First 1,000 chars of skydb.JSON\n'
    //     Object.entries(db.JSON()).forEach(e => {
    //         s += `${e[0]}: ${e[1]}\n`
    //     })
    //     if (s.length > 1000)
    //         s = s.slice(0, 1000)
    //     message.channel.send (s)
    // }

    // let leader_spelling = ['!leader', '!leaderboard', '!lb', '!lead']
    // if (leader_spelling.includes (msg)) {
    //     message.channel.send ( LeaderBoard.leader( db.JSON(), smGuild ) )
    // }

    // Sends a mee6 like card for server stats
    // let card_spelling = ['!card', '!crd', '!rank']
    // if (card_spelling.startsWith('!card')) {
    //     let name = ''
    //     if (message.member.nickname != null)
    //         name = message.member.nickname
    //     else
    //         name = message.member.user.username

    //     let card = await LeaderBoard.card (
    //         name, 
    //         message.member.joinedAt.toString().split (' ').slice(1, 4).join (' '),
    //         JSON.parse(db.get(message.author.id)).msgs.length,
    //         message.author.displayAvatarURL().replace('webp', 'jpg'),
    //     )
    //     message.channel.send ( new Discord.MessageAttachment ( await card ) )
    // }

    // Simple cooldown system for points
    // if (cd.has(message.author.id))
    //     return setTimeout(() => {
    //         cd.delete(message.author.id)
    //     }, cooldown*1000);
    // else
    //     cd.add(message.author.id)

    // Points system
    // if (db.has (message.author.id)) { // if user in DB add user
    //     let prev = JSON.parse(db.get(message.author.id)) // gets the current db user
        
    //     prev.msgs.push(expire) // pushes the expirey date

    //     prev.msgs = prev.msgs.filter(x => x != 0) // removes all 0's

    //     if (prev.msgs.length > points & !message.member.roles.cache.has('974726101672808459')) { // if above points needed
    //         message.member.roles.add("974726101672808459") // adds regular role
    //         smLogs.send(`${message.author} is now a regular! 😄`) // sends message
    //     }

    //     db.set(message.author.id, JSON.stringify(prev)) // updates DB in a string format
    // }
    // else { // if user not in DB add user
    //     db.set (message.author.id, JSON.stringify({
    //         msgs: [expire]
    //     }))
    // }

})

// REACTION ROLES //
client.on ('messageReactionAdd', async (reaction, user) => {

    // FETCHES REACTION
    if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}
	}

    if (reaction.message.channel == Channels.getChannelID("Roles")) {
        
        switch (reaction.emoji.name) {
            case emojis['He']:
                addRoleToUser(user, getRole("he/him"))
            case emojis['She']:
                addRoleToUser(user, getRole("she/her"))
            case emojis['They']:
                addRoleToUser(user, getRole("they/them"))

            case emojis['OpenDM']:
                addRoleToUser(user, getRole("open dms"))
            case emojis['AskDM']:
                addRoleToUser(user, getRole("ask dms"))
            case emojis['ClosedDM']:
                addRoleToUser(user, getRole("closed dms"))

            case emojis['Minor']:
                addRoleToUser(user, getRole("17-"))
            case emojis['Adult']:
                addRoleToUser(user, getRole("18+"))

            case emojis['Question']:
                addRoleToUser(user, getRole("qotd"))

        }

    }

})

client.on ('messageReactionRemove', async (reaction, user) => {

    if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}
	}

    if (reaction.message.channel == Channels.getChannelID("Roles")) {
        
        switch (reaction.emoji.name) {
            case emojis['He']:
                removeRoleFromUser(user, getRole("he/him"))
            case emojis['She']:
                removeRoleFromUser(user, getRole("she/her"))
            case emojis['They']:
                removeRoleFromUser(user, getRole("they/them"))

            case emojis['OpenDM']:
                removeRoleFromUser(user, getRole("open dms"))
            case emojis['AskDM']:
                removeRoleFromUser(user, getRole("ask dms"))
            case emojis['ClosedDM']:
                removeRoleFromUser(user, getRole("closed dms"))

            case emojis['Minor']:
                removeRoleFromUser(user, getRole("17-"))
            case emojis['Adult']:
                removeRoleFromUser(user, getRole("18+"))

            case emojis['Question']:
                removeRoleFromUser(user, getRole("qotd"))
        }

    }

})

client.login(config.TOKEN);