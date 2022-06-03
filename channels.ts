import { Channel, Client, Guild, Snowflake, User } from "discord.js";

class _Channels {
    client: Client;
    channels: {
        [name: string]: Channel;
    }
    guilds: {
        [name: string]: Guild;
    }
    users: {
        [name: string]: User;
    }

    constructor (client:Client) {
        this.client = client;
        this.channels = {}
        this.guilds = {}
        this.users = {}
    }

    addGuild (name:string, id:Snowflake):Promise<Guild> {
        return this.client.guilds.fetch (id).then (g => {
            this.guilds[name] = g;
            return g;
        })
    }

    addChannel (name:string, id:Snowflake):Promise<Channel> {
        return this.client.channels.fetch (id).then (c => {
            this.channels[name] = c;
            return c;
        })
    }

    getGuild (name:string):Guild {
        return this.guilds[name];
    }
    
    getChannel (name:string):Channel {
        return this.channels[name];
    }
    getChannelID (name:string):Snowflake {
        return this.channels[name].id;
    }

    addUser (name:string, id:Snowflake):Promise<User> {
        return this.client.users.fetch (id).then (u => {
            this.users[name] = u;
            return u;
        })
    }

    getUser (name:string):User {
        return this.users[name];
    } 
    getUserID (name:string):Snowflake {
        return this.users[name].id;
    }

    date () {
        let d = new Date();
        return `f${d.getHours()}:${d.getSeconds()}`;
    }
}

module.exports = _Channels;