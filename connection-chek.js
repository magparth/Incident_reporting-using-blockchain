

const { Network, Alchemy } = require("alchemy-sdk");

const settings = {
  apiKey:"enter api key", 
  network: Network.ETH_SEPOLIA, // Replace with your network.
};

const alchemy = new Alchemy(settings);

alchemy.core.getBlock(15221026).then(console.log);
