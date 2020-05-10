const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const endpointUrl = process.env.CURRENT_DOMAIN_URL + 'customers/';
const User = require('../models/user')

const router = express.Router();


router.post('/signup', (req, res, next) => {
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
})

router.delete('/:userId', (req, res, next) => {
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
})

module.exports = router;