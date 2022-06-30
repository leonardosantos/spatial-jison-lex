var vec3 = require('mineflayer/node_modules/vec3');
var parser = new require("jison").Parser({
  "bnf": {
    "S"      :[["TREE", "return true;"]],
    "TREE"   :[["STALK AROUND_UP TREETOP", ""]],
    "STALK"  :[["STALK GO_UP log", ""],
               ["log", ""]],
    "TREETOP":[["TREETOP AROUND_UP leaves", ""],
               ["leaves", ""]],

    "GO_UP": [["", ""]],
    "AROUND_UP": [["", ""]],
  }
}, {type: 'slr', onDemandLookahead:false, noDefaultResolve:false});

var lexer = require('../spatial-jison-lex/index.js').lexer;
new lexer(parser,{
  GO_UP: vec3(0,1,0),
  AROUND_UP: function(pos, is_acceptable, any){
    for(var y=0; y<=2; y++)
      for(var z=-2; z<=2; z++)
        for(var x=-2; x<=2; x++){
          var next_pos = {
            x: pos.x+x,
            y: pos.y+y,
            z: pos.z+z
          };
          if (is_acceptable(next_pos))
            return next_pos;
      }
    return null;
  }
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