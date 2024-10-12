const fs = require('fs');
const path = require('path');

const tempDir = path.resolve(__dirname, '../..', 'tmp');

module.exports = async () => {
  const files = await fs.promises.readdir(tempDir);

  const deleteFilePromises = files.map((file) => {
    return fs.promises.unlink(path.join(tempDir, file));
  });

  await Promise.all(deleteFilePromises)
    .then(() => {
      console.log('All temp files deleted');
    })
    .catch((error) => {
      console.error('Error cleaning up temp files:', error);
    });
};
