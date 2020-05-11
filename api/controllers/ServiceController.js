const mongoose = require('mongoose');
const Service = require('../models/service');
const servicesSelector = 'name description prices _id';
const endpointUrl = process.env.CURRENT_DOMAIN_URL + 'services/';

module.exports.get_service = (req, res, next) => {
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
};

module.exports.get_all_services = (req, res, next) => {
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
};

module.exports.create_service = (req, res, next) => {
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
};

module.exports.delete_service = (req, res, next) => {
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
};

module.exports.update_service_price = (req, res, next) => {
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
};

function docToApiResponseModel(doc) {
  return {
    _id: doc._id,
    description: doc.description,
    name: doc.name,
    prices: doc.prices
  };
}