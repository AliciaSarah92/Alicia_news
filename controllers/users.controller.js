const users = require('../db/data/test-data/users');
const { selectUsers } = require('../models/users.model');

exports.getUsers = (req, res) => {
    selectUsers().then(response => {
        res.status(200).send({ users: response });
    });
};
