const Discord = require("discord.js");

var client = new Discord.Client();

var config = require ('./config.json');

var smGuild;
var smGeneral;
var smRoles;
var smIntroductions;

var tcGuild;
var patreonTc;
var tcRoles;
var tcIntroductions;

// Loops through all skymocha users, checks if theyre in tailchan, then if they have patreon on SM add it on TC
function checkUsers () {
    smGuild.members.cache.forEach(u => {
        if (u.roles.cache.has ("902615822231568424")) { // has patreon rolle on SM Guild
            let tcMember = tcGuild.members.cache.get(u.id);
            if (tcMember.id != undefined && !tcMember.roles.cache.has(patreonTc.id)) {  // checks if user is in TC then checks no role
                tcMember.roles.add(patreonTc.id).then (m => {
                    tcGeneral.send (`${m} has had patreon role added through routine update`);
                }) 
            }
        }
    })
}

client.on ('ready', () => { 
    smGuild = client.guilds.cache.get ('374361004894846987');
    smGeneral = client.channels.cache.get ('391413861904809995');
    smRoles = client.channels.cache.get ('726473676903415828')
    smIntroductions = client.channels.cache.get ('726489767264518146')

    tcGuild = client.guilds.cache.get ("902209844872876034")

    tcGeneral = client.channels.cache.get ("902211877478735872")
    tcRoles = client.channels.cache.get ("902602399565373441")
    tcIntroductions = client.channels.cache.get ("902631596362960906")
    
    patreonTc = tcGuild.roles.cache.get("902604140088291349") // patreon role on the tailchan discord

    client.user.setActivity("SkyMocha", { type: "WATCHING" })
    console.log (`BOT IS ON UNDER ${client.user.tag}`);
    
    checkUsers ();

    setInterval(() => {
        checkUsers()
    }, 1000*60*30); // runs it every 1/2 hour (1000 ms * 60 s * 30 min)

})

client.on ('guildMemberAdd', (member) => {

    if (member.guild.id == tcGuild.id) {
        tcGeneral.send (`**Welcome** to the Tailchan 18+ Discord server, ${member}!\nIf you haven't already, grab your ${tcRoles} and make a ${tcIntroductions}!`)
    }

});

client.on ('guildMemberUpdate', (oldUser, newUser) => {
    // If the new user has the member role added to them
    if (smGuild.member (newUser).roles.cache.has('398856287498272771') && !smGuild.member (oldUser).roles.cache.has('398856287498272771'))
        smGeneral.send(`Welcome, officially, to SkyMocha Café, ${newUser}.\nIf you haven't already, grab your ${smRoles} and make a ${smIntroductions}!`)

    // If the new user has the patreon role added to them
    if (smGuild.member (newUser).roles.cache.has('902615822231568424') && !smGuild.member (oldUser).roles.cache.has('902615822231568424')) {
        // smGeneral.send(`${newUser} is now a patreon!`)
        if (tcGuild.members.cache.get(newUser.id).id != undefined) { // if the member is in tailchan 
            let tcMember = tcGuild.members.cache.get(newUser.id)
            if (!tcMember.roles.cache.has (patreonTc.id)) // if member doesnt have role
                tcMember.roles.add(patreonTc.id).then (m => { // adds the role then sends msg
                    tcGeneral.send (`${m} is now a patreon!`)
                })
        }
    }
})

client.login(config.TOKEN);