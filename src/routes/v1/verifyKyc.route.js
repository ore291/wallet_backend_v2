const express = require('express');
const router = express.Router();
// const users = require("../../models/User");
const { User } = require('../../models');

router.post('/', (req, res) => {
  User.findById({ _id: req.body.id }, (err, user) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }
    let query = { _id: req.body.id };
    User.findByIdAndUpdate(
      query,
      {
        is_verified: true,
      },
      (err) => {
        if (err) {
          return res.status(400).json({ msg: err });
        }
        console.log('Verification successful!');
      }
    );
  });
});

module.exports = router;
