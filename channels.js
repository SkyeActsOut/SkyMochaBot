class _Channels {
    constructor (client) {
        console.log ("MEOW");
        this.client = client;
        this.channels = {}
        this.guilds = {}
        this.users = {}
    }

    addGuild (name, id) {
        this.guilds[name] = this.client.guilds.cache.get (id);
        return true;
    }

    addChannel (name, id) {
        this.channels[name] = this.client.channels.cache.get (id)
        return true;
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
        this.users[name] = this.client.users.cache.get(id)
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