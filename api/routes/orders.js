const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Customer = require('../models/customer');
const Service = require('../models/service');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now().toString() + '_' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/x-msdownload' || file.mimetype === 'text/javascript') {
        cb(new Error('Dangerous file type.'), false);
    } else {
        cb(null, true);
    }
}
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: fileFilter
});

const ordersSelector = '_id createdDate modifiedDate comment serviceIds customerId attachment';
const endpointUrl = process.env.CURRENT_DOMAIN_URL + 'orders/';

const router = express.Router();

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
}

router.get('/', (req, res, next) => {
    Order.find()
        .select(ordersSelector)
        .populate('services', '_id name prices')
        .populate('customer', '_id name type')
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
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select(ordersSelector)
        .populate('services', '_id name prices')
        .populate('customer', '_id name type')
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
});

router.post('/', upload.single('orderAttachment'), (req, res, next) => {
    Customer.exists({_id: req.body.customer})
        .then(customerExist => {
            if (!customerExist) {
                throw Error('Customer not found.')
            }
        })
        .then(() => {
            var promises = req.body.services.map(s => Service.exists({_id: s}))
            return Promise.allSettled(promises);
        })
        .then(servicesExist => {
            console.log(servicesExist);
            if (!servicesExist.every(e => e.value)){
                throw Error('One of services not found.')
            }
        })
        .then(() => {
            const order = new Order({
                _id : mongoose.Types.ObjectId(),
                createdDate : new Date(),
                modifiedDate : new Date(),
                customer : req.body.customer,
                services : req.body.services,
                comment : req.body.comment,
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
});

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    const updateOrders = {};
    for (const option of req.body) {
        updateOrders[option.propName] = option.value;
    }
    updateOrders.modifiedDate = new Date();

    Promise.resolve(updateOrders)
        .then(options => {
            if (options.customer) {
                return Customer.exists({_id: options.customer})
                        .then(customerExist => {
                            if (!customerExist) {
                                throw Error('Customer not found.')
                            }
                        });
            }
            return options;
        })
        .then(options => {
            if (options.services){
                let promises = updateOrders.services.map(s => Service.exists({_id: s}))
                return Promise.allSettled(promises)
                        .then(servicesExist => {
                            console.log(servicesExist);
                            if (!servicesExist.every(e => e.value)){
                                throw Error('One of services not found.')
                            }
                        });
            }
            return options;
        })
        .then(() => {
            const order = new Order({
                _id : mongoose.Types.ObjectId(),
                createdDate : new Date(),
                modifiedDate : new Date(),
                customer : req.body.customer,
                services : req.body.services,
                comment : req.body.comment,
                total: 0
            });

            return order.save();
        })
        .then(options => Order.update({ _id: id }, { $set: options }).exec())
        .then(docs => {
            if (docs.n === 0) {
                res.status(404).json({ message: 'Order with id ' + id + ' was not found.' });
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
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});

module.exports = router;