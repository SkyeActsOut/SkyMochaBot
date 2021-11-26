const Discord = require("discord.js");

var client = new Discord.Client();

var config = require ('./config.json');

const JSONdb = require('simple-json-db');
const db = new JSONdb('skydb.json');
const fs = require('fs');

var smGuild;
var smGeneral;
var smRoles;
var smIntroductions;
var smLogs;

var tcGuild;
var patreonTc;
var tcRoles;
var tcIntroductions;

const schedule = require('node-schedule');

// Loops through all skymocha users, checks if theyre in tailchan, then if they have patreon on SM add it on TC
// function checkUsers () {
//     smGuild.members.cache.forEach(u => {
//         if (u.roles.cache.has ("902615822231568424")) { // has patreon rolle on SM Guild
//             let tcMember = tcGuild.members.cache.get(u.id);
//             if (tcMember.id != undefined && !tcMember.roles.cache.has(patreonTc.id)) {  // checks if user is in TC then checks no role
//                 tcMember.roles.add(patreonTc.id).then (m => {
//                     tcGeneral.send (`${m} has had patreon role added through routine update`);
//                 }) 
//             }
//         }
//     })
// }

client.on ('ready', () => { 
    smGuild = client.guilds.cache.get ('374361004894846987');
    smGeneral = client.channels.cache.get ('391413861904809995');
    smRoles = client.channels.cache.get ('726473676903415828')
    smIntroductions = client.channels.cache.get ('726489767264518146')
    smLogs = client.channels.cache.get ("913581241800982578")

    // tcGuild = client.guilds.cache.get ("902209844872876034")

    // tcGeneral = client.channels.cache.get ("902211877478735872")
    // tcRoles = client.channels.cache.get ("902602399565373441")
    // tcIntroductions = client.channels.cache.get ("902631596362960906")
    
    // patreonTc = tcGuild.roles.cache.get("902604140088291349") // patreon role on the tailchan discord

    client.user.setActivity("SkyMocha", { type: "WATCHING" })
    console.log (`BOT IS ON UNDER ${client.user.tag}`);
    
    // checkUsers ();

    // setInterval(() => {
    //     checkUsers()
    // }, 1000*60*30); // runs it every 1/2 hour (1000 ms * 60 s * 30 min)

})

const expire = 27
const points = 250
const cooldown = 5
let cd = new Set();

// Checks roles at midnight to see who needs to be p u r g e d
const job = schedule.scheduleJob('0 22 * * *', function(){

    Object.entries(db.JSON()).forEach(e => {

        msgs = JSON.parse(e[1]).msgs

        for (let i = 0; i < msgs.length; i++) // subtracts one from all
            msgs[i]--;
        msgs.filter(x => x != 0) // removes all 0's

        console.log (msgs)

        let mem = smGuild.member(e[0])
        if (msgs.length < points & mem.roles.cache.has("456557964241666077")) { // if length of msgs array less than points remove
            mem.roles.remove("456557964241666077") // removes regular role
            smLogs.send(`${mem} is no longer a regular! 😦`) // sends message
        }

        db.set(e[0], JSON.stringify({
            msgs: msgs
        }))

    })

    fs.copyFileSync("skydb.json", `backups/skydb_${Date.now()}.json`)

});

client.on ('message', (message) => {

    if (message.author.bot)
        return

    if (message.author.id == "340148471338106880" && message.content.toLowerCase() == "!invoke") { // invokes midnight command
        job.invoke();
        message.channel.send("Invoking midnight chronjob NOW");
    }
    if (message.author.id == "340148471338106880" && message.content.toLowerCase() == "!raw") { // prints out the raw JSON file
        let s = 'First 1,000 chars of skydb.JSON\n'
        Object.entries(db.JSON()).forEach(e => {
            s += `${e[0]}: ${e[1]}\n`
        })
        if (s.length > 1000)
            s = s.slice(0, 1000)
        message.channel.send (s)
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

// client.on ('guildMemberAdd', (member) => {

    // if (member.guild.id == tcGuild.id) {
    //     tcGeneral.send (`**Welcome** to the Tailchan 18+ Discord server, ${member}!\nIf you haven't already, grab your ${tcRoles} and make a ${tcIntroductions}!`)
    // }

    // if (db.has (member.id))
    //     return
    // db.set(member.id, 
    //     JSON.stringify({
    //         "msgs": []
    //     })
    // )

// });

client.on ('guildMemberUpdate', (oldUser, newUser) => {
    // If the new user has the member role added to them
    if (smGuild.member (newUser).roles.cache.has('398856287498272771') && !smGuild.member (oldUser).roles.cache.has('398856287498272771'))
        smGeneral.send(`Welcome, officially, to SkyMocha Café, ${newUser}.\nIf you haven't already, grab your ${smRoles} and make a ${smIntroductions}!`)

    // // If the new user has the patreon role added to them
    // if (smGuild.member (newUser).roles.cache.has('902615822231568424') && !smGuild.member (oldUser).roles.cache.has('902615822231568424')) {
    //     // smGeneral.send(`${newUser} is now a patreon!`)
    //     if (tcGuild.members.cache.get(newUser.id).id != undefined) { // if the member is in tailchan 
    //         let tcMember = tcGuild.members.cache.get(newUser.id)
    //         if (!tcMember.roles.cache.has (patreonTc.id)) // if member doesnt have role
    //             tcMember.roles.add(patreonTc.id).then (m => { // adds the role then sends msg
    //                 tcGeneral.send (`${m} is now a patreon!`)
    //             })
    //     }
    // }
})

client.login(config.TOKEN);