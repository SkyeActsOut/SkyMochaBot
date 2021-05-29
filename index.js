const Discord = require("discord.js");

var client = new Discord.Client();

var config = require ('./config.json');

var smGuild;
var smGeneral;
var smRoles;
var smIntroductions;

client.on ('ready', () => { 
    smGuild = client.guilds.cache.get ('374361004894846987');
    smGeneral = client.channels.cache.get ('391413861904809995');
    smRoles = client.channels.cache.get ('726473676903415828')
    smIntroductions = client.channels.cache.get ('726489767264518146')

    client.user.setActivity("SkyMocha Café", { type: "WATCHING" })
    console.log (`BOT IS ON UNDER ${client.user.tag}`);
})

client.on ('guildMemberUpdate', (oldUser, newUser) => {
    if (smGuild.member (newUser).roles.cache.has('398856287498272771') && !smGuild.member (oldUser).roles.cache.has('398856287498272771'))
        smGeneral.send(`Welcome, officially, to SkyMocha Café, ${newUser}.\nIf you haven't already grab your ${smRoles} and make a ${smIntroductions}!`)
})

client.login(process.env.TOKEN);