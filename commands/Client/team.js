const db = require('quick.db')
const discord = require('discord.js')
/* const { getInfo } = require("../../handlers/xp.js") */
module.exports = {
  name: "team",
  description: "Você pode criar um time ou ver o seu time atual",
  usage: "team",
  category: "info",
  run: (client, message, args) => {

    const mensagens = ['Ok estarei criando um novo time para você, mas antes disso preciso que entenda:\n'
      + 'Você será responsável pelo seu time e não poderá ser dono de 2 times simultanêamente;\n'
      + 'Você será o unico que poderá cadastrar seu time em campeonatos e scrins.\n'
      + ' Deseja seguir com o cadrastro ? (S/N)\n',
      'Nome do time:',
      'Escolha uma Sigla:',
      'Nickname (no jogo) de um dos participantes',
      'Mencione o seu amigo aqui no discord (Está etapa é necessária para que nós realizarmos as premiações dentro do discord)',
      'Elo atual do membro do time',
      'Você gostaria de adicionar um novo player ou encerrar o cadastro do time ? (ADC/Encerrar)\n',
    ];
    const member = message.member;
    const serverID = message.guild.id;
    const userId = message.member.id;
    let filter = (m) => { m.author.id == message.author.id; };

    if (db.has(`team_${userId}_${serverID}.team`) === false) {
      const playerNumber = 1;
      let i = 0
      if (db.has(`team_${userId}_${serverID}.lastI`)) i = db.get(`team_${user.id}_${serverID}.lastI`)
      member.send("Vi que você ainda não tem um time, gostaria de criar ? (s/n)");
      try {
        let collected = /*await*/ message.dmChannel.awaitMessages(filter, { max: 1, time: 400000 }); // arrumar a função await
        {
          if (collected.first().content.toLowerCase() == 's') {
            for (i; i < 6; i++) {
              member.send(mensagens[i]);
              try {
                let collected = /*await*/ message.dmChannel.awaitMessages(filter, { max: 1, time: 400000 });
                {
                  if (collected.first().content.toLowerCase() == 's') {
                    db.set(`team_${userId}_${message.guild.id}`);
                    continue;
                  } else if (collected.first().content.toLowerCase() == 'n') {
                    member.send('Criação de time cancelada, você pode continuar de onde parou apenas iniciando novamente o comendo team\nCaso não queira continuar com esse cadrastro, use o comando delete');
                    break;
                  } else {
                    member.send('Criação de time cancelada.');
                  }
                  switch (i) {
                    case 1: db.set(`team_${userId}_${serverID}`, { name: collected.first().content.toLowerCase() });
                      continue
                    case 2: db.set(`team_${userId}_${serverID}`, { tag: collected.first().content.toLowerCase() });
                      continue
                    case 3: db.set(`team_${userId}_${playerNumber}_${serverID}`, { playerName: collected.content.toLowerCase() });
                      continue
                    case 4: db.set(`team_${userId}_${playerNumber}_${serverID}`, { PlayerID: message.first().mentions.id });
                      continue
                    case 5: db.set(`team_${userId}_${playerNumber}_${serverID}`, { Elo: collected.content.toLowerCase() });
                      continue
                    case 6:
                      if (collected.first().content.toLowerCase() == 'adc') {
                        i = 2;
                        playerNumber++;
                        continue
                      } else if (collected.first().content.toLowerCase() == 'encerrar') {
                        db.set(`team_${userId}_${message.guild.id}`, { team: true });
                        db.set(`team_${userId}_${message.guild.id}`, { lastPlayer: playerNumber });
                        break;
                      }
                  }
                }
              } catch (e) {
                member.send('Infelizmente se passou 40 segundos e você não me respondeu, caso queira refazer o processo, só enviar o comando no servidor, você continuará de onde parou.');
                db.set(`team_${userId}_${serverID}`, { lastI: i })
                break;
              }
            }
          }
          else {
            member.send('Criação de time cancelada.');
          }
        }
      } catch (e) {
        member.send('Infelizmente se passou 40 segundos e você não me respondeu, caso queira refazer o processo, só enviar o código novamente no servidor ');
      }
    }
    /* else if (db.has(`team_${user.id}_${message.guild.id}.team`) === true) {
      member.send("Você gostaria de adicionar um novo player , remover um player ou atualizar alguma informação ? ( novo / remove / att )");
      try {
        let collected = await message.dmChannel.awaitMessages(filter, { max: 1, time: 400000 });
        {
          if (collected.first().content.toLowerCase() == 'novo') {
            const playerNumber = db.get(`team_${user.id}_${message.guild.id}.lastPlayer`);
            for (let i = 3; i < 6; i++) {
              message.send(mensagens[i]);
              try {
                let collected = await message.dmChannel.awaitMessages(filter, { max: 1, time: 400000 });
                {
                  switch (i) {
                    case 3: db.set(`team_${user.id}_${playerNumber}_${serverID}`, { playerName: collected.content.toLowerCase() });
                    case 4: db.set(`team_${user.id}_${playerNumber}_${serverID}`, { PlayerID: message.first().mentions.id });
                    case 5: db.set(`team_${user.id}_${playerNumber}_${serverID}`, { Elo: collected.content.toLowerCase() });
                    case 6:
                      if (collected.first().content.toLowerCase() == 'adc') {
                        i = 2;
                        playerNumber++
                      } else if (collected.first().content.toLowerCase() == 'encerrar') {
                        playerNumber++;
                        db.set(`team_${user.id}_${message.guild.id}`, { team: true });
                        db.set(`team_${user.id}_${message.guild.id}`, { lastPlayer: playerNumber })
                      }
                  }
                }
              } catch (e) {

              }
            }
          } else if (collected.first().content.toLowerCase() == 'remove') {
            message.send('Qual seria o player que você gostaria de remover , escreva o ID');
            try {
              let collected = await message.dmChannel.awaitMessages(filter, { max: 1, time: 400000 });
              {
                playerNumber == collected.first().content.toLowerCase();
                db.delete(`team_${user.id}_${playerNumber}_${serverID}`)
              }
            } catch (e) {

            }
          } else if (collected.first().content.toLowerCase() == 'atualizar') {
            message.send('Qual seria o player que você gostaria de atualizar , escreva o ID');
            try {
              let collected = await message.dmChannel.awaitMessages(filter, { max: 1, time: 400000 });
              {
                playerNumber == collected.first().content.toLowerCase();
                message.send('Oque você gostaria de alterar ? (nome/elo)');
                try {
                  let collected = await message.dmChannel.awaitMessages(filter, { max: 1, time: 400000 });
                  {
                    if (collected.first().content.toLowerCase() == 'nome') {
                      try {
                        let collected = await message.dmChannel.awaitMessages(filter, { max: 1, time: 400000 });
                        {
                          db.set(`team_${user.id}_${playerNumber}_${serverID}`, { playerName: collected.content.toLowerCase() });
                        }
                      } catch (e) {

                      }
                    } else if (collected.first().content.toLowerCase() == 'elo') {
                      try {
                        let collected = await message.dmChannel.awaitMessages(filter, { max: 1, time: 400000 });
                        {

                        }
                      } catch (e) {

                      }
                    }
                  }
                } catch (e) {

                }
              }
            } catch (e) {

            }
          }
        }
      }
    } */
  }
}
