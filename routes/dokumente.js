
/*
 * GET home page.
 */

var _ = require('underscore');

module.exports = function(data, fetcher) {

  return  function(req, res){

  	var dokumente = fetcher.getDokumente();

   	for(var themaID in dokumente) {

  		dokumente[themaID].dokumenteByVersion = _.groupBy(dokumente[themaID].dokumente, function(dokument) {
				return dokument.version;
  		});

  	}

  	var extendedData = data.extend({ title: data.navbar[2].titel, dokumente: dokumente });

	res.render('dokumente', extendedData);

  }
  
}