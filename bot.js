const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const Client = require('node-rest-client').Client;
const restClient = new Client();
//var vel = 4320000000;
var admin = ["Owner", "Admin", "Bunker Support"];
var roles = ["Owner", "Admin", "Bunker Support","Mods"];


//  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  //  START  








client.on("ready", () => {
	
	
	
	console.log();
	console.log("Bot iniciado en ${client.guilds.size} servers.");
	
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
