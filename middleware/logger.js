const fs = require('fs').promises;

const logsPath = './logs/logs.json';

const logger = (req, res, next) => {
  const reqStartTime = new Date();
  const { method, originalUrl } = req;
  const eventName = `${originalUrl}-${method}`;
  console.log(`\tnew regquest: ${eventName}`);
  res.on('finish', async () => {
    const reqEndTime = new Date();
    const duration = reqEndTime - reqStartTime;
    console.log(`\trequest Ended(${duration}ms)`);
    console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
    await registerLog(eventName);
  });
  next();
};
async function registerLog(eventName) {
  try {
    const logs = JSON.parse((await fs.readFile(logsPath, 'utf-8')) || '{}');
    logs[eventName] = logs[eventName] ? logs[eventName] + 1 : 1;
    await fs.writeFile(logsPath, JSON.stringify(logs));
  } catch (err) {
    console.log(`Error on log for request`, err.message);
  }
}

module.exports = logger;
