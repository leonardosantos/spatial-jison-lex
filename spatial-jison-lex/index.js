module.exports = {
  lexer: function(parser, position_relations, position_relations_precedence){
    var POS, INPUT, MAP = {};

    var beginners = all_beginners(parser.productions),
        enders = all_enders(parser.productions);

    this.setInput= function(input){
      INPUT = input;
      POS = input.start;
      MAP = {};
    };

    this.lex = function(){
      if(!POS)
        return "$end";
      this.yytext = INPUT.get(POS);
      var token = INPUT.token(POS);
      INPUT.visit(POS);
      MAP[INPUT.key(POS)] = true;
      //console.log(INPUT.token(POS) + " @ " + INPUT.key(POS));
      next_pos();
      return token;
    };

    var generate_is_acceptable = function(p, h){
      return function(next_pos){
        return is_acceptable(next_pos, beginners[parser.productions[p].handle[Number(h)+1]]);
      };
    };

    var next_pos = function(){
      var current_symbol = INPUT.token(POS),
          any = ANY(), changed=false;

      var ordered_position_relations = [];
      if (position_relations_precedence)
        ordered_position_relations = position_relations_precedence;
      else
        for(var r in position_relations)
          ordered_position_relations.push(r);
      for(var r in ordered_position_relations){
        r = ordered_position_relations[r];
        for(var p=0; p < parser.productions.length; p++)
          for(var h=0; h < parser.productions[p].handle.length; h++)
            if(!changed && parser.productions[p].handle[h] == r &&
               enders[parser.productions[p].handle[Number(h)-1]].indexOf(current_symbol) >= 0)
              if(h < parser.productions[p].handle.length - 1){
                var next_pos, locally_acceptable = generate_is_acceptable(p, h);
                if (typeof position_relations[r] == 'function'){
                  next_pos = position_relations[r](POS, locally_acceptable, any);
                }else if (Array.isArray(position_relations[r])){
                  for(var c in position_relations[r]){
                    var candidate = position_relations[r][c].plus(POS);
                    if (locally_acceptable(candidate)){
                      next_pos = candidate;
                      break;
                    }
                  }
                }else{
                  var candidate = position_relations[r].plus(POS);
                  next_pos = locally_acceptable(candidate) && candidate;
                }
                changed=Boolean(next_pos);
                if(changed)
                  POS = next_pos;
              } else {
                // TODO
              }
      }
      if(!changed)
        POS = null;
    };

    var ANY = function(){
      var any = false;
      return any;
    };

    var is_acceptable = function(next_pos, acceptable_symbols){
      return (INPUT.has(next_pos) && !MAP[INPUT.key(next_pos)] &&
              acceptable_symbols.indexOf(INPUT.token(next_pos)) >= 0);
    };

    parser.lexer = this;
    return this;
  }
};

function all_beginners(productions){
    var result = {};
    for(var p in productions)
      for (var h in productions[p].handle)
        if (productions[p].handle[h] &&
            typeof result[productions[p].handle[h]] == 'undefined')
          (result[productions[p].handle[h]] =
           symbol_beginners(productions, productions[p].handle[h]));
    return result;
}

function all_enders(productions){
  var result = {};
    for(var p in productions)
      for (var h = productions[p].handle.length - 1; h >= 0; h--)
        if (productions[p].handle[h] &&
            typeof result[productions[p].handle[h]] == 'undefined')
          (result[productions[p].handle[h]] =
           symbol_enders(productions, productions[p].handle[h]));
  return result;
}

function symbol_beginners(productions, symbol){ // FIRST()
  var beginners_ = [];
  var selected_productions = [];

  for(var p in productions)
    if (productions[p].symbol == symbol)
      selected_productions.push(productions[p]);

  if(selected_productions.length){
    for (p in selected_productions){
      var sub_beginners = [];
      for (var h in selected_productions[p].handle){
        if (selected_productions[p].handle[h] != symbol)
          sub_beginners = sub_beginners.concat(symbol_beginners(productions,
                                               selected_productions[p].handle[h]));
        if (sub_beginners.length)
          break;
      }
      beginners_ = beginners_.concat(sub_beginners);
    }
  } else beginners_.push(symbol);

  return beginners_;
}

function symbol_enders(productions, symbol){ // LAST()
  var enders_ = [];
  var selected_productions = [];

  for(var p in productions)
    if (productions[p].symbol == symbol)
      selected_productions.push(productions[p]);

  if(selected_productions.length){
    for (p in selected_productions){
      var sub_enders = [];
      for (var h = selected_productions[p].handle.length - 1; h >= 0; h--){
        if (selected_productions[p].handle[h] != symbol)
          sub_enders = sub_enders.concat(symbol_enders(productions,
                                               selected_productions[p].handle[h]));
        if (sub_enders.length)
          break;
      }
      enders_ = enders_.concat(sub_enders);
    }
  } else enders_.push(symbol);

  return enders_;
}
