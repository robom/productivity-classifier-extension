

//var wordCount = function(document) {
//  return document.length;
//};

var freq = function(word,document){
  return _.filter(document, function(wd){ return wd == word; }).length;
};

//var numDocsContaining = function(word,documentList){
//  return _.filter(documentList, function(doc){ return freq(word,doc) > 0; }).length;
//};

//var tf = function(word,document){
//  return freq(word,document)/parseFloat(wordCount(document));
//} ;

//var idf = function(word,documentList){
//  var word_in_doc = parseFloat(numDocsContaining(word,documentList));
//  if (word_in_doc > 0){
//    return parseFloat(Math.log(documentList.length/word_in_doc));
//  }else return -1;
//  // return word_in_doc;
//} ;

var tfidf = function(word, document){
  return (freq(word, document) ); //* idfs[word]);
};

var sqr = function square(x) {
  return x*x;
};

var tfidf_corpus = function(documentList){
  var uniq = find_unique_words(documentList);
  //idfs = calc_idfs(uniq,documentList);
  var tfidfs = {};
  for(var j=0;j<uniq.length;j++){
    tfidfs[uniq[j]] = 0;
    //for(var i=0;i<documentList.length;i++){
    //  cur_tfidf = tfidf(uniq[j], documentList[0]);
      //if (cur_tfidf > 0)
      tfidfs[uniq[j]] += tfidf(uniq[j], documentList[0]);
    //}
  }

  //_.map( tfidfs, function(num){
  //  return Math.sqrt(num);
  //});
  return tfidfs;
};

//var calc_idfs=function(unique_words,documentList){
//  idfs = {}
//  for (i=0;i<unique_words.length;i++){
//    idfs[unique_words[i]]=idf(unique_words[i],documentList);
//  }
//  return idfs;
//};

var find_unique_words = function(corpus){
  var uniq = {};
  for (var i=0; i<corpus.length; i++)
  {
    var len = corpus[i].length;
    for(var j=0;j < len ;j++){
      uniq[corpus[i][j]]='';
    }
  }
  return _.map(uniq, function(num, key){ return key; });
};
