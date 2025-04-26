import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
  apiKey: "tF_nnTXDR1ZAP6cejc5WWqsu5uMLdTgT",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// get all the sent transactions from given address
const sentTransactions = alchemy.core.getAssetTransfers({
  fromBlock: "0x0",
  fromAddress: "0x994b342dd87fc825f66e51ffa3ef71ad818b6893",
  category: ["erc721", "external", "erc20"],
}).then(response => {
  console.log('Sent Transactions:', response);
  return response;
}).catch(error => {
  console.error('Error fetching transactions:', error);
  throw error;
});

// Additional function to get latest block number
async function getLatestBlockNumber() {
  try {
    const blockNumber = await alchemy.core.getBlockNumber();
    console.log('Latest Block Number:', blockNumber);
    return blockNumber;
  } catch (error) {
    console.error('Error fetching block number:', error);
    throw error;
  }
}

// Function to get a specific block
async function getSpecificBlock() {
  try {
    const block = await alchemy.core.getBlock(15221026);
    console.log('Specific Block (15221026):', block);
    return block;
  } catch (error) {
    console.error('Error fetching specific block:', error);
    throw error;
  }
}

// Execute the functions
async function main() {
  await getLatestBlockNumber();
  await sentTransactions;
  await getSpecificBlock();
}

main().catch(console.error); 