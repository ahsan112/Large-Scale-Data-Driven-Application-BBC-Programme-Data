

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(express.static(__dirname+'/client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


var Schema  = mongoose.Schema;

var showSchema = new mongoose.Schema({
      start_time:{
        type:String
      },
      end_time: {
        type: String
      },
      epoch_start: {
        type:String
      },
      epoch_end:{
        type: String
      },
      complete_title:{
        type: String
      },
      media_type:{
        type:String
      },
      masterbrand:{
        type: String
      },
      service:{
        type: String
      },
      brand_pid:{
        type: String
      },
      is_clip:{
        type: Number
      },
      tags:{
        type: [String]
      },
      categories: [String]

});

var Show = mongoose.model('Show', showSchema )
showSchema.index({complete_title: 'text', service: 'text', categories:'text',tags:'text'}, {weights: {categories: 10, complete_title: 10, tags: 5, service: 3}} );

// conect to mongoose
// mongoose.connect('mongodb://localhost/tv');
mongoose.connect('mongodb://localhost/tvdatatest');
var db = mongoose.connection;

// setting up routes

app.get('/',function(req,res) {
  res.send('/cleint/index.html');
});

app.get('/api/shows',function(req,res) {
  var query = Show.find();

  if (req.query.search) {
    var queryString = '\"' + req.query.search + '\"';
    console.log('searching....', req.query.search + queryString);


    Show.find({$text: {$search: req.query.search + queryString}},{ score : { $meta: "textScore" } } )
    .sort({ score : { $meta : 'textScore' } })
    .exec(function(err, shows) {
      if (err) {
        console.log(err);
      }
      else if (shows.length <= 2) {
        console.log('more than 2');
        Show.find({$text: {$search: req.query.search}},{ score : { $meta: "textScore" } } )
        .sort({ score : { $meta : 'textScore' } })
        .exec(function(err, shows) {
          // if (err) {
          //   console.log(err);
          // }
          //for missplelled
          if (shows.length === 0){
            var middle = Math.ceil(req.query.search.length / 2);
            var s1 = req.query.search.slice(0, middle+1);
            var s2 = req.query.search.slice(middle);
            console.log(s1, 'String spelt wrong querry');
              var r = new RegExp('^'+s1, "i");

            query.where({ complete_title: {$regex:r}} )
            .exec(function(err, shows){
              if (err) {
                console.log(err);
              }
              else {
                res.send(shows);
              }
            });// end of missplelled
          }
          else {

            res.send(shows);

          }
        });// end of OR Search

      }
      else {
        console.log('phrase search: ' + shows.length );
        res.send(shows);

      }
    });

  }

  else {
    if (req.query.service) {
      var r = new RegExp(req.query.service, "i");
      //console.log(req.query.complete_title);
      query.where({service:{$regex:r}});

    }
    else if (req.query.categories) {
      var r = new RegExp(req.query.categories, "i");
      console.log(req.query.categories);
      console.log(r);
      query.where({ categories: {$regex:r}} );
    }
    else if (req.query.media_type) {
      var r = new RegExp(req.query.media_type, "i");
      query.where({media_type:{$regex:r}});
    }
    else {
    query.limit(12);
    }
  query.exec(function(err, shows) {
    if (err) return next(err);
    res.send(shows);
  });
  }
});


app.get('/api/shows/:id', function(req, res, next) {
  Show.findById(req.params.id, function(err, show) {
    if (err) return next(err);
    res.send(show);
  });
});

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});


app.listen(3000);
console.log('running on port 3000...');
