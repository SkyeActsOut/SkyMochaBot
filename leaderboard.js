
const { createCanvas, registerFont, loadImage } = require('canvas')
const canvas = createCanvas(400, 125)
registerFont ('./res/fonts/Roboto/Bold.ttf', {family: 'Bold'})
registerFont ('./res/fonts/Roboto/Italic.ttf', {family: 'Italic'})
const { MessageEmbed } = require("discord.js");

class LeaderBoard {

    constructor () {

        this.bold = 25;
        this.reg = 18;
        this.spacing = 40;
        this.letter_max = 18;
        this.top = 15;

    }

    /**
     * 
     * @param {String} name 
     * @param {String} join 
     * @param {String} points 
     * @returns {Canvas}
     */
    async card (name='placeholderasdfghjkladsfghj', join='01/01/2020', points='100', pfp='https://via.placeholder.com/225') {

        let bold = this.bold;
        let reg = this.reg;
        let letter_max = this.letter_max;
        let top = this.top;
        
        if (name.length > letter_max)
            name = name.slice(0, letter_max);

        var ctx = canvas.getContext('2d')

        ctx.fillStyle = "#0f071a"; // Dark Purple

        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#f5f7f7"; // Light White
        
        let image_size = 100;

        ctx.textAlign = 'left'
        ctx.font = `${bold}px Bold`
        ctx.fillText(name, image_size+30, top+bold)

        ctx.font = `${reg}px Italic`

        ctx.fillText('Joined:', image_size+30, top+bold+15+reg)
        ctx.fillText('Points:', image_size+30, top+bold+15+reg+15+reg)

        ctx.fillText(join, image_size+30+80, top+bold+15+reg)
        ctx.fillText(points, image_size+30+80, top+bold+15+reg+15+reg)

        ctx.beginPath();
        ctx.arc(15+image_size/2, 10+image_size/2, image_size/2, 360, 0, Math.PI * 2);
        ctx.clip();

        let image = await loadImage(pfp);

        ctx.drawImage(image, 15, 10, image_size, image_size)

        return await canvas.toBuffer()

    }

    leader (json, guild) {

        var embed = new MessageEmbed();

        let entries = Object.entries(json)

        entries = entries.sort ( ( a, b ) => {

            let a_len = JSON.parse(a[1]).msgs.length;
            let b_len = JSON.parse(b[1]).msgs.length;

            return b_len - a_len;

        } ) 

        if (entries.length > 10)
            entries = entries.slice (0, 10);

        let names = ''
        let points = ''
        
        entries.forEach (e => {

            let member = guild.member(e[0]);
            if (member != 'null' && member != undefined && member != null) {
                if (member.nickname != null)
                    names += `${member.nickname}\n`
                else
                    names += `${member.user.username}\n`
                points += `${JSON.parse(e[1]).msgs.length}\n`
            }

        })

        embed.setTitle = 'SkyMocha Rankings'
        embed.addField('Name', names, true)
        embed.addField('Points', points, true)

        return embed;

    }

}

module.exports = LeaderBoard;