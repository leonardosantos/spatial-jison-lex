var parser = new require("jison").Parser({
  "bnf": {
    "S"     :[["PAIR", "return true;"]],
    "PAIR"  :[["BLOCK SURROUNDING BLOCK", ""]],
    "BLOCK" :[["cobblestone", ""],
              ["log", ""],
              ["planks", ""],
              ["gravel", ""],
              ["fence", ""]],

    "SURROUNDING": [["", ""]],
  }
}, {type: 'slr', onDemandLookahead:false, noDefaultResolve:false});

var lexer = require('../spatial-jison-lex/index.js').lexer;
new lexer(parser,{
  SURROUNDING: function(pos, is_acceptable, any){
    for(var y=-1; y<=1; y++)
      for(var z=-1; z<=1; z++)
        for(var x=-1; x<=1; x++){
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
