var vec3 = require("mineflayer/node_modules/vec3");
var parser = new require("jison").Parser({
  "bnf": {
    "S"            :[["WELL", "return true;"]],
    "WELL"         :[["BORDER HIGH_BESIDE BODY", ""]],
    "BORDER"       :[["X_EDGE BESIDE Z_EDGE FACING X_EDGE BESIDE Z_EDGE", ""]],
    "X_EDGE"       :[["gravel BESIDE gravel BESIDE gravel BESIDE gravel BESIDE gravel", ""]],
    "Z_EDGE"       :[["gravel FACING gravel FACING gravel FACING gravel FACING gravel", ""]],
    "BODY"         :[["X_SIDE HIGH_BESIDE Z_SIDE HIGH_FACING X_SIDE HIGH_BESIDE Z_SIDE AROUND CORE UNDER ROOF", ""]],
    "X_SIDE"       :[["CORNER LOW_BESIDE ACCESS LOW_BESIDE ACCESS", ""]],
    "Z_SIDE"       :[["CORNER LOW_FACING ACCESS LOW_FACING ACCESS", ""]],
    "CORNER"       :[["fence ABOVE fence ABOVE cobblestone ABOVE cobblestone", ""]],
    "ACCESS"       :[["cobblestone ABOVE cobblestone", ""]],
    "CORE"         :[["water BESIDE water FACING water BESIDE water", ""]],
    "ROOF"         :[["cobblestone NEAR cobblestone NEAR cobblestone NEAR cobblestone NEAR " +
                      "cobblestone NEAR cobblestone NEAR cobblestone NEAR cobblestone NEAR " +
                      "cobblestone NEAR cobblestone NEAR cobblestone NEAR cobblestone NEAR " +
                      "cobblestone NEAR cobblestone NEAR cobblestone NEAR cobblestone", ""]],

    "BESIDE"       :[["", ""]],
    "FACING"       :[["", ""]],
    "HIGH_BESIDE"  :[["", ""]],
    "HIGH_FACING"  :[["", ""]],
    "LOW_BESIDE"   :[["", ""]],
    "LOW_FACING"   :[["", ""]],
    "ABOVE"        :[["", ""]],
    "ABOVE4"       :[["", ""]],
    "ABOVE3"       :[["", ""]],
    "AROUND"       :[["", ""]],
    "UNDER"        :[["", ""]],
    "NEAR"         :[["", ""]],
  }
}, {type: 'lalr', onDemandLookahead:false, noDefaultResolve:false});

var lexer = require('../spatial-jison-lex/index.js').lexer;
new lexer(parser,{
  BESIDE: [vec3(1,0,0), vec3(-1,0,0)],
  FACING: [vec3(0,0,1), vec3(0,0,-1)],
  HIGH_BESIDE: [vec3(1,3,0), vec3(-1,3,0)],
  HIGH_FACING: [vec3(0,3,1), vec3(0,3,-1)],
  LOW_BESIDE: [vec3(1,1,0), vec3(-1,1,0)],
  LOW_FACING: [vec3(0,1,1), vec3(0,1,-1)],
  ABOVE: vec3(0,-1,0),
  ABOVE4: vec3(0,-4,0),
  ABOVE3: vec3(0,-3,0),
  AROUND: vec3(1,0,0),
  UNDER: vec3(0,4,0),
  NEAR: [vec3(1,0,1), vec3(0,0,1),vec3(-1,0,1),vec3(-1,0,0),vec3(-1,0,-1),vec3(0,0,-1),vec3(1,0,-1),vec3(1,0,0)],
});

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
