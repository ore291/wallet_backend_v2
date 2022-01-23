const express = require("express");
const moment = require("moment");
const router = express.Router();
const { User, Transactions } = require('../../models');
router.get("/", (req, res) => {
  User.find({}, (err, accounts) => {
    if (err) {
      console.log(err);
    } else {
      Transactions.find({}, (err, transactions) => {
        if (err) {
          console.log(err);
        } else {
          transactions = transactions.map(transaction => {
            return {
              ...transaction,
              timestamp: moment(transaction.timestamp).format("dd/mm/yyyy")
            };
          });
          console.log("modified trans:", transactions);
        }
      });
    }
  });
});

module.exports = router;
