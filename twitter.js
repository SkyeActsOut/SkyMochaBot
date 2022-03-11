const axios = require ('axios')

class twitter {

    constructor (client, DiscordEmbed) {
        this.api = 'https://api.skymocha.net/api/v1/twitter/timeline'
        this.disc_feed_id = '951828825329791006'
        this.disc_feed = client.channels.cache.get(this.disc_feed_id)
        this.disc_client = client
        this.DiscordEmbed = DiscordEmbed
    }

    /**
     * 
     * @returns {Object} returns latest tweet
     */
    async getLatest () {
    
        let latest = []
    
        await axios.get(this.api).then (d => {
    
            latest = d.data[0]
        
        } )
    
        return await latest;
    }

    async isNew () {

        let latest = await this.getLatest();

        let discord_latest_ID = await this.disc_feed.lastMessageID;
        let discord_latest = await this.disc_feed.messages.fetch(discord_latest_ID)
        
        // await console.log (latest.text)
        // await console.log (discord_latest.embeds[0].description)

        return await latest.text.slice(0, 10) != discord_latest.embeds[0].description.slice(0, 10)

    }

    async send () {

        if (await this.isNew()) {
            let tweet = await this.getLatest();

            await this.disc_feed.send( 

                new this.DiscordEmbed(
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
                            "icon_url": `https://pbs.twimg.com/profile_images/1476698583223226372/Fk-EAfz7_400x400.jpg`
                        },
                        "footer": {
                            "text": `${tweet.time}`
                        }
                        // "url": `https://t.co/jbPbMpDU5w`
                    }
                )

            )
        }

    }
    
}

module.exports = twitter