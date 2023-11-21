const endpoints = require('../endpoints.json');

exports.getApi = (req, res) => {
    res.status(200).send(endpoints);
};

exports.getApiHealthCheck = (req, res) => {
    res.status(200).send({ msg: 'Welcome to Alicia News' });
};
