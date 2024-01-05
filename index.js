const Snake = require('./snake');
const Parser = require('./parser');
const Convo = require('./parser');
const http = require('http')
const fs = require('fs')

const Discord = require('discord.js');
const myIntents = new Discord.Intents(8);
myIntents.add(
 Discord.Intents.FLAGS.GUILD_PRESENCES,
 Discord.Intents.FLAGS.GUILD_MESSAGES,
 Discord.Intents.FLAGS.GUILD_MEMBERS,
 Discord.Intents.FLAGS.GUILDS,
 Discord.Intents.FLAGS.GUILD_BANS,
 Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
 Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
 Discord.Intents.FLAGS.GUILD_INTEGRATIONS 
 );
const client = new Discord.Client({ intents: myIntents });

const parse = new Parser()
const convo = new Convo()
games = new Map()
var cleaningChannel;
var cleaningCount=0
var tester = false
var isStuck=false
var isOn=false
var activity=120
var counterActions = 0
var debug = false

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' })
  fs.createReadStream('index.html').pipe(res)
})

server.listen(8080)

client.on('messageReactionAdd', (reaction, user) => {
  console.log(reaction)
  try{
  if(user.id!=reaction.message.author.id){
    if (games.get(user.username)){
      game = games.get(user.username)
      if (reaction.message===game.displayMessage) {
       if (reaction.emoji.name=="⬆️") {
            if (game.lastLetter != 's') {
                game.lastLetter = 'w'
                game.gameTick("up", reaction.message);
            }
        }
        if (reaction.emoji.name=="⬅️") {
            if (game.lastLetter != 'd') {
                game.lastLetter = 'a'
                game.gameTick("left", reaction.message);
            }
        }
        if (reaction.emoji.name=="⬇️") {
            if (game.lastLetter != 'w') {
                game.lastLetter = 's'
                game.gameTick("down", reaction.message);
            }
        }
        if (reaction.emoji.name=="➡️") {
            if (game.lastLetter != 'a') {
                game.lastLetter = 'd'
                game.gameTick("right", reaction.message);
            }
        }
    }
  }
  }

  }catch{
  
  }

});

client.on("messageCreate", (message) => {try{

  let aboutNecro = false

  if(message.content.toLowerCase().includes("butter")){
    aboutNecro=true
  }

  try{
    let user = client.users.cache.find(user => user.username == message.content.split(" ").shift().join(' '))
    message.guild.members.fetch(user.id).then(member => {
      if(member.roles.cache.some(role => role.name === 'Necromancy')){
        aboutNecro=true
      };
      everything(message,aboutNecro)
    })

  }catch(error){
    everything(message,aboutNecro)
  }
  // console.log(message)
    
}catch{

}

});


function everything(message, aboutNecro){
  if(message.author.username=="Thyme" && message.content.toLowerCase().startsWith("!overide")){
      message.delete()
      setTimeout(() => process.abort(), 1000)
    }
    if(message.author.username=="Thyme" && message.content.toLowerCase().startsWith("!debug")){
      message.delete()
      debug=true
    }
    if(message.author.username=="Thyme" && message.content.toLowerCase().startsWith("!undebug")){
      message.delete()
      debug=false
    }
    if(message.author.username=="Thyme" && message.content.toLowerCase().startsWith("!test452")){
      if(tester){
         message.channel.send("The program has stayed up since the last time")
      }else{
        message.channel.send("It has gone down")
      }
      message.delete()
      tester=true
    }
    if(message.author.username!="Necromancy's Roomba Snek"){
    if(message.content.toLowerCase().startsWith("!help")){
      message.channel.send("!snek (you can add parameters by typing control mode: display mode: or size: then typing immeditelly after it an appropriate parameter. For control mode you can enter either reaction or message, for display mode you can enter either newMessage, or editMessage, for size you can enter any number)\n!power on\n!power off\n !unstuck\nAttacks (type a command then someone to attack them):\n- !stab\n- !knife\n-  !dagger\n- !shoot\n- !gun")
    }
    if (message.content.toLowerCase().includes("!hi")||message.content.includes("!hello")) {
       possibleStatements = [
        "hello :]",
        "hello!",
        "hello, " + message.author.username,
        "hi :]",
        "hi!",
        "hi, "+ message.author.username+ "!"]

        var num = Math.floor(Math.random()*possibleStatements.length)
        console.log(possibleStatements[num])
        message.channel.send(possibleStatements[num])
    }
    if(message.content.toLowerCase().startsWith("!power on")){
      if(!isOn){
        isOn=true
        activity=500
        cleaningChannel = message.channel
        beginCleaning()
      }else{
        message.channel.send("This roomba is already on somewhere")
      }
      
    }
     if(message.content.toLowerCase().startsWith("!power off")){
      isOn=false
      activity=100000000000000000
      message.channel.send("Shutting down :[")
    }
    if(message.content.toLowerCase().startsWith("!unstuck")){
      if(isStuck){
        unstuck()
      }
      else{
        message.channel.send("I was already unstuck")
      }
    }

    if(message.content.toLowerCase().startsWith("!shoot")){
      if(canAttack(message)){
      if(message.content.split("!shoot ")[1]){
        if(!(message.member.roles.cache.some(role => role.name === 'Necromancy')) ||message.content.toLowerCase().includes("thyme") || message.content.toLowerCase().includes("thy.me")){
          message.channel.send("No")
        }else{
          message.channel.send( message.content.split("!shoot ")[1]+" 🔫")
        }
      }else{
        message.channel.send("🔫 ")
      }
      }
    }
    if(message.content.toLowerCase().startsWith("!gun")){
      if(canAttack(message)){
      if(message.content.split("!gun ")[1]){
        if(aboutNecro || !(message.member.roles.cache.some(role => role.name === 'Necromancy')) ||message.content.toLowerCase().includes("thyme") || message.content.toLowerCase().includes("thy.me")){
          message.channel.send("No")
        }else{
        message.channel.send(message.content.split("!gun ")[1]+" 🔫")
        }
      }else{
        message.channel.send("🔫 ")
      }
      }
    }
    if(message.content.toLowerCase().startsWith("!knife")){
      if(canAttack(message)){
      if(message.content.split("!knife ")[1]){
        if(aboutNecro || !(message.member.roles.cache.some(role => role.name === 'Necromancy')) ||message.content.toLowerCase().includes("thyme") || message.content.toLowerCase().includes("thy.me")){
          message.channel.send("No")
        }else{
        message.channel.send("🔪 " + message.content.split("!knife ")[1])
        }
      }else{
        message.channel.send("🔪 ")
      }
      }
    }
    if(message.content.toLowerCase().startsWith("!stab")){
      if(canAttack(message)){
      if(message.content.split("!stab ")[1]){
        if(aboutNecro || !(message.member.roles.cache.some(role => role.name === 'Necromancy')) ||message.content.toLowerCase().includes("thyme") || message.content.toLowerCase().includes("thy.me")){
          message.channel.send("No")
        }else{
        message.channel.send("🔪 " + message.content.split("!stab ")[1])
        }
      }else{
        message.channel.send("🔪 ")
      }
      }
    }
    if(message.content.toLowerCase().startsWith("!dagger")){
      if(canAttack(message)){
      if(message.content.split("!dagger ")[1]){
        if(aboutNecro || !(message.member.roles.cache.some(role => role.name === 'Necromancy')) ||message.content.toLowerCase().includes("thyme") || message.content.toLowerCase().includes("thy.me")){
          message.channel.send("No")
        }else{
        message.channel.send(message.content.split("!dagger ")[1]+" 🗡️")
        }
      }else{
        message.channel.send("🗡 ")
      }
      }
    }
    if (message.content.toLowerCase().startsWith("!snek") && !games.get(message.author.username)) {
        console.log(games)
        console.log(message.content)
        var size = parse.getSize(message)
        var displayMode = parse.getDisplayMode(message)
        var controlMode = parse.getControlMode(message)
        games.set(message.author.username, new Snake(message.author.username, size, controlMode, displayMode))
        game = games.get(message.author.username)
        game.lastLetter = 'w'
        game.gameTick("up", message, game);
    }

    if (games.get(message.author.username)) {
        game = games.get(message.author.username)
        if (message.content.toLowerCase().charAt(0) == 'w') {
            if (game.lastLetter != 's') {
                game.lastLetter = 'w'
                game.gameTick("up", message);
            }
        }
        if (message.content.toLowerCase().charAt(0) == 'a') {
            game = games.get(message.author.username)
            if (game.lastLetter != 'd') {
                game.lastLetter = 'a'
                game.gameTick("left", message);
            }
        }
        if (message.content.toLowerCase().charAt(0) == 's') {
            game = games.get(message.author.username)
            if (game.lastLetter != 'w') {
                game.lastLetter = 's'
                game.gameTick("down", message);
            }
        }
        if (message.content.toLowerCase().charAt(0) == 'd') {
            game = games.get(message.author.username)
            if (game.lastLetter != 'a') {
                game.lastLetter = 'd'
                game.gameTick("right", message);
            }
        }
        if (message.content.toLowerCase().charAt(1) == 'w') {
            game = games.get(message.author.username)
            if (game.lastLetter != 's') {
                game.lastLetter = 'w'
                game.gameTick("up", message);
            }
        }
        if (message.content.toLowerCase().charAt(1) == 'a') {
            game = games.get(message.author.username)
            if (game.lastLetter != 'd') {
                game.lastLetter = 'a'
                game.gameTick("left", message);
            }
        }
        if (message.content.toLowerCase().charAt(1) == 's') {
            game = games.get(message.author.username)
            if (game.lastLetter != 'w') {
                game.lastLetter = 's'
                game.gameTick("down", message);
            }
        }
        if (message.content.toLowerCase().charAt(1) == 'd') {
            game = games.get(message.author.username)
            if (game.lastLetter != 'a') {
                game.lastLetter = 'd'
                game.gameTick("right", message);
            }
        }
        if (message.content.toLowerCase().startsWith("!restart") || message.content.startsWith("!stop")) {
            game = games.get(message.author.username)
            games.delete(game.id);
            console.log("Game Stopped");
            message.channel.send("**Game Stopped!**");
        }
        if (game.displayMode == "editMessage") {
            message.delete()
        }
    }
    }
}

client.login(process.env['token']);

function clean(){
  cleaningCount++
  var state=Math.floor(Math.random()*100)
  if(cleaningCount>8 ||state<10){
    doneCleaning()
    //finish cleaning
  }else if(state<55){
    stuck()
    //stuck
  }else{
    //continue cleaning
    continueCleaning()
  }

}

function stuck(){
  isStuck=true
  console.log("stuck")
  possibleStatements = [
  "Oh no! I'm trapped :[ please use !unstuck to get me out!",
  "Uh oh! I'm stuck in this corner. Can you please get me out with !unstuck?",
  "spin spin spin spin spin I can't spin my way out of here! Can someone help me by using !unstuck"]
  var num = Math.floor(Math.random()*possibleStatements.length)
  console.log(possibleStatements[num])
  cleaningChannel.send(possibleStatements[num])
}

function unstuck(count){
  isStuck=false
  console.log("unstuck")
  possibleStatements = [
  "Thanks!",
  "Thank you :]"]
  var num = Math.floor(Math.random()*possibleStatements.length)
  console.log(possibleStatements[num])
  cleaningChannel.send(possibleStatements[num])
  var time = (Math.random()*2*1500+2*750)*activity;
  setTimeout(clean,time);
}

function beginCleaning(channel){
  possibleStatements = [
    "hello! I am here to clean up the chat :]",
    "I'm going to clean the chat now :]",
    "Starting cleaning process!",
    "It's time for me to clean!"
  ]
  var num = Math.floor(Math.random()*possibleStatements.length)
  console.log(possibleStatements[num])
  cleaningChannel.send(possibleStatements[num])
  var time = (Math.random()*2*1500+2*750)*activity
  if(debug){
    cleaningChannel.send(time.toString());
  }
  setTimeout(clean,time);
}

function continueCleaning(count,channel){
  console.log("continueCleaning")
  possibleStatements = [
  "room vroom",
  "spins around",
  "let me clean up this dust for you :]",
  "(runs into a wall) AAAAAAAAAAA",
  "(bumps into a chair) aaaaaaaAAAAAAAAAA",
  "(hits a door) OW! ow ow ow ow ow",
  "(bumps into a wall) AAGH! not AGAIN",
  "beep beep!",
  "coming through!",
  "excuse me!"]
  var num = Math.floor(Math.random()*possibleStatements.length)
  console.log(possibleStatements[num])
  cleaningChannel.send(possibleStatements[num])
  var time = (Math.random()*2*1500+2*750)*activity
  if(debug){
    cleaningChannel.send(time.toString());
  }
  setTimeout(clean,time);
}

function doneCleaning(channel){
  console.log("doneCleaning")
  possibleStatements = [
  "All done cleaning!",
  "I'm finished cleaning :]",
  ]
  var num = Math.floor(Math.random()*possibleStatements.length)
  console.log(possibleStatements[num])
  cleaningChannel.send(possibleStatements[num])
  var time = (Math.random()*2*1500+4*1500)*activity
  if(debug){
    cleaningChannel.send(time.toString());
  }
  console.log(time)
  setTimeout(beginCleaning,time);
}

function canAttack(message){
   if(message.member.roles.cache.some(role => role.name == 'Necromancy')){
     return true
   }else{
     message.channel.send("No, Weapons are only for Necromancy")
     return false
   }
}