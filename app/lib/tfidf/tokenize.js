var fulltrim = function (wd) {
  return wd.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
}

var remove_punctuations = function (s) {
  return s.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ");
}

//var remove_punctuations = function (s) {
//  var r = s.toLowerCase();
//  r = r.replace(new RegExp("\\s", 'g'), "");
//  r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
//  r = r.replace(new RegExp("æ", 'g'), "ae");
//  r = r.replace(new RegExp("ç", 'g'), "c");
//  r = r.replace(new RegExp("[èéêë]", 'g'), "e");
//  r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
//  r = r.replace(new RegExp("ñ", 'g'), "n");
//  r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
//  r = r.replace(new RegExp("œ", 'g'), "oe");
//  r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
//  r = r.replace(new RegExp("[ýÿ]", 'g'), "y");
//  r = r.replace(new RegExp("\\W", 'g'), "");
//  return r;
//};


var tokenize = function (str) {
  var new_str = str.replace(/\d+/g, '');
  var tokens = remove_punctuations(fulltrim(new_str)).split(/([a-zA-Z\u00C0-\u017F]+|\s[a-zA-Z\u00C0-\u017F]+|\!|\'|\"")/i);
  var tokens2 = _.filter(tokens, function (wd) {
    return (wd != "" && wd != " ");
  });
  tokens2 = tokens2.slice(0, 5000);
  tokens2 = _.map(tokens2, function (wd) {
    return fulltrim(wd)
  });
  return tokens2;
};