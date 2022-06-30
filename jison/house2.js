var vec3 = require("mineflayer/node_modules/vec3");
var parser = new require("jison").Parser({
  "bnf": {
    "S"           :[["HOUSE", "return true;"]],
    "HOUSE"       :[["WALLS NEAR ROOF ABOVE FLOOR", ""]],
    "WALLS"       :[["X_SIDE LOW_BESIDE Z_SIDE LOW_FACING X_SIDE LOW_BESIDE Z_SIDE", ""]],
    "X_SIDE"      :[["PILLAR BESIDE WALL BESIDE ACCESS BESIDE WALL", ""],
                    ["PILLAR BESIDE WALL BESIDE WALL", ""],
                    ["PILLAR BESIDE ACCESS BESIDE WALL", ""]],
    "Z_SIDE"      :[["PILLAR FACING WALL FACING ACCESS FACING WALL", ""],
                    ["PILLAR FACING WALL FACING WALL", ""],
                    ["PILLAR FACING ACCESS FACING WALL", ""]],
    "PILLAR"      :[["cobblestone UNDER log UNDER log UNDER log", ""]],
    "WALL"        :[["cobblestone UNDER planks UNDER planks UNDER planks UNDER log", ""]],
    "ACCESS"      :[["DOOR", ""], ["WINDOW", ""]],
    "DOOR"        :[["cobblestone UNDER wooden_door UNDER wooden_door UNDER planks UNDER log", ""]],
    "WINDOW"      :[["cobblestone UNDER planks UNDER glass_pane UNDER planks UNDER log", ""]],
    "ROOF"        :[["log NEAR ROOF", ""],
                    ["log", ""]],
    "FLOOR"       :[["dirt NEAR FLOOR", ""],
                    ["dirt", ""]],

    "UNDER"      :[["", ""]],
    "BESIDE"     :[["", ""]],
    "FACING"     :[["", ""]],
    "LOW_BESIDE" :[["", ""]],
    "LOW_FACING" :[["", ""]],
    "NEAR"       :[["", ""]],
    "ABOVE"      :[["", ""]],
  }
}, {type: 'lalr', onDemandLookahead:false, noDefaultResolve:false});

var lexer = require('../spatial-jison-lex/index.js').lexer;
new lexer(parser,{
  UNDER: vec3(0,1,0),
  BESIDE: [vec3(1,-4,0), vec3(-1,-4,0)],
  FACING: [vec3(0,-4,1), vec3(0,-4,-1)],
  LOW_BESIDE: [vec3(1,-3,0), vec3(-1,-3,0)],
  LOW_FACING: [vec3(0,-3,1), vec3(0,-3,-1)],
  NEAR: [vec3(0,0,1),vec3(-1,0,0),vec3(0,0,-1),vec3(1,0,0),vec3(1,0,1),vec3(-1,0,1),vec3(-1,0,-1),vec3(1,0,-1)],
  ABOVE: vec3(0,-4,0),
}, ['UNDER', 'LOW_FACING', 'LOW_BESIDE', 'FACING', 'BESIDE', 'NEAR', 'ABOVE']);

module.exports = {
  parse: function(input){
    try{
      parser.parse(input);
      return true;
    }catch(e){
      return false;
    }
  }
};
