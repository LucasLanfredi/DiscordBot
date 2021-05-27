const { token, prefix } = require("./config.json");
const { config } = require("dotenv");
const discord = require("discord.js");
const client = new discord.Client({
  disableEveryone: true,
});
const db = require("quick.db");
const { addexp } = require("./handlers/xp.js");
client.commands = new discord.Collection();
client.aliases = new discord.Collection();

["command"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});
/*-*/
client.on("ready", () => {
  console.log("Está funcionando!");
  client.user.setActivity(db.get(`status`));
});

client.on("message", async (message) => {
  if (message.author.bot) return;

  if (!message.guild) return;

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();
    console.log(args);
    console.log(cmd);
  
    if (cmd.length === 0) return;
  
    // Get the command
    let command = client.commands.get(cmd);
    // If none is found, try to find it by alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));
  
    // If a command is finally found, run the command
    if (command) command.run(client, message, args);
    return;
  }

  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  return addexp(message);
});

client.on("guildMemberAdd", (member) => {
  let chx = db.get(`welchannel_${member.guild.id}`);

  if (chx === null) {
    return;
  }

  let wembed = new discord.MessageEmbed()
    .setAuthor(member.user.username, member.user.avatarURL())
    .setColor("#ff2050")
    .setThumbnail(member.user.avatarURL())
    .setDescription(`Estamos muito felizes de ter você no server.`);

  client.channels.cache.get(chx).send(wembed);
});

client.login(token);
