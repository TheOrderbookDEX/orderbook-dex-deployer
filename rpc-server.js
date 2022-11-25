const ganache = require('ganache');
const path = require('path');

void (async () => {
  await ganache.server({
    logging: {
        quiet: true,
    },
    database: {
        dbPath: path.resolve(__dirname, 'db'),
    },
    wallet: {
        accounts: [],
    },
  }).listen(8545);
    
  console.log('RPC server listening on http://localhost:8545/');
})();
