const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const Fir = await hre.ethers.getContractFactory("Fir");

    // Deploy the contract
    const fir = await Fir.deploy();

    // Wait for the deployment transaction to be mined
    const tx = await fir.deployTransaction.wait();

    // Log the deployed contract address and the transaction hash
    console.log("incident deployed to:", fir.address);
    console.log("Transaction hash:", tx.transactionHash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
