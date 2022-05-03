![SkyMocha Rules Banner](https://cdn.discordapp.com/attachments/970309275966660638/970312317734633502/unknown.png)

# SkyMocha Discord Bot
The SkyMocha Discord Bot is a custom made Discord bot for the [SkyMocha Discord server](https://discord.com/invite/ppmaxad)

## Overview
### Front-end Features
* Integration with the [SkyMocha Website API](https://github.com/SkyMocha/SkyMocha-Website) for accessing the [@skymochi64](https://twitter.com/skymochi64) Twitter feed

Example from the endpoint `/twitter/timenline/`
```json
[
    {
        "time":"Tue May 03",
        "text":"I make questionable 7 AM decisions for research purposes...",
        "rts":0,
        "likes":1,
        "img":[]
    }
]
```

* Leaderboard functionality for tracking active members (BROKEN)

* Reaction Roles

### Back-end Features
* Custom code for reaction roles

* Custom code for caching and retrieving info (guilds, channels, users, roles)

Roles Example:
`addRole("She/Her")` -> caches a role with the name "She/Her" into an Object (right now `roles`)
`getRole("She/Her")` -> retrieves the role with the name "She/Her" from an Object (right now `roles`)

Guilds Example:
`Channels.addGuild ("SkyMocha")` -> caches the guild SkyMocha into a `Channels` class
`Channels.getGuild ("SkyMocha")` -> retrieves the guild SkyMocha from the `Channels` class

Example uses:
```javascript
Channels.getGuild("SkyMocha").roles.cache.array().forEach (r => {
    roles[r.name] = addRole(r.name);
})
```
This code iterates through the cached guild's (SkyMocha) roles and caches them into a `roles` object

```javascript
client.on ('messageReactionAdd', async (reaction, user) => { 

    if (reaction.message.channel == Channels.getChannelID("Roles")) { 

        switch (reaction.emoji.name) {

            case emojis['He']:
                addRoleToUser(user, getRole("he/him"))

        }

    }

});
```
This currently used code for the event handler `messageReactionAdd` checks to see if any reaction occurs in the `Roles` channel, then if the role corresponds to a cached emoji `He` it will add the cached role `He/Him` to the `User`.

## TODO
### TODO For 2.0
* Integration w/ Instagram API 
* Ban & Kick Logging

### TODO Long-Term
* Fixing !card command
* QOTD integration

## Lisence
cc-by-4.0