
/*
 * GET home page.
 */
 
module.exports = function(data, fetcher) {

  return  function(req, res){

    var frage = fetcher.getDoc(req.params.hash);
  var extendedData = data.extend({ title: data.navbar[0].titel, frage: frage });
  
    res.render('fragenDetails', extendedData);
	
  }

};