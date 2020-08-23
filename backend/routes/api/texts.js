const router = require('express').Router();

const Text = require('../../models/text.model');
const Segment = require('../../models/segment.model');

router.route('/:userId/texts').get((req, res) => {
    const userId = req.params.userId;

    Text.find({ userId })
        .then(texts => res.json(texts))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/:userId/texts').post((req, res) => {
    const userId = req.params.userId;
    const { name, media, message, link, status, segmentId } = req.body;
    const newText = new Text({ name, media, message, link, status });
    newText.userId = userId;
    newText.segmentId = segmentId;

    newText.save()
        .then(text => res.json(text))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/:userId/texts/:id').post((req, res) => {
    Text.findById(req.params.id)
        .then(text => {
            const { name, segmentId, media, message, link } = req.body;
            text.name = name;
            text.segmentId = segmentId;
            text.media = media;
            text.message = message;
            text.link = link;

            text.save()
                .then(text => res.json(text))
                .catch(err => res.status(400).json(`Error: ${err}`));
        })
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/:userId/texts/:id').delete((req, res) => {
    Text.findByIdAndDelete(req.params.id)
        .then(text => res.json(text))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/:userId/texts/send/:id').post((req, res) => {
    Text.findById(req.params.id)
        .then(text => {
            text.status = 'Sent';

            text.save()
                .then(text => res.json(text))
                .catch(err => res.status(400).json(`Error: ${err}`));
        })
        .catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;