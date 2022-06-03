import { Axios } from 'axios';
import { Client, MessageOptions, Snowflake, TextChannel } from 'discord.js'

type Tweet = {
    "time": string,
    "text": string,
    "rts": number,
    "likes": number,
    "img": string
}

type InstaPost = {
    "id": string,
    "media_type": string,
    "media_url": string,
    "permalink": string,
    "timestamp": string
}

class Twitter {

    api: string;
    disc_feed_id: Snowflake;
    disc_feed: TextChannel;
    disc_errors: TextChannel;
    disc_client: Client;
    axios: Axios;
    interval: number;

    /**
     * @param {TextChannel} errors
     * @param {TextChannel} feed
     * @param {Client} client 
     */
    constructor (client:Client, feed:TextChannel, errors:TextChannel) {
        this.api = 'https://api.skymocha.net/api/v1/'
        
        this.disc_feed_id = '951828825329791006'
        this.disc_feed = feed;
        this.disc_errors = errors;
        this.disc_client = client;

        this.axios = new Axios({baseURL: this.api});

        this.interval = 5; // check every 5 minutes

        this.start();
    }

    emptyTweet () {
        return {
            "time": "-1",
            "text": "-1",
            "rts": -1,
            "likes": -1,
            "img": '-1'
        }
    }

    /**
     * 
     * @returns {Tweet} returns latest tweet
     */
    async getTweets (): Promise<Tweet[]> {
        
        const { data, status } = await this.axios.get('twitter/timeline');

        if (status == 200) {
            return JSON.parse(data);
        }
        else
            return [this.emptyTweet()];
    
    }

    /**
     * 
     * @returns {Tweet} gets the latest tweet
     */
    async getLatest (): Promise<Tweet> {
        const tweets = await this.getTweets();
        if (tweets.length > 1) {
            return tweets[0]
        }
        return this.emptyTweet();
    }

    async isNew (): Promise<boolean> {

        let latest = await this.getLatest();

        if (latest.text == '-1')
            return false;

        let discord_latest = (await this.disc_feed.messages.fetch({limit: 5})).array()
        if (discord_latest.length > 0) {

            let count = 0;
            let twitter_count = 0;

            for (let i = 0; i < discord_latest.length; i++){
                
                let latest_embed = discord_latest[i].embeds[0]
                let title;
                if (latest_embed.author != null)
                    title = latest_embed.author.name;

                if (latest_embed != null && title && title.toLowerCase() == 'skymochi64 twitter' && latest_embed.description != null && latest_embed.description.length > 5) {
                    twitter_count++;
                    if (latest.text.slice(0, 5) == latest_embed.description.slice(0, 5)) {
                        count++;
                    }
                }

            }

            return (count != twitter_count) || (count == 0 && twitter_count == 0);
        }

        return true;

    }

    /**
     * @description sends a message to the feeds channel if it's new
     */
    async send (): Promise<void> {

        let isNew = await this.isNew(); // is the message new?

        console.log (`TWITTER: Attempting to send new: ${isNew}`)

        if (isNew) {
            let tweet = await this.getLatest();

            console.log (tweet)

            const _embed =
                {
                    "type": "rich",
                    "title": "",
                    "description": `${tweet.text}`,
                    "color": 0xffffff,
                    "image": {
                        "url": `${tweet.img}`,
                        "height": 0,
                        "width": 0
                    },
                    "author": {
                        "name": `SkyMochi64 Twitter`,
                        "iconURL": 'https://pbs.twimg.com/profile_images/1476698583223226372/Fk-EAfz7_400x400.jpg'
                    },
                    "footer": {
                        "text": `${tweet.time}`
                    }
                }

            let options:MessageOptions = {
                embed: _embed
            };

            await this.disc_feed.send (options);
        }

    }

    /**
     * @description Starts by trying to send then tries every 15 minutes
     */
    start () { 

        this.send();

        setInterval(() => {
        
            try {
                this.send();
            }
            catch (err) {
                this.disc_errors.send (`Twitter => ${err}`)
            }
    
        }, 1000 * 60 * this.interval);
    }
    
}

class Instagram {

    api: string;
    disc_feed_id: Snowflake;
    disc_feed: TextChannel;
    disc_errors: TextChannel;
    disc_client: Client;
    axios: Axios;
    interval: number;

    /**
     * @param {TextChannel} errors
     * @param {TextChannel} feed
     * @param {Client} client 
     */
    constructor (client:Client, feed:TextChannel, errors:TextChannel) {
        this.api = 'https://api.skymocha.net/api/v1/'
        
        this.disc_feed_id = '951828825329791006'
        this.disc_feed = feed;
        this.disc_errors = errors;
        this.disc_client = client;

        this.axios = new Axios({baseURL: this.api});

        this.interval = 5; // check every 5 minutes

        this.start();
    }

    InstaPost (): InstaPost {
        return {
            "id": 'string',
            "media_type": 'string',
            "media_url": 'string',
            "permalink": 'string',
            "timestamp": 'string'
        }
    }

    /**
     * 
     * @returns {InstaPost} returns latest tweet
     */
    async getPosts (): Promise<InstaPost[]> {
        
        const { data, status } = await this.axios.get('insta/posts');

        if (status == 200) {
            return JSON.parse(data);
        }
        else
            return [this.InstaPost()];
    
    }

    /**
     * 
     * @returns {InstaPost} gets the latest tweet
     */
    async getLatest (): Promise<InstaPost> {
        const posts = await this.getPosts();
        if (posts.length > 1) {
            return posts[0]
        }
        return this.InstaPost();
    }

    async isNew (): Promise<boolean> {

        let latest = await this.getLatest();

        if (latest.timestamp == 'string')
            return false;

        
        let discord_latest = (await this.disc_feed.messages.fetch({limit: 5})).array()
        if (discord_latest.length > 0) {

            let count = 0;
            let insta_count = 0;

            for (let i = 0; i < discord_latest.length; i++){
                
                let latest_embed = discord_latest[i].embeds[0]

                let title;
                if (latest_embed.author != null)
                    title = latest_embed.author.name;

                if (latest_embed != null && title && title.toLowerCase() == 'skymochi64 instagram' && latest_embed.footer != null) {

                    insta_count++;
                    if (latest.timestamp.split('T')[0] != latest_embed.footer) {
                        count++;
                    }

                }

            }

            return (count != insta_count) || (count == 0 && insta_count == 0);

        }

        return true;

    }

    /**
     * @description sends a message to the feeds channel if it's new
     */
    async send (): Promise<void> {

        let isNew = await this.isNew(); // is the message new?

        console.log (`INSTAGRAM: Attempting to send new: ${isNew}`)

        if (isNew) {
            let post = await this.getLatest();

            console.log (post)

            const _embed =
                {
                    "type": "rich",
                    "title": "",
                    "description": `${post.permalink}`,
                    "color": 0xffffff,
                    "image": {
                        "url": `${post.media_url}`,
                        "height": 0,
                        "width": 0
                    },
                    "author": {
                        "name": `SkyMochi64 Instagram`,
                        "iconURL": `${this.disc_client.user?.avatarURL()}`
                    },
                    "footer": {
                        "text": `${post.timestamp.split('T')[0]}`
                    },
                    "url": `${post.permalink}`
                }

            let options:MessageOptions = {
                embed: _embed
            };

            await this.disc_feed.send (options);
        }

    }

    /**
     * @description Starts by trying to send then tries every 15 minutes
     */
    start () { 

        this.send();

        setInterval(() => {
        
            try {
                this.send();
            }
            catch (err) {
                this.disc_errors.send (`Instagram => ${err}`)
            }
    
        }, 1000 * 60 * this.interval);
    }
    
}

class API {

    twitter: Twitter;
    instagram: Instagram;

    constructor (client:Client, feed:TextChannel, errors:TextChannel) {
        this.twitter = new Twitter(client, feed, errors);
        this.instagram = new Instagram(client, feed, errors);
    }

}

module.exports = API