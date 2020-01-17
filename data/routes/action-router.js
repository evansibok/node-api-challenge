const express = require('express');

const acDb = require('../helpers/actionModel');

const router = express.Router();

router.get('/', (req, res) => {
  acDb.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error.message,
        stack: error.stack
      });
    });
});

router.get('/:id', (req, res) => {

});

router.post('/:id/actions', (req, res) => {

});

router.put('/', (req, res) => {
  
});

router.delete('/', (req, res) => {
  
});

module.exports = router;