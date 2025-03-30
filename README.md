# Token Vesting Management DApp

A comprehensive decentralized application (DApp) for managing token vesting schedules, distributions, and administrative tasks. This platform provides a user-friendly interface for handling token vesting operations, including creating vesting schedules, managing distributions, and controlling access through role-based permissions.

![Logo](./src/logo.png)

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Usage Guide](#usage-guide)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

### Token Vesting Management
- **Individual Vesting Schedules**
  - Create customized vesting schedules for individual addresses
  - Set specific vesting parameters (duration, amount, cliff period)
  - Monitor vesting progress in real-time

- **Multiple Vesting Options**
  - Fixed Schedule: Create predetermined vesting schedules for multiple recipients
  - Flexible Schedule: Adjust vesting parameters dynamically
  - Batch processing capabilities for efficient management

- **Vesting Controls**
  - Revoke active vesting schedules
  - Modify vesting parameters (admin only)
  - Track vesting history and status

### Token Distribution System
- **Airdrop Management**
  - Standard airdrop distribution to multiple addresses
  - Flexible airdrop options with customizable parameters
  - Batch processing for efficient distribution

- **Token Operations**
  - Token approval management
  - Withdrawal functionality
  - Balance checking and monitoring

### Administrative Features
- **Role-Based Access Control (RBAC)**
  - Grant specific roles to addresses
  - Revoke roles from addresses
  - Role verification system
  - Hierarchical permission management

- **Monitoring and Analytics**
  - Real-time balance checking
  - Transferable token amount verification
  - Active grants monitoring
  - Role assignment overview

## Technology Stack

### Frontend
- React.js
- React Router for navigation
- CSS for styling
- Web3Modal for wallet connection

### Blockchain Integration
- WalletConnect for Web3 connectivity
- Wagmi hooks for Ethereum interactions
- Support for multiple Ethereum networks

### Development Tools
- Node.js
- npm/yarn package manager
- Web3 development tools

## Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- A Web3 wallet (MetaMask recommended)
- Access to Ethereum network (mainnet or testnet)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/vesting-management-dapp.git
cd vesting-management-dapp
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and add necessary environment variables
```env
REACT_APP_INFURA_ID=your_infura_id
REACT_APP_CHAIN_ID=1
```

4. Start the development server
```bash
npm start
```

5. Build for production
```bash
npm run build
```

## Architecture

The DApp follows a component-based architecture with:
- Main App container (`App.jsx`)
- Separate components for each functionality
- Dedicated forms for various operations
- Sidebar navigation system
- Real-time information panel

## Usage Guide

### Connecting to the DApp
1. Click the "Connect Wallet" button in the top right corner
2. Select your preferred Web3 wallet
3. Approve the connection request
4. Ensure you're connected to the correct network using the network selector

### Managing Vesting Schedules
1. Select "Vesting Schedule" from the sidebar
2. Fill in required details:
   - Recipient address
   - Token amount
   - Vesting duration
   - Cliff period (if applicable)
3. Confirm the transaction in your wallet

### Creating Multiple Vestings
1. Choose "Multiple Vesting" or "Flexible Multiple Vesting"
2. Upload CSV file or input data manually
3. Review all entries
4. Confirm batch transaction

### Managing Roles
1. Access role management through sidebar options
2. Grant or revoke roles as needed
3. Verify role assignments using the check function

### Token Distribution
1. Select appropriate distribution method
2. Input recipient addresses and amounts
3. Review distribution details
4. Confirm transaction

## Security

- Role-based access control for administrative functions
- Secure wallet connection handling
- Transaction confirmation requirements
- Input validation and sanitization

## Contributing

We welcome contributions to improve the Vesting Management DApp!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow existing code formatting
- Add comments for complex logic
- Update documentation as needed
- Include tests for new features

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

For support and queries:
- Create an issue in the GitHub repository
- Contact the development team at [your-email@example.com]
- Join our community Discord server [Add Discord link]

---

Built with ❤️ by [KatyNozari]
