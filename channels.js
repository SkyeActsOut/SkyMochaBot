class _Channels {
    constructor (client) {
        console.log ("MEOW");
        this.client = client;
        this.channels = {}
        this.guilds = {}
        this.users = {}
    }

    addGuild (name, id) {
        return this.client.guilds.fetch ([id]).then (g => {
            this.guilds[name] = g;
        })
    }

    addChannel (name, id) {
        return this.client.channels.fetch ([id]).then (c => {
            this.channels[name] = c;
        })
    }

    getGuild (name) {
        return this.guilds[name];
    }
    
    getChannel (name) {
        return this.channels[name];
    }
    getChannelID (name) {
        return this.channels[name].id;
    }

    addUser (name, id) {
        return this.client.users.fetch ([id]).then (u => {
            this.users[name] = u;
        })
    }

    getUser (name) {
        return this.users[name];
    } 
    getUserID (name) {
        return this.users[name].id;
    }

    /**
     * 
     * @param {String} func 
     */
    err (func) {
        this.getChannel('Bot Logs').send(`There was an error at ${func.toUpperCase()} @ ${date()} ${this.getUser("SkyMocha")}`);
    } 

    date () {
        let d = new Date();
        return `f${d.getHours()}:${d.getSeconds()}`;
    }
}

module.exports = _Channels;