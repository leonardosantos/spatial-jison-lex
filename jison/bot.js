var mineflayer = require("mineflayer");
var vec3 = mineflayer.vec3;
var ss = require('simple-statistics');


var probe_parser = require("./probe");
var parsers = {
  tree: require("./tree"),
  //lamppost: require("./lamppost"),
  plantation1: require("./plantation1"),
  water_well: require("./water_well"),
  house1: require("./house1"),
  house2: require("./house2")
};

var bot = mineflayer.createBot({
  host: process.argv[2] || "localhost",
  port: process.argv[3],
  username: process.argv[4] || "bot"
});

function identify(start){
  var input = new Input(bot, start);
  if (bot.blockAt(vec3(middle(start))).name != 'air')
    if(probe_parser.parse(input))
      for (var p in parsers)
        if(parsers[p].parse(input))
          return p;
  return null;
}

function scan(range){
  var result = [];
  var bot_pos = bot.entity.position.floor();
  range = range || 20;
  for(var y=-range; y<=range; y++)
      for(var z=-range; z<=range; z++)
        for(var x=-range; x<=range; x++){
          var pos = bot_pos.plus(vec3(x, y, z));
          var obj = identify(pos);
          if(obj)
            result.push({obj:obj, pos:pos});
        }
  return result;
}

bot.on('chat', function(username, message) {
  if (username === bot.username) return;
  var args = message.split(' ');

  if(args[0] == 'whatis')
    try{
      var start = vec3({x: Number(args[1]), y: Number(args[2]), z: Number(args[3])});
      bot.chat("it is "+bot.blockAt(vec3(middle(start))).name);
    }catch(e){
      bot.chat('i dont know');
      console.log(e);
    }
  else if(args[0] == 'parse')
    try{
      var start = vec3({x: Number(args[1]), y: Number(args[2]), z: Number(args[3])});
      bot.lookAt(start);
      var obj = identify(start);
      if(obj)
        bot.chat('its a ' + obj);
      else
        bot.chat('i dont know');
    }catch(e){
      bot.chat('=/');
      console.log(e);
    }
  else if(args[0].indexOf('test')==0)
    try{
      var start = vec3({x: Number(args[2]), y: Number(args[3]), z: Number(args[4])});
      bot.lookAt(start);
      var obj = identify(start);
      var n = Number(args[1] || 100);
      var cmd = args[0].replace('test', '');
      var input = new Input(bot, start);
      var times = [];
      for(var i=0; i < n; i++){
        console.log(i);
        var begin = new Date().getTime();
        if(cmd == '1')
          parsers[args[5]].parse(input);
        else if(cmd == '2')
          identify(start);
        else if(cmd == '3')
          scan(Number(args[2]));
        times.push(new Date().getTime() - begin);
      }
      var stats = {
          mean: ss.mean(times),
          standard_deviation: ss.standard_deviation(times)
      };
      console.log(args, stats);
      bot.chat(JSON.stringify(stats));
    }catch(e){
      bot.chat('=/');
      console.log(e);
    }
  else if(args[0] == 'scan'){
    bot.chat('scanning..');
    var items = scan();
    for (var i in items)
      bot.chat('i see a ' + items[i].obj + ' @ ' + pos2str(items[i].pos));
    bot.chat('done');
  }
});

function middle(pos){
  return {
    x: pos.x + 0.5,
    y: pos.y + 0.5,
    z: pos.z + 0.5
  };
}

function Input(bot, start){
  this.start = start;

  this.has = function(pos){
    return true;//bot.blockAt(vec3(middle(pos))).hardness;
  };

  this.get = function(pos){
    return this.has(pos)?bot.blockAt(vec3(middle(pos))).name:null;
  };

  this.visit = function(pos){
    //bot.dig(bot.blockAt(vec3(middle(pos))));
  };

  this.token = this.get;

  this.key = pos2str;
}


function pos2str(pos){
  return [pos.x, pos.y, pos.z].toString();
}
