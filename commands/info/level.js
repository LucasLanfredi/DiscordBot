const db = require('quick.db')
const discord = require('discord.js')
const { getInfo } = require("../../handlers/xp.js")
module.exports = {
  name: "level",
  description: "Get the level of author or mentioned",
  usage: "level <user>",
  category: "info",
  run: (client, message, args) => {
    const user = message.mentions.users.first() || message.author;
    
    if(user.id === client.user.id) { //IF BOT
      return message.channel.send("😉 | Eu sou nv 1000")
    }
    
    if(user.bot) {
      return message.channel.send("Bot não tem niveis")
    }
    
    let xp = db.get(`xp_${user.id}_${message.guild.id}`) || 0;
    
    const {level, remxp, levelxp} = getInfo(xp);
    if(xp === 0) return message.channel.send(`**${user.tag}** você ainda não tem experiencia.`)
    
    if(level <10){
      let embed = new discord.MessageEmbed()
      .setAuthor(user.username, message.guild.iconURL())
      .setColor("#ff2050")
      .setThumbnail(user.avatarURL())
      .setDescription(`*LEVEL* - ${level}
  *XP* - ${remxp}/${levelxp}`);
  message.channel.send(embed) 
      }
      else{
        let embed = new discord.MessageEmbed()
      .setAuthor(user.username, message.guild.iconURL())
      .setColor("#ff2050")
      .setThumbnail(user.avatarURL())
      .setDescription(`*LEVEL* - ${level}
  *XP* - ${remxp}`)
  message.channel.send(embed)   
      }
  }
}
