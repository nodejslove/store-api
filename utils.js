const fs = require('fs').promises;

const checkLogDirectoryExistance = async (path) => {
  const result = await fs.stat(path);
  if (!result.isFile()) {
    await fs.writeFile(path, '{}');
    return;
  }
  const logs = await fs.readFile(path, 'utf-8');
  if (logs === '') {
    await fs.writeFile(path, '{}');
  }
};

module.exports = checkLogDirectoryExistance;
