const express = require("express");
const router = express.Router();
const { User, Transactions } = require('../../models');
const crypt = require("bcryptjs");



router.post("/", (req, res) => {
  User.findById({ _id: req.body.id }, (err, user) => {
    if (err) {
      return res.status(400).json({ msg: err })
    }

    if (parseFloat(user.balance) < parseFloat(req.body.amount)) {
      return res.status(400).json({ msg: 'insufficient acount Balance' });
    }


    crypt.compare(req.body.password, user.password, (err, match) => {
      if (err) {
        return res.status(400).json({ msg: err })
      }

      if (match) {
        let query = { _id: req.body.id };
        User.findByIdAndUpdate(
          query,
          { balance: parseInt(user.balance) - parseInt(req.body.amount) },
          err => {
            if (err) {
              return res.status(400).json({ msg: err });
            }
            console.log("Withdraw successful!");
          }
        );

        let transaction = new Transactions({
          transaction_type: "Withdraw",
          sender: req.body.id,
          recepient: req.body.id,
          amount: req.body.amount
        });
        transaction.save(err => {
          if (err) {
            return res.status(400).json({ msg: err });
          }
          console.log("Transaction saved!");
        });

        res.status(200).json({msg: `Withdraw successful! You have ${parseInt(req.body.amount) +
          parseInt(user.balance)} in your account.` })
      } else {
        return res.status(400)
      }
    });
  });
});

module.exports = router;
