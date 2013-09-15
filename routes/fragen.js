
/*
 * GET home page.
 */

var _ = require('underscore');

module.exports = function(data, fetcher) {

  return  function(req, res){
  	var fragen = fetcher.getFragen(110), extendedData = data.extend({ title: data.navbar[0].titel, fragen: fragen });
	res.render('fragen', extendedData);
  }

};