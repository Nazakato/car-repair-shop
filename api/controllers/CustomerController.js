const mongoose = require('mongoose');
const Customer = require('../models/customer');
const customerSelector = 'name type description _id';
const endpointUrl = process.env.CURRENT_DOMAIN_URL + 'customers/';

module.exports.get_all_customers = (req, res, next) => {
  Customer.find()
    .select(customerSelector)
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        customers: docs.map(doc => {
          return {
            customer: docToApiResponseModel(doc),
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

module.exports.get_customer = (req, res, next) => {
  const id = req.params.customerId;
  Customer.findById(id)
    .select(customerSelector)
    .exec()
    .then(doc => {
      if (!doc) {
        res.status(404).json({ message: 'Customer with id ' + id + ' was not found.' });
      }
      const response = {
        customer: docToApiResponseModel(doc),
        request: {
          type: 'GET',
          url: endpointUrl
        }
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

module.exports.create_customer = (req, res, next) => {
  const customer = new Customer({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    type: req.body.type,
    description: req.body.description
  });

  customer
    .save()
    .then(doc => {
      const response = {
        customer: docToApiResponseModel(doc),
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

module.exports.update_customer = (req, res, next) => {
  const id = req.params.customerId;
  const updateCustomers = {};
  for (const option of req.body) {
    updateCustomers[option.propName] = option.value;
  }

  Customer.update({ _id: id }, { $set: updateCustomers })
    .exec()
    .then(docs => {
      if (docs.n === 0) {
        res.status(404).json({ message: 'Customer with id ' + id + ' was not found.' });
      } else if (docs.n === 1) {
        const response = {
          request: {
            type: 'GET',
            url: endpointUrl + id
          }
        };
        res.status(201).json(response);
      } else {
        res.status(500).json();
      }
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

module.exports.delete_customer = (req, res, next) => {
  const id = req.params.customerId;
  Customer.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

function docToApiResponseModel(doc) {
  return {
    _id: doc._id,
    name: doc.name,
    description: doc.description,
    type: doc.type

  };
};