const { MessageEmbed } = require("discord.js");
const { Command, CommandoMessage, } = require("discord.js-commando");
const { BotNotInVoiceChannel } = require('../../strings.json');

module.exports = class QueueCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            group: 'music',
            memberName: 'queue',
            description: "Affiche le file d'attente. Pour afficher différentes pages, tape la commande avec le numéro de page spécifiée après (ex:queue 2).",
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
            .setTitle(`File d'attente  :}`)
            .setColor("PURPLE")
            .addField('En train de jouer :notes: :', `[${server.currentVideo.title}]` + `(${server.currentVideo.url})`);

        if (queueLength > 0) {
            var value = "";

            if (queueLength > numberOfItems) {
                totalPages = Math.ceil(queueLength / numberOfItems);
            }

            if (page < 0  || (page) > totalPages) {
                return message.say(":x: Cette page n'existe pas.");
            }
            
            if ( (queueLength - startingitem) < numberOfItems ) {
                itemsPerPage = (queueLength - startingitem) + startingitem;
            }

            for(let i = startingitem; i < itemsPerPage; i++) {
                const video = server.queue[i];
                
                value += "`" + (i + 1) + ".` [" + video.title + "](" + video.url + ")\n";
            }
            embed.addField("À venir :", value);
        }
        
        embed.setFooter(`Page ${page}/${totalPages}`);

        return message.say(embed);
    }
    
}
