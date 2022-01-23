const express = require('express');
const router = express.Router();
const { User, Transactions } = require('../../models');
const crypt = require('bcryptjs');

router.post('/', async (req, res) => {
  User.findById({ _id: req.body.id }, (err, user) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }

    if (parseFloat(user.balance) < parseFloat(req.body.amount)) {
      return res.status(400).json({ msg: 'insufficient acount Balance' });
    }

    crypt.compare(req.body.password, user.password, (err, match) => {
      if (err) {
        return res.status(400).json({ msg: err });
      }

      if (match) {
        // let query = { _id: req.body.id };
        // User.findByIdAndUpdate(
        //   query,
        //   {
        //     balance: parseFloat(user.balance) - parseFloat(req.body.amount),
        //   },
        //   (err) => {
        //     if (err) {
        //       return res.status(400).json({ msg: err });
        //     }
        //     console.log('Transfer successful!');
        //   }
        // );
        // second query
        const receiver = User.findOne({ email: req.body.rec_email }, function (err, rec) {
          if (err) {
            return res.status(400).json({ msg: err });
          } else {
            let query = { _id: req.body.id };
            User.findByIdAndUpdate(
              query,
              {
                balance: parseFloat(user.balance) - parseFloat(req.body.amount),
              },
              (err) => {
                if (err) {
                  return res.status(400).json({ msg: err });
                }
               
              }
            );
            rec.balance = parseFloat(rec.balance) + parseFloat(req.body.amount);
            rec.save();
            console.log('Transfer successful!');
          }

          let transaction = new Transactions({
            transaction_type: 'Transfer',
            sender: req.body.id,
            recepient: rec.email,
            amount: req.body.amount,
          });
          transaction.save((err) => {
            if (err) {
              return res.status(400).json({ msg: err });
            }
            console.log('Transaction saved!');
          });
        });

        res
          .status(200)
          .json({ msg: `Transfer successful! You have sent ${parseInt(req.body.amount)} to ${req.body.email}.` });
      } else {
        return res.status(400);
      }
    });
  });
});

module.exports = router;
