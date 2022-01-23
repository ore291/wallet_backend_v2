const { User, Transactions } = require('../../models');
const crypt = require("bcryptjs");
const catchAsync = require('../utils/catchAsync');

const transferFund = catchAsync(async (req, res) => {
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
                balance:   parseFloat(user.balance) - parseFloat(req.body.amount)
              },
              err => {
                if (err) {
                  return res.status(400).json({ msg: err })
                }
                console.log("Transfer successful!");
              }
            );
            // second query
            const receiver = User.findOne({ email: req.body.rec_email });
            receiver.balance += parseFloat(req.body.amount);
            receiver.save();
    
            let transaction = new Transactions({
              transaction_type: "Deposit",
              sender: req.body.id,
              recepient: receiver.id,
              amount: req.body.amount
            });
            transaction.save(err => {
              if (err) {
                return res.status(400).json({ msg: err })
              }
              console.log("Transaction saved!");
            });
    
            res.status(200).json({msg: `Transfer successful! You have sent ${parseInt(req.body.amount)} to ${receiver.name}.` })
          } else {
            return res.status(400)
          }
        });
      });
  });