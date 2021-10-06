const { VoiceConnection } = require('discord.js');
const { Command, CommandoMessage, } = require("discord.js-commando");
const { UserNotInVoiceChannel } = require('../../strings.json');
const { key } = require("../../config.json");

const ytdl = require('ytdl-core');
const ytsr = require('youtube-search');
const ytpl = require('ytpl');

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            aliases: ['p'],
            group: 'music',
            memberName: 'play',
            description: 'Lire une musique depuis Youtube.',
            args: [
                {
                    key: 'term',
                    prompt: 'Quelle musique veut tu lire ?',
                    type: 'string'
                }
            ]
        });
    }

   /**
    * 
    * @param {CommandoMessage} message 
    * @param {String} query
    */
    async run(message, { term }) {
        const VoiceChannel = message.member.voice.channel;
        if (!VoiceChannel) {
            return message.say(UserNotInVoiceChannel);
        }
        const server = message.client.server;

        await VoiceChannel.join().then((connection) => {

            
            if (ytpl.validateID(term)) {
                //Playlist
                ytpl(term).then((result) => {

                    result.items.forEach((video) => {
                        server.queue.push({ title: video.title, url: video.shortUrl });
                    });

                    server.currentVideo = server.queue[0];
                    this.runVideo(message, connection).then(() => {
                        message.say(":white_check_mark: `" + result.items.length + "` musiques dans le file d'attente"  )
                    })
                })

            } else {
                //Vidéo.
                ytsr(term, {key: key, maxResults: 1, type: 'video' }).then((results) => {

                    if (results.results[0]) {
                        const foundVideo = { url: results.results[0].link, title: results.results[0].title };
                        
                        if (server.currentVideo.url != "") {
                            server.queue.push(foundVideo);
                            return message.say("`" + foundVideo.title + "`" + " - Ajoutée à la file d'attente :thumbsup:");
                        }

                        server.currentVideo = foundVideo;
                        this.runVideo(message, connection);
                    }
                });

            }
            
            
        });
    }

    /**
     * 
     * @param {CommandoMessage} message 
     * @param {VoiceConnection} connection 
     * @param {*} video 
     */
    async runVideo(message, connection, ) {
        const server = message.client.server;
        
        const dispatcher = connection.play(ytdl(server.currentVideo.url, { filter: 'audioonly' }));

        server.queue.shift();
        server.dispatcher = dispatcher;
        server.connection = connection;

        dispatcher.on('finish', () => {
            if (server.queue[0]) {
                server.currentVideo = server.queue[0];
                return this.runVideo(message, connection, server.currentVideo.url);

            }
        });

        return message.say("En train de jouer" + "`" + server.currentVideo.title + "`" + ":notes:")
    }
}