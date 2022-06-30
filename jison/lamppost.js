var parser = new require("jison").Parser({
  "bnf": {
    "S"        :[["LAMPPOST", "return true;"]],
    "LAMPPOST" :[["BODY GO_UP HEAD", ""]],
    "BODY"     :[["BODY GO_UP fence", ""],
                 ["fence", ""]],
    "HEAD"     :[["cloth AROUND torch", ""]],

    "GO_UP": [["", ""]],
    "AROUND": [["", ""]],
  }
}, {type: 'slr', onDemandLookahead:false, noDefaultResolve:false});

var lexer = require('../spatial-jison-lex/index.js').lexer;
new lexer(parser,{
  GO_UP: function(pos, is_acceptable, any){
    var next_pos = {
      x: pos.x,
      y: pos.y + 1,
      z: pos.z
    };
    return is_acceptable(next_pos)?next_pos:null;
  },
  AROUND: function(pos, is_acceptable, any){
    for(var z=-1; z<=1; z++)
      for(var x=-1; x<=1; x++){
        var next_pos = {
          x: pos.x+x,
          y: pos.y,
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
