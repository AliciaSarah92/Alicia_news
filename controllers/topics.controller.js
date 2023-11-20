const { selectTopics } = require('../models/topics.model');

exports.getTopics = (req, res) => {
    selectTopics()
        .then(response => {
            res.status(200).send({ topics: response });
        }).catch(err => {
            res.status(404).send({ msg: 'Page not found' });
        })
};
