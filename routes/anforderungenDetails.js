
/*
 * GET home page.
 */
 
module.exports = function(data, fetcher) {

  return  function(req, res){

	var anforderung = fetcher.getDoc(req.params.hash);
	
  var extendedData = data.extend({ title: data.navbar[1].titel, anforderung: anforderung });
  
    res.render('anforderungenDetails', extendedData);
	
  }
  
}