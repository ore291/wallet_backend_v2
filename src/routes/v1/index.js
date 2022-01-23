const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const depositRoute = require('./depositRoute.js');
const withdrawRoute = require('./withdrawRoute.js');
const fundTransferRoute = require('./fundtransferRoute');
const verifyKycRoute = require('./verifyKyc.route');
const transactionHistoryRoute = require('./transactionhistoryRoute')
const config = require('../../config/config');


const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/deposit',
    route: depositRoute,
  },
  {
    path: '/withdraw',
    route: withdrawRoute,
  },
  {
    path: '/transfer',
    route: fundTransferRoute,
  },
  {
    path: '/verify',
    route: verifyKycRoute,
  },
  {
    path: '/transactions',
    route: transactionHistoryRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
