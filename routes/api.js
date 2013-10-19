
/*
 * GET home page.
 */

var _ = require('underscore');

module.exports = function(data, fetcher) {

  return  function(req, res){
  	
  	var alles = fetcher.getAll();
	res.end(JSON.stringify(alles, undefined, 2));

  }

};