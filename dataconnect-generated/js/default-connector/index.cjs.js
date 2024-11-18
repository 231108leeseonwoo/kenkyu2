const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'my-app1',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

