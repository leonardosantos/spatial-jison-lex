var vec3 = require("mineflayer/node_modules/vec3");
var parser = new require("jison").Parser({
  "bnf": {
    "S"           :[["HOUSE", "return true;"]],
    "HOUSE"       :[["WALLS AROUND FLOOR UNDER4 ROOF", ""]],
    "WALLS"       :[["X_SIDE DEEPER_BESIDE Z_SIDE DEEPER_FACING X_SIDE DEEPER_BESIDE Z_SIDE", ""]],
    "X_SIDE"      :[["PILLAR DEEPER_BESIDE WALL DEEPER_BESIDE ACCESS DEEPER_BESIDE WALL", ""]],
    "Z_SIDE"      :[["PILLAR DEEPER_FACING WALL DEEPER_FACING ACCESS DEEPER_FACING WALL", ""]],
    "PILLAR"      :[["log ABOVE cobblestone ABOVE cobblestone ABOVE cobblestone ABOVE cobblestone", ""]],
    "WALL"        :[["log ABOVE planks ABOVE planks ABOVE planks ABOVE cobblestone", ""]],
    "ACCESS"      :[["DOOR", ""], ["WINDOW", ""]],
    "DOOR"        :[["log ABOVE planks ABOVE wooden_door ABOVE wooden_door ABOVE cobblestone", ""]],
    "WINDOW"      :[["log ABOVE planks ABOVE glass_pane ABOVE planks ABOVE cobblestone", ""]],
    "FLOOR"       :[["FLOOR_LINE AROUND FLOOR_LINE AROUND FLOOR_LINE", ""]],
    "FLOOR_LINE"  :[["cobblestone AROUND cobblestone AROUND cobblestone", ""]],
    "ROOF"        :[["ROOF_LINE AROUND ROOF_LINE AROUND ROOF_LINE", ""]],
    "ROOF_LINE"   :[["planks AROUND planks AROUND planks", ""]],

    "ABOVE"  :[["", ""]],
    "DEEPER_BESIDE" :[["", ""]],
    "DEEPER_FACING" :[["", ""]],
    "AROUND"   :[["", ""]],
    "UNDER4"  :[["", ""]],
  }
}, {type: 'lalr', onDemandLookahead:false, noDefaultResolve:false});

var lexer = require('../spatial-jison-lex/index.js').lexer;
new lexer(parser,{
  ABOVE: vec3(0,-1,0),
  DEEPER_BESIDE: [vec3(1,4,0), vec3(-1,4,0)],
  DEEPER_FACING: [vec3(0,4,1), vec3(0,4,-1)],
  AROUND: [vec3(0,0,1),vec3(-1,0,0),vec3(0,0,-1),vec3(1,0,0),vec3(1,0,1),vec3(-1,0,1),vec3(-1,0,-1),vec3(1,0,-1)],
  UNDER4: vec3(0,4,0),
}, ['ABOVE', 'DEEPER_FACING', 'DEEPER_BESIDE', 'AROUND', 'UNDER4']);

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
