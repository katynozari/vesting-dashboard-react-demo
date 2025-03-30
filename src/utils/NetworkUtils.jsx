// src/utils/NetworkUtils.jsx

export const getExplorerUrls = (chainId, txHash) => {
    switch (chainId) {
        case 1: // Ethereum Mainnet
            return `https://etherscan.io/tx/${txHash}`;
        case 5: // Goerli Testnet
            return `https://goerli.etherscan.io/tx/${txHash}`;
        case 17000: // Holesky Testnet
            return `https://holesky.etherscan.io/tx/${txHash}`;
        case 56: // BSC Mainnet
            return `https://bscscan.com/tx/${txHash}`;
        case 97: // BSC Testnet
            return `https://testnet.bscscan.com/tx/${txHash}`;
        case 137: // Polygon Mainnet
            return `https://polygonscan.com/tx/${txHash}`;
        case 80001: // Mumbai Testnet
            return `https://mumbai.polygonscan.com/tx/${txHash}`;
        case 728126428: //TRON 
            return `https://tronscan.org/tx/${txHash}`;
        // Add more networks as needed
        default:
            return null; // Return null if the network is not recognized
    }
};

export const getNetworkNames = (chainId) => {
    switch (chainId) {
        case 1: return "Ethereum Mainnet";
        case 5: return "Goerli Testnet";
        case 17000: return "Holesky Testnet";
        case 56: return "BSC Mainnet";
        case 97: return "BSC Testnet";
        case 137: return "Polygon Mainnet";
        case 80001: return "Mumbai Testnet";
        case 728126428: return "Tron Mainnet";
        // Add more networks as needed
        default: return "Unknown Network";
    }
};