
/*
 * GET home page.
 */

var _ = require('underscore');

module.exports = function(data, fetcher) {

  return  function(req, res){
  	var anforderungen = fetcher.getAnforderungen(110), extendedData = data.extend({ title: data.navbar[1].titel, anforderungen: anforderungen });
	res.render('anforderungen', extendedData);
  }
  
}