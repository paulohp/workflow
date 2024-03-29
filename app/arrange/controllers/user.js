var models 	 = app.get('arrange-models')
	, _ 		   = require("underscore")
	, passport = require('passport')
  , util     = require('util')
  , mailerService = require('../../admin/utils/mailerUtil')
  , LocalStrategy = require('passport-local').Strategy;

var uuid = require('uuid-v4');
var config = require('../../../config/config');
    
exports.add = function(params, callback){
  models.User.create({
    email : params.email,
    name : params.name,
    password : params.password,
    activationKey: uuid()
  }).success(function(user){
    // email user
    var options = {
      template: 'invite',
      from: config.appName + ' <' + config.email.registration + '>',
      subject: 'Obrigado por se registrar no ' + config.appName
    };

    var data = {
      email: user.email,
      name: user.first,
      appName: config.appName,
      activationLink: config.domain + '/a/users/activate/' + user.id + '/' +
        user.activationKey
    };

    mailerService.sendMail(options, data, function(err, response) {
      // TODO: what should happen if this email fails???
      // should already be logged by mailerService
    });

    callback(user);
  });
}

exports.updateUser = function(params, callback){
  models.User.update({
    name : params.name,
    password : params.password,
    aboutme : params.aboutme,
    position : params.position
  }).success(function(user){
    callback(user);
  });
}



exports.forgotPassword = function(params, callback){
    console.log("forgotPassword on user.js");
    models.User.find({ where: {email: params.email} })
        .success(function(userEncontrado) {
            models.User.update({
                  passwordResetKey : uuid(),
                  passwordResetDate : new Date(),
                  passwordResetUsed : false
                })
                .success(function(user) {
                    // email user
                    var options = {
                      template: 'forgot_password',
                      from: config.appName + ' <' + config.email.registration + '>',
                      subject: 'Esqueceu sua senha do ' + config.appName + '?'
                    };

                    var data = {
                      appName: config.appName,
                      activationLink: config.domain + '/users/reset_password/' + userEncontrado.id + '/' +
                        userEncontrado.activationKey
                    };

                    mailerService.sendMail(options, data, function(err, response) {
                      // TODO: what should happen if this email fails???
                      // should already be logged by mailerService
                    });

                  return done(null, true, { message: 'Email com instruções enviado para: ' + params.email });
                })
                .error(function(user) {
                  if (!user) { return done(null, false, { message: 'Email inexistente.'}); }
                  return done(null, false, { message: 'Erro inesperado.' });
                });
          return done(null, true, { message: 'Email com instruções enviado para: ' + params.email });
        })
        .error(function(user) {
          if (!user) { return done(null, false, { message: 'Email inexistente.'}); }
          return done(null, false, { message: 'Erro inesperado.' });
        });
}

exports.account = function(params, callback){
  console.log('parças', params)
}