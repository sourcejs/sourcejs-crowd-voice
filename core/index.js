/**
 * Created by Daniel Mishcherin
 */

var mongoose = require('mongoose');

// data model
var CrowdVoice = mongoose.model('CrowdVoice', {
    specURI: String,
    text: String
});

var getAllCrowdVoiceData = function(req, res){

    CrowdVoice.find(function(err, data){
        if(!err) {
            res.jsonp(data);
        }
    });
};

var getCrowdVoice = function(req, res){
    var specURI = req.query.pathToDataFile;

    CrowdVoice.find({specURI: specURI}, function(err, data){
        if(!err) {
            res.jsonp(data);
        }
    });
};

var setCrowdVoice = function(req, res){

    var specURI = req.query.pathToDataFile;
    var text = req.query.text;

    CrowdVoice.findOneAndUpdate({specURI: specURI}, {text: text}, function(err, data) {
        if(data != null) {

            res.jsonp(data);

        } else {

            var crowdvoice = new CrowdVoice({
                specURI: req.query.specURI,
                text: req.query.text
            });

            crowdvoice.save(function (err, data) {
                if (!err){
                    res.jsonp(data);
                }
            });
        }

    });
};

var removeCrowdVoice = function(req, res){
    var specURI = req.query.pathToDataFile;

    CrowdVoice.findOneAndRemove({specURI: specURI}, function(err, data) {
        res.jsonp(data);
    });
};

global.app.get('/getAllCrowdVoiceData', getAllCrowdVoiceData);
global.app.get('/getCrowdVoice', getCrowdVoice);
global.app.get('/setCrowdVoice', setCrowdVoice);
global.app.get('/removeCrowdVoice', removeCrowdVoice);