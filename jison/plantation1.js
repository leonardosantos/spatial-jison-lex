var vec3 = require("mineflayer/node_modules/vec3");
var parser = new require("jison").Parser({
  "bnf": {
    "S"          :[["PLANTATION", "return true;"]],
    "PLANTATION" :[["ENDING FOLLOWED_BY FILLING FOLLOWED_BY ENDING", ""]],
    "ENDING"     :[["log BESIDE log BESIDE log BESIDE log BESIDE log BESIDE log BESIDE log", ""]],
    "FILLING"    :[["FILLING FOLLOWED_BY ROW", ""],
                   ["ROW", ""]],
    "ROW"        :[["log BESIDE PLANTS ASIDE IRRIGATION BESIDE PLANTS ASIDE log", ""]],
    "PLANTS"     :[["PLANT ASIDE PLANT", ""]],
    "PLANT"      :[["farmland UNDER wheat", ""]],
    "IRRIGATION" :[["water", ""]],

    "FOLLOWED_BY": [["", ""]],
    "BESIDE": [["", ""]],
    "ASIDE": [["", ""]],
    "UNDER": [["", ""]],
  }
}, {type: 'slr', onDemandLookahead:false, noDefaultResolve:false});

var lexer = require('../spatial-jison-lex/index.js').lexer;
new lexer(parser,{
  FOLLOWED_BY: vec3(1,0,-6),
  BESIDE: vec3(0,0,1),
  ASIDE: vec3(0,-1,1),
  UNDER: vec3(0,1,0)
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
