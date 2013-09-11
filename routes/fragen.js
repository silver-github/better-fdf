
/*
 * GET home page.
 */
 
module.exports = function(data, fetcher) {

  return  function(req, res){
  

  var fragen = fetcher.getFragen();
  
  var extendedData = data.extend({ title: data.navbar[0].titel, fragen: fragen });
  
    res.render('fragen', extendedData);
	
  }

};