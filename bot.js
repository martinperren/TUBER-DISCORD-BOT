const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const Client = require('node-rest-client').Client;
//const ytdl = require('ytdl-core-discord');
const jsonfile = require('jsonfile');
const restClient = new Client();
const ms = require("ms");
const Util = require('discord.js');
//const YouTube = require('simple-youtube-api');
//const youtube = new YouTube(process.env.YT_API);
//const queue = new Map();
var vel = 4320000000;
var admin = ["Owner", "Admin", "Bunker Support"];
var roles = ["Owner", "Admin", "Bunker Support","Mods"];




//  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  








client.on("ready", () => {
	
	
	
	
	console.log("Bot iniciado");
	
	client.user.setActivity(process.env.GAME, { type: 'LISTENING' })
	.then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
	.catch(console.error);

});
client.on("guildCreate", guild => {
	console.log(`Nuevo guild: ${guild.name} (id: ${guild.id}). Este guild tiene ${guild.memberCount} miembros.`);
	client.user.setActivity(process.env.GAME, { type: 'WATCHING' })
	.then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
	.catch(console.error);
	

});


client.on("guildDelete", guild => {
	console.log(`Quitado de guild: ${guild.name} (id: ${guild.id})`);
	client.user.setGame(process.env.GAME);		
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
	
//admins no necesitan el rol

if (!message.member.hasPermission("BAN_MEMBERS"))
			return 0;

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





//   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   //   COMANDOS   




client.on("message", async message => {
	const args = message.content.slice(1).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const argsM = message.content.split(' ');





	if (message.content.startsWith("!vel")){
		message.delete();
		vel = args.join(" ");
		setInterval(changeColor, vel);
		message.channel.send("Velocidad seteada a "+vel+". (Menos de 60000 y me ripean el bot)");
	}

	if (message.content.includes("huevo")) {
		message.react(client.emojis.get("537716624296378399"));
	}
	
	if (message.content.startsWith("!huevo")){
		message.delete();
		const ayy = client.emojis.get("537716624296378399");
		message.channel.send(`¿y el ${ayy}?`);
	}



	if (message.content.startsWith("!nick")){
		if (!message.member.hasPermission("BAN_MEMBERS"))
			return 0;
		let member = message.mentions.members.first();
		user = member.user.username;
		let nick = args.slice(1).join(' ');
		member.setNickname(nick);
		message.channel.send(`${user} ahora se llama ${nick}`);
	}

	if (message.content.startsWith("!say")){
		if (!message.member.hasPermission("BAN_MEMBERS"))
			return 0;
		const sayMessage = args.join(" ");
		message.delete().catch(O_o => {
		});
		message.channel.send(sayMessage);
	}
	
	
	
	if (message.content.startsWith("!tts")){
		if (!!message.member.hasPermission("BAN_MEMBERS"))
			return 0;
		const sayMessage = args.join(" ");
		message.delete().catch(O_o => {
		});

		message.channel.send(sayMessage, { tts: true });
	}
	
	
	
	
	// BIG 

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
		const sayMessage = args.join(" ");
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
	
	
	
	//BIG
	
	
	if (message.content.startsWith("!kick")){
		if (!message.member.hasPermission("BAN_MEMBERS"))
			return 0;
		let member = message.mentions.members.first();
		if (!member)
			return message.reply("Arrobá al usuario.");
		if (!member.kickable)
			return message.reply("No se pudo kickear al usuario.");
		let reason = args.slice(1).join(' ');
		if (!reason)
			return message.reply("No ingresaste una razón.");
		await member.kick(reason)
		.catch(error => message.reply(`${message.author} no se pudo kickear. Error: ${error}.`));
		message.channel.send(`<@${message.author.id}> kickeó a <@${member.user.id}> por: ${reason}.`);
	}
	if (message.content.startsWith("!mute")){
		if (!message.member.hasPermission("BAN_MEMBERS"))
			return 0;
		let member = message.mentions.members.first();
		if (!member)
			return message.reply("Arrobá al usuario.");
		member.addRole('537712385109262346');
		message.channel.send(`<@${member.user.id}> fue muteado por <@${message.author.id}>.`);
	}
	if (message.content.startsWith("!unmute")){
		if (!message.member.hasPermission("BAN_MEMBERS"))
			return 0;
		let member = message.mentions.members.first();
		if (!member)
			return message.reply("Arrobá al usuario.");
		member.removeRole('537712385109262346');
		message.channel.send(`<@${message.author.id}> desmuteo a <@${member.user.id}>.`);
	}
	if (message.content.startsWith("!ban")){

		if (!message.member.hasPermission("BAN_MEMBERS"))
			return 0;
		let member = message.mentions.members.first();
		if (!member)
			return message.reply("Arrobá al usuario.");
		if (!member.bannable)
			return message.reply("No se pudo banear al usuario.");
		let reason = args.slice(1).join(' ');
		if (!reason)
			return message.reply("No ingresaste una razón.");
		await member.ban(reason)
		.catch(error => message.reply(`${message.author} no se pudo banear. Error: ${error}`));
		message.channel.send(`<@${message.author.id}> le dio ban a <@${member.user.id}> por: ${reason}.`);
	}
	
	//Si se buggea el bot, para sacarlo del canal de voz.
	if (message.content.startsWith("!quit")){
		message.member.voiceChannel.leave();
		message.delete();
	}

	if (message.content.startsWith("!cc")){

		if (!message.member.hasPermission("BAN_MEMBERS"))
			return 0;
		async function purge() {
			message.delete(); 

			if (isNaN(args[0])) {

				message.channel.send('Pone un número despues del comando.'); 

				return;
			}
			const fetched = await message.channel.fetchMessages({limit: args[0]}); 
            //console.log(fetched.size + ' messages found, deleting...'); 

            message.channel.bulkDelete(fetched);
        }

        purge(); 

    }



    if (message.content.startsWith("!play")){
    	const voiceChannel = message.member.voiceChannel;
    	if (!voiceChannel)
    		return message.channel.send('Metete en en canal de voz, crack!');
    	const permissions = voiceChannel.permissionsFor(message.client.user);
    	if (!permissions.has('CONNECT')) {
    		return message.channel.send('No tengo permisos para entrar a este canal.');
    	}
    	if (!permissions.has('SPEAK')) {
    		return message.channel.send('No tengo permisos para hablar en este canal.');
    	}
    	if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
    		const playlist = await youtube.getPlaylist(url);
    		const videos = await playlist.getVideos();
    		for (const video of Object.values(videos)) {
    			const video2 = await youtube.getVideoByID(video.id); 
    			await handleVideo(video2, message, voiceChannel, true); 
    		}
    		return message.channel.send(`? Playlist: **${playlist.title}** ha sido agregado a la cola!`);
    	} else {
    		try {
    			var video = await youtube.getVideo(url);
    		} catch (error) {
    			try {
    				var videos = await youtube.searchVideos(searchString, 10);
    				let index = 0;
    				message.channel.send(`
    					__**Selecciona el temaiken:**__ \n
    					${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
    					Pone un numero de 1-10.
    					`);

    				try {
    					var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
    						maxMatches: 1,
    						time: 10000,
    						errors: ['time']
    					});
    				} catch (err) {
    					console.error(err);
    					return message.channel.send('Ingresa un valor valido, busqueda cancelada.');
    				}
    				const videoIndex = parseInt(response.first().content);
    				var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
    			} catch (err) {
    				console.error(err);
    				return message.channel.send('No hay resultados.');
    			}
    		}
    		return handleVideo(video, message, voiceChannel);
    	}
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


    if (message.content.startsWith("!rules")){
    	message.channel.send(`Reglas: No ser como Faste`); 
    }




    if (message.content.startsWith("!tmute")){
    	if (!message.member.hasPermission("BAN_MEMBERS"))
    		return 0;		
    	let tomute = message.mentions.members.first();
    	let mutetime = args.slice(1).join(' ');
    	if (!tomute)
    		return message.reply("Arrobá al usuario.");
    	if(!mutetime) return message.reply("Agrega el tiempo despues de la mención!");
    	await(tomute.addRole('537712385109262346'));
    	message.channel.send(`<@${tomute.id}> fue muteado por ${message.author.username} durante: ${ms(ms(mutetime))}`);
    	setTimeout(function(){
    		tomute.removeRole('537712385109262346');
    		message.channel.send(`<@${tomute.id}> ha sido desmuteado!`);
    	}, ms(mutetime));
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
