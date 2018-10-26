'use strict';

const CronJob = require('cron').CronJob;

module.exports = new CronJob(
  '0 */30 * * * *',
  () => {
    console.log('Server is still alive');
  }, () => {
    console.log('Ticker has just been finished');
  }, false);
