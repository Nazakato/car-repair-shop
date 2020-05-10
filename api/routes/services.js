const express = require('express');
const mongoose = require('mongoose');
const Service = require('../models/service');
const checkAuth = require('../middlewares/check-auth');

const servicesSelector = 'name description prices _id';
const endpointUrl = process.env.CURRENT_DOMAIN_URL + 'services/';

const router = express.Router();

function docToApiResponseModel(doc) {
  return {
    _id: doc._id,
    description: doc.description,
    name: doc.name,
    prices: doc.prices
  };
}

router.get('/', (req, res, next) => {
  Service.find()
    .select(servicesSelector)
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        services: docs.map(doc => {
          return {
            service: docToApiResponseModel(doc),
            request: {
              type: 'GET',
              url: endpointUrl + doc._id
            }
          };
        }),
      }
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get('/:serviceId', (req, res, next) => {
  const id = req.params.serviceId;
  Service.findById(id)
    .select(servicesSelector)
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({ message: 'Customer with id ' + id + ' was not found.' });
      }

      const response = {
        service: docToApiResponseModel(doc),
        request: {
          type: 'GET',
          url: endpointUrl
        }
      }
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.post('/', checkAuth, (req, res, next) => {
  const service = new Service({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    prices: {}
  });
  service.prices.set(Date.now().toString(), req.body.price);

  service.save()
    .then(doc => {
      const response = {
        service: docToApiResponseModel(doc),
        request: {
          type: 'GET',
          url: endpointUrl + doc._id
        }
      };
      res.status(201).json(response);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.delete('/:serviceId', checkAuth, (req, res, next) => {
  const id = req.params.serviceId;
  Service.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        request: {
          type: 'GET',
          url: endpointUrl
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.post('/:serviceId/updatePrice', checkAuth, (req, res, next) => {
  const id = req.params.serviceId;

  Service.findById(id)
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({ message: 'Customer with id ' + id + ' was not found.' });
      }

      doc.prices.set(Date.now().toString(), req.body.price);
      return doc.save();
    })
    .then(doc => {
      const response = {
        service: docToApiResponseModel(doc),
        request: {
          type: 'GET',
          url: endpointUrl
        }
      }
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
})

module.exports = router;