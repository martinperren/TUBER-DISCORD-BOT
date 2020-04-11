const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const Client = require('node-rest-client').Client;
const restClient = new Client();
//var vel = 4320000000;
var admin = ["Owner", "Admin", "Bunker Support"];
var roles = ["Owner", "Admin", "Bunker Support","Mods"];
const randomWord = require('random-spanish-words');
const hangman = require("./hangman.js");
const prefix = "hang"

const figure = [`
 +---+
 |   |      wordHere
     |
     |      numerOfLives
     |      missC
     |
 =========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
     |      numerOfLives
     |      missC
     |
 =========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
 |   |      numerOfLives
     |      missC
     |
 =========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
/|   |      numerOfLives
     |      missC
     |
 =========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
/|\\  |      numerOfLives
     |      missC
     |
 =========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
/|\\  |      numerOfLives
/    |      missC
     |
 =========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
/|\\  |      numerOfLives
/ \\  |      missC
     |
 =========  gameStatus
`];



const runningGames = new Set();

function gatherPlayersFromMessage(channel) {
    return new Promise((resolve, reject) => {
        let players = [];
        const filter = (msg) => (msg.content.toLowerCase().includes("join") && !msg.author.bot);
        const collector = channel.createMessageCollector(filter, { time: 10000 });
        collector.on('collect', msg => {
            players.push(msg.author);
            msg.delete();
        });
        collector.on('end', async (collected) => {
            resolve(players);
        });
    });
}

async function gatherPlayersFromReaction(message, emoji) {

    await message.react(emoji);

    return new Promise(async (resolve, reject) => {
        let players = [];
        const filter = (r) => (r.emoji.name == emoji);
        //const filter = (r) => { return true; };
        await message.awaitReactions(filter, { time: 10000 })
            .then(collected => {
                collected.first().users.forEach((user) => {
                    if (!user.bot) {
                        players.push(user);
                    }
                });
            })
            .catch(err => reject(err));

        resolve(players);
    });
}

async function gatherPlayers(channel) {
    const msg = await channel.send("Reacciona con 📒 para participar del juego! Tenes 10 segundos.");
    let p1 = gatherPlayersFromMessage(channel);
    let p2 = gatherPlayersFromReaction(msg, '📒');
    let aPlayers = await Promise.all([p1, p2]);
    msg.delete();
    let players = [];
    // join both arrays of players into one of unique players.
    aPlayers.forEach(ps => ps.forEach(p => {
        if (!players.find(pOther => pOther.id == p.id)) {
            players.push(p);
        }
    }));
    return players;
}

async function getNextMessage(channel, maxTime) {
    return await channel.awaitMessages((m) => !m.author.bot, { max: 1, time: maxTime, errors: ['time'] })
        .catch((collected) => { throw collected });
}

async function getWordFromPlayers(players, channel) {
    let word;
    let chosenOne;
    while (!word && players.length > 1) {
        let index = Math.floor((Math.random() * 1000) % players.length);
        chosenOne = players[index];
        players.splice(index, 1);

        const dm = await chosenOne.createDM();

        await dm.send("Sos el jugador elegido! Responde con la palabra que elijas. Tenes 30 segundos. Recorda que NO podes participar en el juego.");
        let finish = false;
        let tries = 0;
        let msgCollection;
        while (!finish && tries < 3) {
            try {
                msgCollection = await getNextMessage(dm, 30000);
            } catch (collected) {
                await dm.send("Se terminó el tiempo, estas descalificado.");
                await channel.send("El jugador elegido no respondió, eligiendo a otro.");
                finish = true;
                continue;
            }

            const msg = msgCollection.first().content;
            if (msg.match(/^[A-Za-zÀ-ú]{3,}$/)) {
                word = msg.toLowerCase();
                finish = true;
                dm.send("Palabra aceptada, volviendo al servidor.");
            } else {
                await dm.send("Palabra invalida. No usar espacios, y que tenga al menos 3 letras.");
                ++tries;
                if (tries == 3) {
                    await dm.send("Demasiadas palabras equivocadas. Estas descalificado.");
                }
            }
        }
    }

    if (!word && players.length <= 1) {
        channel.send("No hay suficientes jugadores.");
        return;
    }

    return { word: word, selector: chosenOne }
}

async function showProgress(channel, game, gameMessage, gameOver) {
    const figureStep = figure[6 - game.lives];
    let progress = game.progress;
    let lives = "";
    for (let i = 0; i < 6; ++i) {
        if (i < game.lives) {
            lives += "❤️";
        } else {
            lives += "🖤";
        }
    }
    let misses = "Errores: ";
    for (let i = 0; i < game.misses.length; ++i) {
        misses += (game.misses[i] + " ");
    }

    let screen = figureStep.replace(/wordHere/, progress)
        .replace(/numerOfLives/, lives)
        .replace(/missC/, misses);

    const embed = new Discord.RichEmbed();
    if (gameOver) {
        if (game.status === "won") {
            embed.setColor("#00CC00");
            screen = screen.replace(/gameStatus/, "Ganaste");
        } else {
            embed.setColor("#E50000");
            screen = screen.replace(/gameStatus/, "Perdiste");
        }
    } else {
        screen = screen.replace(/gameStatus/, " ");
        embed.setColor("#FFD700");
    }
    embed.setDescription("```\n" + screen + "```");

    if (gameMessage) {
        await gameMessage.edit({ embed: embed });
    } else {
        return await channel.send({ embed: embed });
    }
}

async function startGame(channel, gameType) {
    const players = await gatherPlayers(channel);
    if (players.length == 0) {
        channel.send("Otra vez será... nadie entró a jugar :(");
        return;
    }
    if (gameType === "custom" && players.length < 2) {
        channel.send("Para una partida custom debe haber al menos 2 jugadores");
        return;
    }

    let word;
    let selector;
    switch (gameType) {
        case "random":
            // get a random word;
            word = randomWord();
            break;
        case "custom":
            await channel.send(players.length + " jugadores participando. Seleccionando a un jugador para elegir la palabra. Revisen sus mensajes privados!!");
            let userSelection = await getWordFromPlayers(players, channel);
            if (userSelection) {
                word = userSelection.word;
                selector = userSelection.selector;
            } else {
                return;
            }
            break;
    }

    const game = new hangman(word);

    return { game, players, selector };
}

async function runGame(channel, game, players) {
    const gameMessage = await showProgress(channel, game);
    const filter = ((m) =>
        players.cache.find((p) => (p.id == m.author.id)));

    const collector = channel.createMessageCollector(filter, { time: 600000 }); // max of 15 minutes per game

    return new Promise((resolve, reject) => {
        collector.on('collect', async (m) => {
            const c = m.content.toLowerCase();
            m.delete();
            if (m.content.match(/^[A-Za-zÀ-ú]{2,}$/)) {
                if (game.guessAll(c) == false) {
                    players.splice(players.cache.find(p => m.author.id == p.id), 1);
                }
            } else if (m.content.match(/^[A-Za-zÀ-ú]{1}$/)) {
                game.guess(c);
            } else {
                return;
            }
            await showProgress(channel, game, gameMessage);

            if (game.status !== "in progress") {
                collector.stop();
            } else if (players.length < 1) {
                collector.stop();
                game.status = "lost";
            }
        });
        collector.on('end', async (collected) => {
            await showProgress(channel, game, gameMessage, true);
            resolve();
        });
    });
}

async function showResult(channel, game, selector) {
    if (game.status === "won") {
        if (selector) {
            channel.send(`Ganaste. ${selector.username} la proxima vez elegi alguna mas difícil`);
        } else {
            channel.send("Ganaste!");
        }
    } else if (game.status === "lost") {
        if (selector) {
            channel.send(`${selector.username} ha ganado!!. La palabra era ${game.word}.`);
        } else {
            channel.send(`Perdieron, la palabra era ${game.word}.`);
        }
    } else {
        channel.send("El juego terminó, limite de tiempo excedido.");
    }
}

client.on('message', async (msg) => {
    if (msg.content.startsWith("jugar")) {
    	
        const args = msg.content.slice(prefix.length).trim().split(' ').filter(word => word.trim().length > 0);
        msg.channel.send(args);
        switch (args[0]) {
            case "start":
                if (!runningGames.has(msg.guild)) {
                    let gameType = "custom";
                    if (args[1]) switch (args[1]) {
                        case "random":
                            gameType = "random";
                            break;
                        case "custom":
                            gameType = "custom";
                            break;
                        default:
                            msg.channel.send("Podes elegir entre el modo de juego \"custom\" o \"random\". Usa !jugar modo");
                            return;
                    }

                    runningGames.add(msg.channel.guild);

                    let game, players, selector;
                    const gameInfo = await startGame(msg.channel, gameType);
                    if (gameInfo) {
                        game = gameInfo.game;
                        players = gameInfo.players;
                        selector = gameInfo.selector;
                        await runGame(msg.channel, game, players);
                        await showResult(msg.channel, game, selector);
                    }

                    runningGames.delete(msg.channel.guild);
                } else {
                    msg.reply("Ya hay un juego en curso.");
                }
                break;
            case "help":
                msg.channel.send({ embed: helpEmbed });
                break;
        }
    }
});



client.on('error', (err) => console.error(err));


//  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  








client.on("ready", () => {
	
	
	
	
	console.log("Bot iniciado");
	
	client.user.setActivity(process.env.GAME, { type: 'LISTENING' })
	.then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
	.catch(console.error);

});



client.on('guildMemberAdd', member => {
    //member.guild.channels.get('555046804807221248').send('**' + member.user.username + '** ahora vive en MAIAMEEEEE! :house:');
    member.roles.add("691878387970736128");
});
client.on('guildMemberRemove', member => {
   // member.guild.channels.get('555046804807221248').send('**' + member.user.username + '** no sacó la mano de ahí y se quedo trificado. :hand_splayed: ');

});




//REACTIONS ADDD AND REMOVE 





client.on('messageReactionAdd', async (reaction, user) => {
	

	let applyRole = async () => {
		let emojiName = reaction.emoji.name;

		let role = reaction.message.guild.roles.cache.find(role => role.name.toLowerCase() === emojiName.toLowerCase());
		let member = reaction.message.guild.members.cache.find(member => member.id === user.id);


		member.roles.remove("691878387970736128");
		member.roles.add("537712377634881545");

		try {
			if(role && member) {
				
				await member.roles.add(role);
				console.log(member.displayName+ " ahora tiene el rol "+reaction.emoji.name+".");
			}
		}
		catch(err) {
			console.log(err);
		}
	}
	if(reaction.message.partial)
	{

		try {
			let msg = await reaction.message.fetch(); 
			
			if(msg.id === '691831956106903563')
			{			
				applyRole();
			}
		}
		catch(err) {
			console.log(err);
		}
	}
	else 
	{
		if(reaction.message.id === '691831956106903563') {
			
			applyRole();
		}
	}
});

client.on('messageReactionRemove', async (reaction, user) => {
	let removeRole = async () => {
		let emojiName = reaction.emoji.name;
		let role = reaction.message.guild.roles.cache.find(role => role.name.toLowerCase() === emojiName.toLowerCase());
		let member = reaction.message.guild.members.cache.find(member => member.id === user.id);
		try {
			if(role && member) {

				await member.roles.remove(role);
				console.log(member.displayName+ " ya no tiene el rol "+emojiName+".");
			}
		}
		catch(err) {
			console.log(err);
		}
	}
	if(reaction.message.partial)
	{
		try {
			let msg = await reaction.message.fetch(); 
			
			if(msg.id === '691831956106903563')
			{
				removeRole();
			}
		}
		catch(err) {
			console.log(err);
		}
	}
	else 
	{
		
		if(reaction.message.id === '691831956106903563') {
			
			removeRole();
		}
	}
})





//RAINBOW ROLES COLOUR


/*
const size    = 12;
const rainbow = new Array(size);

for (var i=0; i<size; i++) {
  var red   = sin_to_hex(i, 0 * Math.PI * 2/3); // 0   deg
  var blue  = sin_to_hex(i, 1 * Math.PI * 2/3); // 120 deg
  var green = sin_to_hex(i, 2 * Math.PI * 2/3); // 240 deg

  rainbow[i] = '#'+ red + green + blue;
}

function sin_to_hex(i, phase) {
	var sin = Math.sin(Math.PI / size * 2 * i + phase);
	var int = Math.floor(sin * 127) + 128;
	var hex = int.toString(16);

	return hex.length === 1 ? '0'+hex : hex;
}

let place = 0;


function changeColor() {

	client.guilds.cache.get("537710790107725844").roles.find('name',"Bunker Support").setColor(rainbow[place])
	.catch(console.error);

	if(true){
		console.log(`[ColorChanger] Changed color to ${rainbow[place]}`);
	}
	if(place == (size - 1)){
		place = 0;
	}else{
		place++;
	}

}
*/




//   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   




client.on("message", async message => {
	const args = message.content.slice(1).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const argsM = message.content.split(' ');



/*

	if (message.content.startsWith("!vel")){
		message.delete();
		vel = args.join(" ");
		setInterval(changeColor, vel);
		message.channel.send("Velocidad seteada a "+vel+". (Menos de 60000 y me ripean el bot)");
	}

*/


	if (message.content.includes("huevo")) {
		message.react("537716624296378399");
	}
	
	
	if (message.content.startsWith("!huevo")){
		message.delete();
		const ayy = client.emojis.cache.get("537716624296378399");
		message.channel.send(`¿y el ${ayy}?`);
	}




	if (message.content.startsWith("!say")){
		if (!message.member.hasPermission("BAN_MEMBERS"))
			return 0;
		const sayMessage = args.join(" ");
		message.delete().catch(O_o => {
		});
		message.channel.send(sayMessage);
	}
	
	
	

	function isSpace(aChar){ 
		myCharCode = aChar.charCodeAt(0);

		if(((myCharCode >  8) && (myCharCode < 14)) ||
			(myCharCode == 32))
		{
			return true;
		}

		return false;
	}

	function isNumber(input) {
		return !isNaN(input);
	}
	
	
	if (message.content.startsWith("!big")){
		if (!message.member.hasPermission("BAN_MEMBERS"))
			return 0;
		const sayMessage = args.join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		let arr = Array.from(sayMessage.toLowerCase());
		var salida = "";
		var tam = arr.length;
		var i;
		for (i = 0; i < tam; i++) {
			if(isSpace(arr[i])){
				salida = salida + "   ";	        
			}else{
			}if(isNumber(arr[i])){

				if(arr[i]=="0") salida= salida + ":zero:";
				if(arr[i]=="1") salida= salida + ":one:";
				if(arr[i]=="2") salida= salida + ":two:";
				if(arr[i]=="3") salida= salida + ":three:";
				if(arr[i]=="4") salida= salida + ":four:";
				if(arr[i]=="5") salida= salida + ":five:";
				if(arr[i]=="6") salida= salida + ":six:";
				if(arr[i]=="7") salida= salida + ":seven:";
				if(arr[i]=="8") salida= salida + ":eight:";
				if(arr[i]=="9") salida= salida + ":nine:";


			}else{
				salida= salida + ":regional_indicator_"+arr[i]+":";   

			}


		}	 
		message.delete().catch(O_o => {
		});
		message.channel.send(salida.toString());
	}
	
	
	
	

	



    if (message.author.id=='355922192749428737'&&(message.content.includes("lol")||(message.content.includes("sale")))){

    	return message.channel.send('No Faste, no rompas las bolas.');
    }




    if (message.content.startsWith("!uptime")){
    	if (!message.member.hasPermission("BAN_MEMBERS"))
    		return 0;
    	message.delete();

    	var days = client.uptime / 8.64e7 | 0;
    	var hrs  = (client.uptime % 8.64e7)/ 3.6e6 | 0;
    	var mins = Math.round((client.uptime % 3.6e6) / 6e4);	
    	message.channel.send(`__**BOT UPTIME:**__ ${days} DIAS ${hrs} HS ${mins} MINS`); 	
    }



    if (message.content.startsWith("!server")){
    	let sicon = message.guild.iconURL;
    	let serverembed = new Discord.MessageEmbed()
    	.setDescription("Informacion del Servidor")
    	.setColor("#15f153")
    	.setThumbnail(sicon)
    	.addField("Nombre", message.guild.name)
    	.addField("Fecha de Creación", message.guild.createdAt)
    	.addField("Fecha de Ingreso", message.member.joinedAt)
    	.addField("Cantidad de Miembros", message.guild.memberCount);
    	message.channel.send(serverembed);
    }
});
client.login(process.env.BOT_TOKEN);
