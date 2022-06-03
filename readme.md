![SkyMocha Rules Banner](https://cdn.discordapp.com/attachments/970309275966660638/970312317734633502/unknown.png)

# SkyMocha Discord Bot

The SkyMocha Discord Bot is a custom made Discord bot for the [SkyMocha Discord server](https://discord.com/invite/T6BsDe9YX6)

> As of 6/3/2022 the bot has been migrated/re-written from JavaScript to TypeScript still using the Discord.JS library

## Overview

### Front-end Features

- Integration with the [SkyMocha Website API](https://github.com/SkyMocha/SkyMocha-Website) for accessing the [@skymochi64](https://twitter.com/skymochi64) Twitter and [@skymochi64](https://www.instagram.com/skymochi64/) Instagram timelines - updates the #feeds channel within ~5 minutes of new posts

- Leaderboard functionality for tracking active members (CURRENTLY BROKEN)

- Reaction Roles

- Kick & Ban commands w/ logging

Example from the endpoint `/twitter/timenline/` resolving in an eventual Discord Embed:

```json
[
	{
		"time": "Sat May 283",
		"text": "New Twitter banner? :)",
		"rts": 0,
		"likes": 0,
		"img": ["https://pbs.twimg.com/media/FT3kunsXoAETWo9.jpg"]
	}
]
```

![Twitter Example](temp)

### Back-end Features

- Custom code for reaction roles

- Custom code for caching and retrieving info (guilds, channels, users, roles)

Roles Example:

`addRole("She/Her")` -> caches a role with the name "She/Her" into an Object (right now `roles`)

`getRole("She/Her")` -> retrieves the role with the name "She/Her" from an Object (right now `roles`)

Guilds Example:

`Channels.addGuild ("SkyMocha")` -> caches the guild SkyMocha into a `Channels` class

`Channels.getGuild ("SkyMocha")` -> retrieves the guild SkyMocha from the `Channels` class

Example uses:

```javascript
Channels.getGuild("SkyMocha")
	.roles.cache.array()
	.forEach((r) => {
		roles[r.name] = addRole(r.name);
	});
```

This code iterates through the cached guild's (SkyMocha) roles and caches them into a `roles` object

```javascript
client.on("messageReactionAdd", async (reaction, user) => {
	if (reaction.message.channel == Channels.getChannelID("Roles")) {
		switch (reaction.emoji.name) {
			case emojis["He"]:
				addRoleToUser(user, getRole("he/him"));
		}
	}
});
```

This currently used code for the event handler `messageReactionAdd` checks to see if any reaction occurs in the `Roles` channel, then if the role corresponds to a cached emoji `He` it will add the cached role `He/Him` to the `User`.

## TODO

### TODO Long-Term

- Fixing !card command
- QOTD integration

### SCRAPPED (Can be found in /testing/)

- Swear/slur filters
- Leveling (temp?)

## Lisence

cc-by-4.0
