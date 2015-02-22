/**
 * Created by Daniel Mishcherin
 */

var mongoose = require('mongoose');

// data model
var CrowdVoice = mongoose.model('CrowdVoice', {
    specURI: String,
    text: String
});

var resources = {
    noConnection: 'MongoDB connection is inactive.',
    dbError: 'Could not get information from DB.'
};

var config = {
    statusCodes: {
        OK: 200,
        notFound: 404,
        error: 500
    }
};

var connectionErrorHandler = function(res){
    res.status(config.statusCodes.notFound).send(resources.noConnection);
};

var DBErrorHandler = function(res, err){
    res.status(config.statusCodes.error).send(resources.dbError);
    console.log('Crowd-voice: ', resources.dbError, err);
};

var getAllCrowdVoiceData = function(req, res){
    if (mongoose.connection.readyState === 0) {
        connectionErrorHandler(res);
        return;
    }

    CrowdVoice.find(function(err, data){
        if (err) {
            DBErrorHandler(res, err);
            return;
        }

        res.jsonp(data);
    });
};

var getCrowdVoice = function(req, res){
    if (mongoose.connection.readyState === 0) {
        connectionErrorHandler(res);
        return;
    }

    var specURI = req.query.pathToDataFile;

    CrowdVoice.find({specURI: specURI}, function(err, data){
        if (err) {
            DBErrorHandler(res, err);
            return;
        }

        res.jsonp(data);
    });
};

var setCrowdVoice = function(req, res){
    if (mongoose.connection.readyState === 0) {
        connectionErrorHandler(res);
        return;
    }

    var specURI = req.query.pathToDataFile;
    var text = req.query.text;

    CrowdVoice.findOneAndUpdate({specURI: specURI}, {text: text}, function(err, data) {
        if (err) {
            DBErrorHandler(res, err);
            return;
        }

        if(data != null) {

            res.jsonp(data);

        } else {

            var crowdvoice = new CrowdVoice({
                specURI: req.query.specURI,
                text: req.query.text
            });

            crowdvoice.save(function (err, data) {
                if (err) {
                    DBErrorHandler(res, err);
                    return;
                }

                res.jsonp(data);
            });
        }

    });
};

var removeCrowdVoice = function(req, res){
    if (mongoose.connection.readyState === 0) {
        connectionErrorHandler(res);
        return;
    }

    var specURI = req.query.pathToDataFile;

    CrowdVoice.findOneAndRemove({specURI: specURI}, function(err, data) {
        if (err) {
            DBErrorHandler(res, err);
            return;
        }

        res.jsonp(data);
    });
};

global.app.get('/getAllCrowdVoiceData', getAllCrowdVoiceData);
global.app.get('/getCrowdVoice', getCrowdVoice);
global.app.get('/setCrowdVoice', setCrowdVoice);
global.app.get('/removeCrowdVoice', removeCrowdVoice);