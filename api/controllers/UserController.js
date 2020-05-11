const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports.sign_up = (req, res, next) => {
  User.findOne({email: req.body.email })
    .exec()
    .then(user => {
      if (user) {
        return res.status(409).json({
          message: 'Email exists in system'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user.save()
              .then(result => {
                console.log(result);
                res.status(200).json({
                  message: 'User created'
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

module.exports.log_in = (req, res, next) => {
  User.findOne({email: req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          messasge: 'Auth failed'
        });
      }

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err || !result) {
          return res.status(401).json({
            messasge: 'Auth failed'
          });
        }

        const token = jwt.sign({
          email: user.email,
          userId: user._id
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h"
        });
        return res.status(200).json({
          message: 'Auth successful',
          token: token
        });
      })
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

module.exports.get_all_users = (req, res, next) => {
  User.find()
  .select('_id email')
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      customers: docs.map(doc => {
        return { user: doc };
      })
    };
    res.status(200).json(response);
  })
  .catch(err => {
    res.status(500).json({ error: err.message });
  });
};

module.exports.delete_user = (req, res, next) => {
  User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted'
      });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};