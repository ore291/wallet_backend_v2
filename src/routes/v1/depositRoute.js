const express = require("express");
const router = express.Router();
// const users = require("../../models/User");
const { User, Transactions } = require('../../models');
const crypt = require("bcryptjs");


router.post("/", (req, res) => {
  User.findById({ _id: req.body.id }, (err, user) => {
    if (err) {
      return res.status(400).json({ msg: err })
    }

    console.log(user.email);

    crypt.compare(req.body.password, user.password, (err, match) => {
      if (err) {
        return res.status(400).json({ msg: err })
      }

      if (match) {
        let query = { _id: req.body.id };
        User.findByIdAndUpdate(
          query,
          {
            balance: parseFloat(req.body.amount) + parseFloat(user.balance)
          },
          err => {
            if (err) {
              return res.status(400).json({ msg: err })
            }
            console.log("Deposit successful!");
          }
        );

        let transaction = new Transactions({
          transaction_type: "Deposit",
          sender: req.body.id,
          recepient: req.body.id,
          amount: req.body.amount
        });
        transaction.save(err => {
          if (err) {
            return res.status(400).json({ msg: err })
          }
          console.log("Transaction saved!");
        });

        res.status(200).json({msg: `Deposit successful! You have ${parseInt(req.body.amount) +
              parseInt(user.balance)} in your user.` })
      } else {
        return res.status(400)
      }
    });
  });
});

module.exports = router;
