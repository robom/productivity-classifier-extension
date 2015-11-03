// if ($(selector).exists()) {
//     // Do something
// }
jQuery.fn.exists = function () {
  return this.length > 0;
}


// get text nodes 
// pass in an element
// eg: var corpus  = getTextNodesIn('div').text();
var getTextNodesIn = function (el) {
  var texts = $(el).contents().filter(function () {
    return this.nodeType == 3;
  });
  //if (texts.length < 5){
  var node_texts = $(el).contents().filter(function () {
      return this.nodeType == 1;
    });
  //}
  return $.merge(texts, node_texts)
};

var accentsTidy = function (s) {
  var r = s.toLowerCase();
  r = r.replace(new RegExp("\\s", 'g'), "");
  r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
  r = r.replace(new RegExp("æ", 'g'), "ae");
  r = r.replace(new RegExp("ç", 'g'), "c");
  r = r.replace(new RegExp("[èéêë]", 'g'), "e");
  r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
  r = r.replace(new RegExp("ñ", 'g'), "n");
  r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
  r = r.replace(new RegExp("œ", 'g'), "oe");
  r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
  r = r.replace(new RegExp("[ýÿ]", 'g'), "y");
  r = r.replace(new RegExp("\\W", 'g'), "");
  return r;
};

var analyze_web_text = function (corpus) {
  var tfidfs = tfidf_corpus(prepare_docs(prepare_corpus(corpus)));
  s = sortObj(tfidfs).slice(0, 100);
  return s;
};

var prepare_doc = function (document_string) {
  // tokenize
  var tokens = tokenize(document_string.toLowerCase().replace(/[^a-z]/, " "));
  //console.log(tokens)

  // remove numbers & stem
  // tokens = _.map(tokens, function(wd){ return stemmer(accentsTidy(wd).replace(/\d+/g, '')); });
  //tokens = _.map(tokens, function (wd) {
  //  return wd.replace(/\d+/g, '');
  //});
  //console.log(tokens)

  // remove words that are too long
  tokens = _.filter(tokens, function (wd) {
    return (wd.length < 10 && wd.length > 2);
  });

  //remove stop words
  //tokens = removeStopWords(tokens);
  return tokens;
};

var prepare_docs = function (docs) {
  var prepped = _.map(docs, function (doc) {
    return prepare_doc(doc)
  });
  return prepped;
}

var prepare_corpus = function (str) {
  // split into sentences
  // splitted_by_sentence = str.split(/[.|!|?][\s|\r\n|\r|\n]+/gi);
  //splitted_by_sentence = str.split(/[.|!|?](\s|\r|\r\n|\n)+/gi);
  return [str];
}


