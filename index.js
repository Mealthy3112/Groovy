const { CommandoClient } = require('discord.js-commando');
const { url } = require('inspector');
const path = require('path');

const client = new CommandoClient({
    commandPrefix: "!",
    Owner: "861783966901862401",
    invite: "https://discord.gg/36HBSDPz"
});

client.registry
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerGroup('music', 'Music')
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.server = {
    queue: [],
    currentVideo: { url: "", title: "Rien pour le moment !" },
    dispatcher: null,
    connection: null,
};

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag} -  (${client.user.id})`);
})

client.on("error", (error) => console.error(error));

client.login('ODkzNTM0NjkwMjUyODQwOTYw.YVc3Bw.1ynGHnDv0s0TK8xdcZIpelEhojk');