const mongoose = require('mongoose');
const Order = require('../models/order');
const Customer = require('../models/customer');
const Service = require('../models/service');
const ordersSelector = '_id createdDate modifiedDate comment services customer attachment';
const endpointUrl = process.env.CURRENT_DOMAIN_URL + 'orders/';

module.exports.get_all_orders = (req, res, next) => {
  Order.find()
    .select(ordersSelector)
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        orders: docs.map(doc => {
          return {
            order: docToApiResponseModel(doc),
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

module.exports.get_order = (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select(ordersSelector)
    .exec()
    .then(doc => {
      if (!doc) {
        res.status(404).json({ message: 'Order with id ' + id + ' was not found.' });
      }
      const response = {
        order: docToApiResponseModel(doc),
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

module.exports.create_order = (req, res, next) => {
  Customer.exists({ _id: req.body.customer })
    .then(customerExist => {
      if (!customerExist) {
        throw Error('Customer not found.')
      }
    })
    .then(() => {
      var promises = req.body.services.map(s => Service.exists({ _id: s }))
      return Promise.allSettled(promises);
    })
    .then(servicesExist => {
      console.log(servicesExist);
      if (!servicesExist.every(e => e.value)) {
        throw Error('One of services not found.')
      }
    })
    .then(() => {
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        createdDate: new Date(),
        modifiedDate: new Date(),
        customer: req.body.customer,
        services: req.body.services,
        comment: req.body.comment,
        attachment: req.file.path,
        total: 0
      });

      return order.save();
    })
    .then(doc => {
      const response = {
        order: docToApiResponseModel(doc),
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

module.exports.delete_order = (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
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
    comment: doc.comment,
    services: doc.services,
    customer: doc.customer,
    type: doc.type,
    attachment: doc.attachment,
    total: doc.total,
    createdDate: doc.createdDate,
    modifiedDate: doc.modifiedDate
  };
};