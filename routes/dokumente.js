
/*
 * GET home page.
 */

module.exports = function(data) {

  data.extend({ title: 'Express' });

  return  function(req, res){
    res.render('dokumente', data);
  }
  
}