const discord = require("discord.js");
const db = require('quick.db');
const { giveExp } = require("../../handlers/xp.js")


module.exports = {
  name: "givexp",
  category: "moderation",
  description: "Adicionar experiencia",
  usage: "givexp <@user> <quantidade de xp>",
  run: (Client, message, args) => {
    
    if(!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send(`**${message.author.username}**, Você não tem permissão para realizar esse comando`)
    }
    
    if(!message.guild.me.hasPermission("ADMINISTRATOR")) {
      return message.channel.send(`**${message.author.username}**, O bot não tem permissão para realizar esse comando (Avise um ADM global)`)
    }
    
    let target = message.mentions.members.first();
    
    if (target.user.bot) {
        return message.channel.send(`**${message.author.username}**, Bot não tem Xp`);
    }

    if(!target) {
      return message.channel.send(`**${message.author.username}**, Mencione a pessoa que você quer adicionar xp`)
    }
    
    let embed = new discord.MessageEmbed()
    .setTitle("Action: Dar xp")
    .setDescription(`Dar xp ${target} (${target.id})`)
    .setColor("#ff2050");
    
    message.channel.send(embed)

    giveExp(target, args[1], message);
    
  }
}