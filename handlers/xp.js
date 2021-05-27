const db = require("quick.db");
const discord = require("discord.js");
const client = new discord.Client({
  partials: ["MESSAGE", "REACTION"],
});
class Util {
  static getLevel(xp, extra = false) {
    let level = 1;

    //WHILE LOOP
    while (xp >= Util.getLevelxp(level) && level < 10) {
      xp -= Util.getLevelxp(level);
      level++;
    }
    if (extra) return [level, xp];
    else return level;
  }

  static getLevelxp(level) {
    return 5 * Math.pow(level, 2) + 440 * level + 100;
  }

  static getInfo(exp) {
    let [level, remxp] = Util.getLevel(exp, true);
    let levelxp = Util.getLevelxp(level);

    return { level, remxp, levelxp };
  }

  static giveExp(target, arg, message) {
    let gavexp = Number(arg);
    console.log(gavexp);
    let oldxp = db.get(`xp_${target.id}_${message.guild.id}`);
    let oldlvl = Util.getLevel(oldxp);
    console.log(oldlvl);
    let newxp = oldxp + gavexp;
    let newlvl = Util.getLevel(newxp);
    console.log(newlvl);
    db.add(`xp_${target.id}_${message.guild.id}`, gavexp);
    if (newlvl > oldlvl) {
      Util.verlvl(oldlvl, newlvl, message);
      message.channel.send(
        `${message.author}, Parabéns, agora você está no Level ${newlvl}`
      );
    }
  }

  static verlvl(oldlvl, newlvl, message) {
    if (newlvl > oldlvl) {
      const role = [
        "803769991656505354", // Novo Player
        "803707738005045269", // NV 1
        "804505281052016681", // NV 2
        "804504954785628192", // NV 3
        "804505494609461318", // NV 4
        "804505715438911508", // NV 5
        "804505893353816064", // NV 6
        "804506436977295373", // NV 7
        "804506565733646377", // NV 8
        "804508552340701194", // NV 9
        "803771924546977814", // NV 10
      ];
      console.log(role[newlvl]);
      const member = message.member;
      member.roles.add(role[newlvl]).catch(console.error);
      for (var i = 0; i < newlvl; i++) {
        member.roles.remove(role[i]).catch(console.error);
      }
    }
  }

  static addexp(message) {
    let toadd = Math.floor(Math.random() * 3 + 3);
    console.log(toadd);
    let oldxp = db.get(`xp_${message.author.id}_${message.guild.id}`);
    let oldlvl = Util.getLevel(oldxp);
    let newxp = oldxp + toadd;
    let newlvl = Util.getLevel(newxp);
    db.add(`xp_${message.author.id}_${message.guild.id}`, toadd);
    if (newlvl > oldlvl) {
      Util.verlvl(oldlvl, newlvl, message);
      message.channel.send(
        `${message.author}, Parabéns, agora você está no Level ${newlvl}`
      );
    }
  }
}

module.exports = Util;
