var request = require('request'), async = require('async'), cheerio = require('cheerio'), _ = require('underscore'), events = require('events'), crypto = require('crypto');

module.exports = (function() {
	
	var currentData = [], eventEmitter = new events.EventEmitter();

	var urls = {
		fragen: 'http://fdf.vdew.net/wysvde/dataforum.nsf/vwFrage',
		anforderungen: 'http://fdf.vdew.net/wysvde/dataforum.nsf/vwAnforderung',
		dokumente: 'http://fdf.vdew.net/wysvde/dataforum.nsf/vwDokument'
	}

	var checkString = function(text) {

		var array = {"\r":"<br>", "\t":"&emsp;"}

		for (var val in array)
			text = text.replace(new RegExp(val, "g"), array[val]);

		return text;

	}

	var checkForUpdates = function() {

		eventEmitter.emit('startFetching');

		async.parallel([function(callback) {

			request({ uri: urls.fragen, method: 'GET', encoding: 'binary' }, function(err, response, body) {

				if(err) { callback(err); return; }

				var $ = cheerio.load(body), parallelStack = [];

				eventEmitter.emit('urlFetched', urls.fragen);

				$('.cat').each(function() {

					var url = $(this).attr('href'), betterUrl = 'http://fdf.vdew.net' + url;

					parallelStack.push(function(callback) {

						request({ uri: betterUrl, method: 'GET', encoding: 'binary' }, function(err, response, body) {

							if(err) { callback(err); return; }

								var $ = cheerio.load(body), parallelStack = [];
			
								eventEmitter.emit('urlFetched', betterUrl);

								$('td[width="464"] a').each(function() {

									var url = $(this).attr('href'), betterUrl = 'http://fdf.vdew.net' + url;

									if(url.substring(0,22) == '/wysvde/dataforum.nsf/') {
										parallelStack.push(function(callback) {

											request({ uri: betterUrl, method: 'GET', encoding: 'binary' }, function(err, response, body) {

												if(err) { callback(err); return; }

												var $ = cheerio.load(body), entry = {};

												eventEmitter.emit('urlFetched', betterUrl);

												entry.type 				= 'frage';
												entry.thema 			= checkString($('input[name="Thema"]').val());
												entry.bezugsdokument 	= checkString($('input[name="BezugDoc"]').val());
												entry.version 			= checkString($('input[name="Version"]').val());

												var datum 				= $('input[name="Datum"]').val(), datumsArray = datum.split(".");
												entry.timestamp			= Math.round(new Date(parseInt(datumsArray[2], 10), parseInt(datumsArray[1], 10) - 1 , parseInt(datumsArray[0]), 10).getTime() / 1000);
											
												entry.frage 			= checkString($('input[name="Frage"]').val());
												entry.textbezug 		= checkString($('input[name="BezugText"]').val());
												entry.kurzantwort 		= checkString($('input[name="Antwort"]').val());
												entry.antwort 			= checkString($('input[name="AntwortRTF"]').val());
												entry.status 			= checkString($('input[name="StatusExtern"]').val());
												entry.bearbeiter 		= checkString($('input[name="Bearbeiter"]').val());
												entry.hash 				= crypto.createHash('md5').update(body).digest("hex");

												entry.url = betterUrl;

												entry.tags = [];

												if(entry.status) {
													entry.tags.push({text: entry.status, class: 'btn-info'});
												}

												if(entry.bezugsdokument) {
													entry.tags.push({text: entry.bezugsdokument, class: 'btn-info'});
												}

												if(entry.version) {
													entry.tags.push({text: entry.version, class: 'btn-info'});
												}

												if(entry.thema) {
													entry.tags.push({text: entry.thema, class: 'btn-info'});
												}

												if(entry.bearbeiter && false) {
													entry.tags.push({text: entry.bearbeiter, class: 'btn-info'});
												}

												entry.tags = _.union(entry.tags);

												eventEmitter.emit('entryToCheck', entry);

												callback();

											});

										});
									}
								});

								async.parallel(parallelStack, callback);

						});

					});

				});

				async.parallel(parallelStack, callback);

			});

		}, function(callback) {

			request({ uri: urls.anforderungen, method: 'GET', encoding: 'binary' }, function(err, response, body) {

				if(err) { callback(err); return; }

				var $ = cheerio.load(body), parallelStack = [];

				eventEmitter.emit('urlFetched', urls.anforderungen);

				$('.cat').each(function() {

					var url = $(this).attr('href'), betterUrl = 'http://fdf.vdew.net' + url;

					parallelStack.push(function(callback) {

						request({ uri: betterUrl, method: 'GET', encoding: 'binary' }, function(err, response, body) {

							if(err) { callback(err); return; }

							var $ = cheerio.load(body), parallelStack = [];

							eventEmitter.emit('urlFetched', betterUrl);

							$('td[width="464"] a').each(function() {
								var url = $(this).attr('href'), betterUrl = 'http://fdf.vdew.net' + url;
								if(url.substring(0,22) == '/wysvde/dataforum.nsf/') {
									parallelStack.push(function(callback) {

										request({ uri: betterUrl, method: 'GET', encoding: 'binary' }, function(err, response, body) {

											if(err) { callback(err); return; }

											var $ = cheerio.load(body), entry = {};

											eventEmitter.emit('urlFetched', betterUrl);

											entry.type 					= 'anforderungen';
											entry.thema 				= checkString($('input[name="Thema"]').val());
											entry.bezugsdokument 		= checkString($('input[name="BezugDoc"]').val());
											entry.version 				= checkString($('input[name="Version"]').val());

											var datum 					= $('input[name="Datum"]').val(), datumsArray = datum.split(".");
											entry.timestamp				= Math.round(new Date(parseInt(datumsArray[2], 10), parseInt(datumsArray[1], 10) - 1 , parseInt(datumsArray[0]), 10).getTime() / 1000);

											entry.anforderung 			= checkString($('input[name="Anforderung"]').val());
											entry.problembeschreibung 	= checkString($('input[name="Problembeschreibung"]').val());
											entry.bezugtext 			= checkString($('input[name="BezugText"]').val());
											entry.kurzantwort 			= checkString($('input[name="Antwort"]').val());
											entry.antwort 				= checkString($('input[name="AntwortRTF"]').val());
											entry.status 				= checkString($('input[name="StatusExtern"]').val());
											entry.bearbeiter 			= checkString($('input[name="Bearbeiter"]').val());
											entry.hash 					= crypto.createHash('md5').update(body).digest("hex");

											entry.url = betterUrl;

											entry.tags = [];

											if(entry.status) {
												entry.tags.push({text: entry.status, class: 'btn-info'});
											}

											if(entry.bezugsdokument) {
												entry.tags.push({text: entry.bezugsdokument, class: 'btn-info'});
											}

											if(entry.version) {
												entry.tags.push({text: entry.version, class: 'btn-info'});
											}

											if(entry.thema) {
												entry.tags.push({text: entry.thema, class: 'btn-info'});
											}

											if(entry.bearbeiter && false) {
												entry.tags.push({text: entry.bearbeiter, class: 'btn-info'});
											}

											entry.tags = _.union(entry.tags);

											eventEmitter.emit('entryToCheck', entry);

											callback();

										});

									});
								}
							});

							async.parallel(parallelStack, callback);

						});

					});

				});

				async.parallel(parallelStack, callback);

			});

		}, /*function(callback) {

			request({ uri: urls.dokumente, method: 'GET', encoding: 'binary' }, function(err, response, body) {

				if(err) { callback(err); return; }

				var $ = cheerio.load(body), parallelStack = [];

				eventEmitter.emit('urlFetched', urls.dokumente);

				$('.cat').each(function() {

					var url = $(this).attr('href'), betterUrl = 'http://fdf.vdew.net' + url, idSuffix = $(this).attr('id');

					parallelStack.push(function(callback) {

						request({ uri: betterUrl, method: 'GET', encoding: 'binary' }, function(err, response, body) {

							if(err) { callback(err); return; }

							var $ = cheerio.load(body), parallelStack = [];

							eventEmitter.emit('urlFetched', betterUrl);

							$('a[id^="' + idSuffix + '."]').each(function() {

								var url = $(this).attr('href'), betterUrl = 'http://fdf.vdew.net' + url, idSuffix = $(this).attr('id');

								parallelStack.push(function(callback) {

									request({ uri: betterUrl, method: 'GET', encoding: 'binary' }, function(err, response, body) {

										if(err) { callback(err); return; }

										var $ = cheerio.load(body), parallelStack = [];

										eventEmitter.emit('urlFetched', betterUrl);

										$('a[id^="' + idSuffix + '."]').each(function() {

											var url = $(this).attr('href'), betterUrl = 'http://fdf.vdew.net' + url;

											parallelStack.push(function(callback) {

												request({ uri: betterUrl, method: 'GET', encoding: 'binary' }, function(err, response, body) {

													if(err) { callback(err); return; }

													var $ = cheerio.load(body), parallelStack = [];

													eventEmitter.emit('urlFetched', betterUrl);

													$('td[width="480"] a').each(function() {
														var url = $(this).attr('href'), betterUrl = 'http://fdf.vdew.net' + url;
														if(url.substring(0,22) == '/wysvde/dataforum.nsf/') {

															parallelStack.push(function(callback) {

																request({ uri: betterUrl, method: 'GET', encoding: 'binary' }, function(err, response, body) {

																	if(err) { callback(err); return; }

																	var $ = cheerio.load(body), entry = {};

																	eventEmitter.emit('urlFetched', betterUrl);

																	entry.type 					= 'dokumente';
																	entry.thema 				= checkString($('input[name="Thema"]').val());
																	entry.dokumententyp 		= checkString($('input[name="Dokumententyp"]').val());
																	entry.version 				= checkString($('input[name="Version"]').val());

																	var datum 					= $('input[name="Datum"]').val(), datumsArray = datum.split(".");
																	entry.timestamp				= Math.round(new Date(parseInt(datumsArray[2], 10), parseInt(datumsArray[1], 10) - 1 , parseInt(datumsArray[0]), 10).getTime() / 1000);

																	entry.titel 				= checkString($('input[name="Titel"]').val());
																	entry.inhalt 				= checkString($('input[name="Inhalt"]').val());
																	entry.status 				= checkString($('input[name="StatusExtern"]').val());
																	entry.dokmentURL			= checkString($('#vwperson a').href());
																	entry.dokmentURLText		= checkString($('#vwperson a').text());
																	entry.hash 					= crypto.createHash('md5').update(body).digest("hex");

																	entry.url = betterUrl;

																	entry.tags = [];

																	if(entry.status) {
																		entry.tags.push({text: entry.status, class: 'btn-info'});
																	}

																	if(entry.version) {
																		entry.tags.push({text: entry.version, class: 'btn-info'});
																	}

																	if(entry.thema) {
																		entry.tags.push({text: entry.thema, class: 'btn-info'});
																	}

																	entry.tags = _.union(entry.tags);

																	eventEmitter.emit('entryToCheck', entry);

																	callback();

																});

															});
														}
													});

													async.parallel(parallelStack, callback);

												});

											});

											async.parallel(parallelStack, callback);

										});

									});

								});

								async.parallel(parallelStack, callback);

							});

						});

					});

				});

				async.parallel(parallelStack, callback);

			});

		},*/ function(callback) {

			/*request(urls.dokumente, function(error, response, body) {

			});*/
			callback();

		}], function(err) {

			if(err) { console.log(err); return; }

			eventEmitter.emit('fetcherCompleted');

		});
	}
	
	eventEmitter.on('urlFetched', function(url) {
		console.log(url);
	});
	
	eventEmitter.on('entryToCheck', function(entryToCheck) {

		for (var i = 0; i < currentData.length; i++) {

			var entry = currentData[i];

			if(entry && entry.url == entryToCheck.url && entry.hash != entryToCheck.hash) {
				delete currentData[i];
			}

		}

		currentData.push(entryToCheck);

	});

	setInterval(checkForUpdates, 3600000 * 12);

	checkForUpdates();

	var makeIDThema = function(thema) {

		thema = thema.replace('  ', ' ');
		thema = thema.replace(/\)/g, '');
		thema = thema.replace(/\(/g, '');
		thema = thema.replace(/\&/g, '');
		thema = thema.replace(/\%/g, '');
		thema = thema.replace(/\//g, '');
		thema = thema.replace(/ö/g, 'oe');
		thema = thema.replace(/ä/g, 'ae');
		thema = thema.replace(/ü/g, 'ue');
		thema = thema.replace(/ß/g, 'ss');

		var splittedThema = thema.toLowerCase().split(' '), idThema = splittedThema.join('-');

		return idThema;

	}

	var shortLongString = function(text, lenght) {
		if(!lenght) {return;}
		return text.substring(0, lenght) + '...';
	}

	var removeBR = function(text) {
		return text.replace(/<br>/g, ' ');
	}

	var fetcher = {
		events: eventEmitter,
		getFragen: function(lenght) {

			var result = {};

			for (var i = 0; i < currentData.length; i++) {

				var entry = currentData[i];

				if(entry.type == 'frage') {
					var idThema = makeIDThema(entry.thema), thema = result[idThema] = result[idThema] || { titel: entry.thema, fragen: [] };
					thema.fragen.push({
						hash: entry.hash,
						timestamp: entry.timestamp,
						frage: shortLongString(removeBR(entry.frage), lenght),
						kurzantwort: removeBR(entry.kurzantwort),
						tags: entry.tags
					});
				}

			}

			_.sortBy(thema.fragen, function(frage){ 
				return frage.timestamp;
			});

			return result;

		},
		getAnforderungen: function(lenght) {

			var result = {};

			for (var i = 0; i < currentData.length; i++) {

				var entry = currentData[i];

				if(entry.type == 'anforderungen') {
					var idThema = makeIDThema(entry.thema), thema = result[idThema] = result[idThema] || { titel: entry.thema, anforderungen: [] };
					thema.anforderungen.push({
						hash: entry.hash, 
						timestamp: entry.timestamp, 
						problembeschreibung: shortLongString(removeBR(entry.problembeschreibung), lenght), 
						kurzantwort: removeBR(entry.kurzantwort),
						tags: entry.tags
					});
				}

			}

			_.sortBy(thema.anforderungen, function(anforderung){ 
				return anforderung.timestamp;
			});

			return result;

		},
		getDokumente: function(hash) {

			var result = {};

			for (var i = 0; i < currentData.length; i++) {

				var entry = currentData[i];

				if(entry.type == 'dokumente') {
					var idThema = makeIDThema(entry.thema), thema = result[idThema] = result[idThema] || { titel: entry.thema, dokumente: [] };
					thema.dokumente.push({
						hash: entry.hash, 
						timestamp: entry.timestamp, 
						inhalt: entry.problembeschreibung, 
						dokmentURL: entry.dokmentURL,
						dokmentURLText: entry.dokmentURLText,
						tags: entry.tags
					});
				}

			}

			return result;

		}

	}

	return fetcher;

})();