import { Client, MessageAttachment, Snowflake, Collection } from 'discord.js';
import fs from 'fs';
import { Tootcord } from 'tootcord';
import { TwitterApi, TwitterApiReadWrite } from 'twitter-api-v2';
import TwitterApiBase from 'twitter-api-v2/dist/client.base';
import { TUploadableMedia } from 'twitter-api-v2';
const download = require('image-downloader');


class Twitcord {

    twit_client: TwitterApiReadWrite;

    constructor(clientSec: TwitterApiBase) {

        this.twit_client = new TwitterApi(clientSec).readWrite;

        console.log(`CREATED TWITTER UNDER TOKEN ${clientSec}`)

    }


    AAA(length: number): string {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    async getFiles(files: Collection<Snowflake, MessageAttachment>): Promise<Array<string>> {

        let _files: Array<string> = []

        let _f_arr = files.array()
        for (let i = 0; i < _f_arr.length; i++) {

            let f = _f_arr[i]

            if (f != undefined) {

                let n: string = `${this.AAA(8)}.png`

                console.log(f.attachment.toString())
                await download.image({ url: f.attachment.toString(), dest: n })

                let base = 'api/node_modules/image-downloader/'

                await this.twit_client.v1.uploadMedia(`${base}${n}`).then(e => {

                    _files.push(e)
                    console.log(`TWITTER ID ${e}`)
                    fs.unlinkSync(`${base}${n}`)

                }).catch(e => {

                    console.error(e)
                    fs.unlinkSync(`${base}${n}`)

                })

            }

        }

        return _files
    }


    async post_tweet(text: string, files: Collection<Snowflake, MessageAttachment>): Promise<boolean> {

        let _files = await this.getFiles(files)
        let flag: boolean = false;

        if (text.length > 240) {
            return false
        }

        if (_files.length > 0)

            await this.twit_client.v1.tweet(text, { media_ids: _files }).then(() => flag = true)

        else

            await this.twit_client.v1.tweet(text).then(() => flag = true)

        return flag

    }

}

module.exports = Twitcord