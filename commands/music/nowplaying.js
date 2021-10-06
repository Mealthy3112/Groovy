const { MessageEmbed } = require("discord.js");
const { Command, CommandoMessage, } = require("discord.js-commando");
const { BotNotInVoiceChannel } = require('../../strings.json');

module.exports = class NpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'np',
            group: 'music',
            memberName: 'np',
            description: "Affiche la musique en cours de lecture.",
            args: [
                {
                    key: 'page',
                    prompt: 'Quelle page veux-tu afficher ?',
                    default: 1,
                    type: 'integer',
                }
            ]
        });
    }

   /**
    * 
    * @param {CommandoMessage} message 
    * @param {Number} page 
    */
    async run(message, { page }) {
        const server = message.client.server;

        if (!message.client.voice.connections.first()) {
            return message.say(BotNotInVoiceChannel);
        }
        
        const numberOfItems = 10;
        const startingitem = (page - 1) * numberOfItems;
        const queueLength = server.queue.length;

        var itemsPerPage = startingitem + numberOfItems;
        var totalPages = 1;

        var embed = new MessageEmbed()
            .setTitle(`Now Playing`)
            .setColor("PURPLE")
            .addField('En train de jouer :', `[${server.currentVideo.title}]` + `(${server.currentVideo.url})`);

        if (queueLength > 0) {
                var value = "";
        
    
            if (queueLength > numberOfItems) {
                 totalPages = Math.ceil(queueLength / numberOfItems);
            }
    
            if (page < 0  || (page) > totalPages) {
                return message.say(":x: Aucune musique n'est actuellement en cours de lecture.");
            }

        }
        embed.setFooter(`Page ${page}/${totalPages}`);

        return message.say(embed);
    
    }  
}