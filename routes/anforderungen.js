
/*
 * GET home page.
 */

var _ = require('underscore');

module.exports = function(data, fetcher) {

  return  function(req, res){
  	var anforderungen = fetcher.getAnforderungen(200);

  	for(var themaID in anforderungen) {

  		anforderungen[themaID].anforderungenByDatum = _.groupBy(anforderungen[themaID].anforderungen, function(anforderung) {

				var date = new Date(anforderung.timestamp*1000);
				// hours part from the timestamp
				var month = date.getMonth() + 1;
				// minutes part from the timestamp
				var year = date.getFullYear();
				// seconds part from the timestamp
				var date = date.getDate();

				// will display time in 10:30:23 format
				return date + '.' + month + '.' + year;

  		});

  	}

  	var extendedData = data.extend({ title: data.navbar[1].titel, anforderungen: anforderungen });

	res.render('anforderungen', extendedData);

  }
  
}