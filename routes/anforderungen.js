
/*
 * GET home page.
 */
 
module.exports = function(data, fetcher) {

  return  function(req, res){
  
  	var anforderungen = fetcher.getAnforderungen();
	
  var extendedData = data.extend({ title: data.navbar[1].titel, anforderungen: anforderungen });
    res.render('anforderungen', extendedData);
	
  }
  
}