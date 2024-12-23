require("@nomiclabs/hardhat-ethers");
require("dotenv").config(); // Add this line
module.exports = {
    solidity: "0.8.0",
    networks: {
        sepolia: {
            url: "https://eth-sepolia.g.alchemy.com/v2/6u7ET674Owl43opQSo0RlEb6MVb4cZKZ", 
            accounts: [process.env.PRIVATE_KEY] // Use the private key from .env file
        },
    },
};
