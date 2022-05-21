/**
 * 
 * @name SkyMochaBot_Core
 * @description The core functionality of SkyMocha Bot that it can do better or the same as other bots
 *              @ 1984 handles slur censoring
 *              @ mee6 handles leveling
 *              Testing is in ./index.js
 *              Uses ./channels.js
 * @author SkyMocha
 * 
 */

const Discord = require("discord.js");

const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.USER, Discord.Intents.FLAGS.GUILD_MEMBER],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
});

const config = require ('./config.json');
const settings = require ('./settings.json');

// const TwitterAPI = require('./twitter')
// var twitter = []

const _Channels = require('./channels');
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

client.on ('message', async (message) => {

    if (message.author.bot)
        return

    let msg = message.content.toLowerCase();
    let msg_spit = msg.split('\n').join(' ').split(' '); // miss-spelled split oop

    // Bans a user
    if (msg.startsWith('!ban') && message.member.permissions.has('BAN_MEMBERS')) {
        let u = message.mentions.users.first();
        if (u == undefined)
            return message.channel.send (`NO BAN SPECIFIED`)
        let reason = msg_spit.slice(2) // #0 is command #1 is user
        let ban_msg = `USER **${u.username}** BANNED BY **${message.author.username}** FOR *${reason.join(' ')}*`
        if (reason == undefined || reason == '')
            ban_msg = `USER **${u.username}** BANNED BY **${message.author.username}**`;
        Channels.getChannel('Logs').send (ban_msg).then (() => {
            if (message.author.id != Channels.getUserID('SkyMocha'))
                message.member.ban( { 'reason': ban_msg } )
            else
                message.channel.send ('NOT BANNING SKYMOCHA (duh)');
        })
    }

    // KICKS user
    if (msg.startsWith('!kick') && message.member.permissions.has('BAN_MEMBERS')) {
        let u = message.mentions.users.first();
        if (u == undefined)
            return message.channel.send (`NO KICK SPECIFIED`)
        let reason = msg_spit.slice(2) // #0 is command #1 is user
        let ban_msg = `USER **${u.username}** KICKED BY **${message.author.username}** FOR *${reason.join(' ')}*`
        if (reason == undefined || reason == '')
            ban_msg = `USER **${u.username}** KICKED BY **${message.author.username}**`;
        Channels.getChannel('Logs').send (ban_msg).then (() => {
            if (message.author.id != Channels.getUserID('SkyMocha'))
                message.member.kick( { 'reason': ban_msg } )
            else
                message.channel.send ('NOT KICKING SKYMOCHA (duh)');
        })
    }

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