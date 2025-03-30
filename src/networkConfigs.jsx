export const networkConfigs = {
    // Holesky (Ethereum Testnet)
    17000: {
        chainId: '0x4268',
        chainName: 'Holesky',
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://ethereum-holesky-rpc.publicnode.com'],
        blockExplorerUrls: ['https://holesky.etherscan.io/'],
        contracts: {
            tokenContract: {
                address: '0x199B07B2Cd39d0D975C726E036B4F8547965fc73',
                abi: [
                    {
                        "type": "constructor",
                        "inputs":
                            [
                                {
                                    "name": "_admin",
                                    "type": "address",
                                    "internalType": "address"
                                },
                                {
                                    "name": "_vestingManager",
                                    "type": "address",
                                    "internalType": "address"
                                }
                            ],
                        "stateMutability": "nonpayable"
                    },
                    {
                        "type": "function",
                        "name": "DEFAULT_ADMIN_ROLE",
                        "inputs":
                            [],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "bytes32",
                                    "internalType": "bytes32"
                                }
                            ],
                        "stateMutability": "view"
                    },
                    {
                        "type": "function",
                        "name": "VESTING_MANAGER_ROLE",
                        "inputs":
                            [],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "bytes32",
                                    "internalType": "bytes32"
                                }
                            ],
                        "stateMutability": "view"
                    },
                    {
                        "type": "function",
                        "name": "allowance",
                        "inputs":
                            [
                                {
                                    "name": "owner",
                                    "type": "address",
                                    "internalType": "address"
                                },
                                {
                                    "name": "spender",
                                    "type": "address",
                                    "internalType": "address"
                                }
                            ],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                }
                            ],
                        "stateMutability": "view"
                    },
                    {
                        "type": "function",
                        "name": "approve",
                        "inputs":
                            [
                                {
                                    "name": "spender",
                                    "type": "address",
                                    "internalType": "address"
                                },
                                {
                                    "name": "value",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                }
                            ],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "bool",
                                    "internalType": "bool"
                                }
                            ],
                        "stateMutability": "nonpayable"
                    },
                    {
                        "type": "function",
                        "name": "balanceOf",
                        "inputs":
                            [
                                {
                                    "name": "account",
                                    "type": "address",
                                    "internalType": "address"
                                }
                            ],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                }
                            ],
                        "stateMutability": "view"
                    },
                    {
                        "type": "function",
                        "name": "createVestingSchedule",
                        "inputs":
                            [
                                {
                                    "name": "granter",
                                    "type": "address",
                                    "internalType": "address"
                                },
                                {
                                    "name": "amount",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                },
                                {
                                    "name": "start",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                },
                                {
                                    "name": "duration",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                },
                                {
                                    "name": "unit",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                },
                                {
                                    "name": "revocable",
                                    "type": "bool",
                                    "internalType": "bool"
                                }
                            ],
                        "outputs":
                            [],
                        "stateMutability": "nonpayable"
                    },
                    {
                        "type": "function",
                        "name": "decimals",
                        "inputs":
                            [],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "uint8",
                                    "internalType": "uint8"
                                }
                            ],
                        "stateMutability": "view"
                    },
                    {
                        "type": "function",
                        "name": "getGrants",
                        "inputs":
                            [
                                {
                                    "name": "granter",
                                    "type": "address",
                                    "internalType": "address"
                                }
                            ],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "tuple[]",
                                    "internalType": "struct TokenEstate.GrantInfo[]",
                                    "components":
                                        [
                                            {
                                                "name": "schedule",
                                                "type": "tuple",
                                                "internalType": "struct TokenEstate.VestingSchedule",
                                                "components":
                                                    [
                                                        {
                                                            "name": "granter",
                                                            "type": "address",
                                                            "internalType": "address"
                                                        },
                                                        {
                                                            "name": "amount",
                                                            "type": "uint256",
                                                            "internalType": "uint256"
                                                        },
                                                        {
                                                            "name": "start",
                                                            "type": "uint256",
                                                            "internalType": "uint256"
                                                        },
                                                        {
                                                            "name": "duration",
                                                            "type": "uint256",
                                                            "internalType": "uint256"
                                                        },
                                                        {
                                                            "name": "unit",
                                                            "type": "uint256",
                                                            "internalType": "uint256"
                                                        },
                                                        {
                                                            "name": "revocable",
                                                            "type": "bool",
                                                            "internalType": "bool"
                                                        }
                                                    ]
                                            },
                                            {
                                                "name": "releaseTokens",
                                                "type": "uint256",
                                                "internalType": "uint256"
                                            }
                                        ]
                                }
                            ],
                        "stateMutability": "view"
                    },
                    {
                        "type": "function",
                        "name": "getRoleAdmin",
                        "inputs":
                            [
                                {
                                    "name": "role",
                                    "type": "bytes32",
                                    "internalType": "bytes32"
                                }
                            ],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "bytes32",
                                    "internalType": "bytes32"
                                }
                            ],
                        "stateMutability": "view"
                    },
                    {
                        "type": "function",
                        "name": "grantRole",
                        "inputs":
                            [
                                {
                                    "name": "role",
                                    "type": "bytes32",
                                    "internalType": "bytes32"
                                },
                                {
                                    "name": "account",
                                    "type": "address",
                                    "internalType": "address"
                                }
                            ],
                        "outputs":
                            [],
                        "stateMutability": "nonpayable"
                    },
                    {
                        "type": "function",
                        "name": "grants",
                        "inputs":
                            [
                                {
                                    "name": "",
                                    "type": "address",
                                    "internalType": "address"
                                },
                                {
                                    "name": "",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                }
                            ],
                        "outputs":
                            [
                                {
                                    "name": "granter",
                                    "type": "address",
                                    "internalType": "address"
                                },
                                {
                                    "name": "amount",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                },
                                {
                                    "name": "start",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                },
                                {
                                    "name": "duration",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                },
                                {
                                    "name": "unit",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                },
                                {
                                    "name": "revocable",
                                    "type": "bool",
                                    "internalType": "bool"
                                }
                            ],
                        "stateMutability": "view"
                    },
                    {
                        "type": "function",
                        "name": "hasRole",
                        "inputs":
                            [
                                {
                                    "name": "role",
                                    "type": "bytes32",
                                    "internalType": "bytes32"
                                },
                                {
                                    "name": "account",
                                    "type": "address",
                                    "internalType": "address"
                                }
                            ],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "bool",
                                    "internalType": "bool"
                                }
                            ],
                        "stateMutability": "view"
                    },
                    {
                        "type": "function",
                        "name": "name",
                        "inputs":
                            [],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "string",
                                    "internalType": "string"
                                }
                            ],
                        "stateMutability": "view"
                    },
                    {
                        "type": "function",
                        "name": "renounceRole",
                        "inputs":
                            [
                                {
                                    "name": "role",
                                    "type": "bytes32",
                                    "internalType": "bytes32"
                                },
                                {
                                    "name": "callerConfirmation",
                                    "type": "address",
                                    "internalType": "address"
                                }
                            ],
                        "outputs":
                            [],
                        "stateMutability": "nonpayable"
                    },
                    {
                        "type": "function",
                        "name": "revokeRole",
                        "inputs":
                            [
                                {
                                    "name": "role",
                                    "type": "bytes32",
                                    "internalType": "bytes32"
                                },
                                {
                                    "name": "account",
                                    "type": "address",
                                    "internalType": "address"
                                }
                            ],
                        "outputs":
                            [],
                        "stateMutability": "nonpayable"
                    },
                    {
                        "type": "function",
                        "name": "revokeVestingSchedule",
                        "inputs":
                            [
                                {
                                    "name": "granter",
                                    "type": "address",
                                    "internalType": "address"
                                },
                                {
                                    "name": "grantIndex",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                }
                            ],
                        "outputs":
                            [],
                        "stateMutability": "nonpayable"
                    },
                    {
                        "type": "function",
                        "name": "supportsInterface",
                        "inputs":
                            [
                                {
                                    "name": "interfaceId",
                                    "type": "bytes4",
                                    "internalType": "bytes4"
                                }
                            ],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "bool",
                                    "internalType": "bool"
                                }
                            ],
                        "stateMutability": "view"
                    },
                    {
                        "type": "function",
                        "name": "symbol",
                        "inputs":
                            [],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "string",
                                    "internalType": "string"
                                }
                            ],
                        "stateMutability": "view"
                    },
                    {
                        "type": "function",
                        "name": "totalSupply",
                        "inputs":
                            [],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                }
                            ],
                        "stateMutability": "view"
                    },
                    {
                        "type": "function",
                        "name": "transfer",
                        "inputs":
                            [
                                {
                                    "name": "to",
                                    "type": "address",
                                    "internalType": "address"
                                },
                                {
                                    "name": "amount",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                }
                            ],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "bool",
                                    "internalType": "bool"
                                }
                            ],
                        "stateMutability": "nonpayable"
                    },
                    {
                        "type": "function",
                        "name": "transferFrom",
                        "inputs":
                            [
                                {
                                    "name": "from",
                                    "type": "address",
                                    "internalType": "address"
                                },
                                {
                                    "name": "to",
                                    "type": "address",
                                    "internalType": "address"
                                },
                                {
                                    "name": "amount",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                }
                            ],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "bool",
                                    "internalType": "bool"
                                }
                            ],
                        "stateMutability": "nonpayable"
                    },
                    {
                        "type": "function",
                        "name": "transferableTokens",
                        "inputs":
                            [
                                {
                                    "name": "holder",
                                    "type": "address",
                                    "internalType": "address"
                                }
                            ],
                        "outputs":
                            [
                                {
                                    "name": "",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                }
                            ],
                        "stateMutability": "view"
                    },
                    {
                        "type": "event",
                        "name": "Approval",
                        "inputs":
                            [
                                {
                                    "name": "owner",
                                    "type": "address",
                                    "indexed": true,
                                    "internalType": "address"
                                },
                                {
                                    "name": "spender",
                                    "type": "address",
                                    "indexed": true,
                                    "internalType": "address"
                                },
                                {
                                    "name": "value",
                                    "type": "uint256",
                                    "indexed": false,
                                    "internalType": "uint256"
                                }
                            ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "RoleAdminChanged",
                        "inputs":
                            [
                                {
                                    "name": "role",
                                    "type": "bytes32",
                                    "indexed": true,
                                    "internalType": "bytes32"
                                },
                                {
                                    "name": "previousAdminRole",
                                    "type": "bytes32",
                                    "indexed": true,
                                    "internalType": "bytes32"
                                },
                                {
                                    "name": "newAdminRole",
                                    "type": "bytes32",
                                    "indexed": true,
                                    "internalType": "bytes32"
                                }
                            ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "RoleGranted",
                        "inputs":
                            [
                                {
                                    "name": "role",
                                    "type": "bytes32",
                                    "indexed": true,
                                    "internalType": "bytes32"
                                },
                                {
                                    "name": "account",
                                    "type": "address",
                                    "indexed": true,
                                    "internalType": "address"
                                },
                                {
                                    "name": "sender",
                                    "type": "address",
                                    "indexed": true,
                                    "internalType": "address"
                                }
                            ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "RoleRevoked",
                        "inputs":
                            [
                                {
                                    "name": "role",
                                    "type": "bytes32",
                                    "indexed": true,
                                    "internalType": "bytes32"
                                },
                                {
                                    "name": "account",
                                    "type": "address",
                                    "indexed": true,
                                    "internalType": "address"
                                },
                                {
                                    "name": "sender",
                                    "type": "address",
                                    "indexed": true,
                                    "internalType": "address"
                                }
                            ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "TokensVested",
                        "inputs":
                            [
                                {
                                    "name": "holder",
                                    "type": "address",
                                    "indexed": true,
                                    "internalType": "address"
                                },
                                {
                                    "name": "amount",
                                    "type": "uint256",
                                    "indexed": false,
                                    "internalType": "uint256"
                                }
                            ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "Transfer",
                        "inputs":
                            [
                                {
                                    "name": "from",
                                    "type": "address",
                                    "indexed": true,
                                    "internalType": "address"
                                },
                                {
                                    "name": "to",
                                    "type": "address",
                                    "indexed": true,
                                    "internalType": "address"
                                },
                                {
                                    "name": "value",
                                    "type": "uint256",
                                    "indexed": false,
                                    "internalType": "uint256"
                                }
                            ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "VestingScheduleCreated",
                        "inputs":
                            [
                                {
                                    "name": "from",
                                    "type": "address",
                                    "indexed": true,
                                    "internalType": "address"
                                },
                                {
                                    "name": "to",
                                    "type": "address",
                                    "indexed": true,
                                    "internalType": "address"
                                },
                                {
                                    "name": "amount",
                                    "type": "uint256",
                                    "indexed": false,
                                    "internalType": "uint256"
                                },
                                {
                                    "name": "start",
                                    "type": "uint256",
                                    "indexed": false,
                                    "internalType": "uint256"
                                },
                                {
                                    "name": "duration",
                                    "type": "uint256",
                                    "indexed": false,
                                    "internalType": "uint256"
                                },
                                {
                                    "name": "unit",
                                    "type": "uint256",
                                    "indexed": false,
                                    "internalType": "uint256"
                                },
                                {
                                    "name": "revocable",
                                    "type": "bool",
                                    "indexed": false,
                                    "internalType": "bool"
                                }
                            ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "VestingScheduleRevoked",
                        "inputs":
                            [
                                {
                                    "name": "holder",
                                    "type": "address",
                                    "indexed": true,
                                    "internalType": "address"
                                },
                                {
                                    "name": "grantId",
                                    "type": "uint256",
                                    "indexed": false,
                                    "internalType": "uint256"
                                }
                            ],
                        "anonymous": false
                    },
                    {
                        "type": "error",
                        "name": "AccessControlBadConfirmation",
                        "inputs":
                            []
                    },
                    {
                        "type": "error",
                        "name": "AccessControlUnauthorizedAccount",
                        "inputs":
                            [
                                {
                                    "name": "account",
                                    "type": "address",
                                    "internalType": "address"
                                },
                                {
                                    "name": "neededRole",
                                    "type": "bytes32",
                                    "internalType": "bytes32"
                                }
                            ]
                    },
                    {
                        "type": "error",
                        "name": "CannotTransfer",
                        "inputs":
                            [
                                {
                                    "name": "message",
                                    "type": "string",
                                    "internalType": "string"
                                }
                            ]
                    },
                    {
                        "type": "error",
                        "name": "ERC20InsufficientAllowance",
                        "inputs":
                            [
                                {
                                    "name": "spender",
                                    "type": "address",
                                    "internalType": "address"
                                },
                                {
                                    "name": "allowance",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                },
                                {
                                    "name": "needed",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                }
                            ]
                    },
                    {
                        "type": "error",
                        "name": "ERC20InsufficientBalance",
                        "inputs":
                            [
                                {
                                    "name": "sender",
                                    "type": "address",
                                    "internalType": "address"
                                },
                                {
                                    "name": "balance",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                },
                                {
                                    "name": "needed",
                                    "type": "uint256",
                                    "internalType": "uint256"
                                }
                            ]
                    },
                    {
                        "type": "error",
                        "name": "ERC20InvalidApprover",
                        "inputs":
                            [
                                {
                                    "name": "approver",
                                    "type": "address",
                                    "internalType": "address"
                                }
                            ]
                    },
                    {
                        "type": "error",
                        "name": "ERC20InvalidReceiver",
                        "inputs":
                            [
                                {
                                    "name": "receiver",
                                    "type": "address",
                                    "internalType": "address"
                                }
                            ]
                    },
                    {
                        "type": "error",
                        "name": "ERC20InvalidSender",
                        "inputs":
                            [
                                {
                                    "name": "sender",
                                    "type": "address",
                                    "internalType": "address"
                                }
                            ]
                    },
                    {
                        "type": "error",
                        "name": "ERC20InvalidSpender",
                        "inputs":
                            [
                                {
                                    "name": "spender",
                                    "type": "address",
                                    "internalType": "address"
                                }
                            ]
                    },
                    {
                        "type": "error",
                        "name": "NotRevocableGrant",
                        "inputs":
                            [
                                {
                                    "name": "message",
                                    "type": "string",
                                    "internalType": "string"
                                }
                            ]
                    }
                ],
            },
            manageVestingContract: {
                //address: '0xa57716Fe9Fd7a055Dac299060BE16144F7A3a3a7', vesting for TOKE token (0xEa14D58088CC5050fC7e636b0424a296e733b4c6) (real estate, agri token) 
                address: '0x65C9ca60058E6c1989A6e015FD7E3E9eFf455440',
                abi: [
                    {
                        "inputs":
                            [
                                {
                                    "internalType": "address",
                                    "name": "_initialOwner",
                                    "type": "address"
                                },
                                {
                                    "internalType": "address",
                                    "name": "_lmtToken",
                                    "type": "address"
                                }
                            ],
                        "stateMutability": "nonpayable",
                        "type": "constructor"
                    },
                    {
                        "inputs":
                            [
                                {
                                    "internalType": "address",
                                    "name": "target",
                                    "type": "address"
                                }
                            ],
                        "name": "AddressEmptyCode",
                        "type": "error"
                    },
                    {
                        "inputs":
                            [
                                {
                                    "internalType": "address",
                                    "name": "account",
                                    "type": "address"
                                }
                            ],
                        "name": "AddressInsufficientBalance",
                        "type": "error"
                    },
                    {
                        "inputs":
                            [],
                        "name": "EnforcedPause",
                        "type": "error"
                    },
                    {
                        "inputs":
                            [],
                        "name": "ExpectedPause",
                        "type": "error"
                    },
                    {
                        "inputs":
                            [],
                        "name": "FailedInnerCall",
                        "type": "error"
                    },
                    {
                        "inputs":
                            [
                                {
                                    "internalType": "string",
                                    "name": "message",
                                    "type": "string"
                                }
                            ],
                        "name": "InsufficientTokenAllowance",
                        "type": "error"
                    },
                    {
                        "inputs":
                            [
                                {
                                    "internalType": "string",
                                    "name": "message",
                                    "type": "string"
                                }
                            ],
                        "name": "InsufficientValue",
                        "type": "error"
                    },
                    {
                        "inputs":
                            [
                                {
                                    "internalType": "address",
                                    "name": "owner",
                                    "type": "address"
                                }
                            ],
                        "name": "OwnableInvalidOwner",
                        "type": "error"
                    },
                    {
                        "inputs":
                            [
                                {
                                    "internalType": "address",
                                    "name": "account",
                                    "type": "address"
                                }
                            ],
                        "name": "OwnableUnauthorizedAccount",
                        "type": "error"
                    },
                    {
                        "inputs":
                            [],
                        "name": "ReentrancyGuardReentrantCall",
                        "type": "error"
                    },
                    {
                        "inputs":
                            [
                                {
                                    "internalType": "address",
                                    "name": "token",
                                    "type": "address"
                                }
                            ],
                        "name": "SafeERC20FailedOperation",
                        "type": "error"
                    },
                    {
                        "anonymous": false,
                        "inputs":
                            [
                                {
                                    "indexed": true,
                                    "internalType": "address",
                                    "name": "previousOwner",
                                    "type": "address"
                                },
                                {
                                    "indexed": true,
                                    "internalType": "address",
                                    "name": "newOwner",
                                    "type": "address"
                                }
                            ],
                        "name": "OwnershipTransferred",
                        "type": "event"
                    },
                    {
                        "anonymous": false,
                        "inputs":
                            [
                                {
                                    "indexed": false,
                                    "internalType": "address",
                                    "name": "account",
                                    "type": "address"
                                }
                            ],
                        "name": "Paused",
                        "type": "event"
                    },
                    {
                        "anonymous": false,
                        "inputs":
                            [
                                {
                                    "indexed": true,
                                    "internalType": "address",
                                    "name": "operator",
                                    "type": "address"
                                },
                                {
                                    "indexed": false,
                                    "internalType": "uint256",
                                    "name": "recipientCount",
                                    "type": "uint256"
                                },
                                {
                                    "indexed": false,
                                    "internalType": "uint256",
                                    "name": "totalAmount",
                                    "type": "uint256"
                                }
                            ],
                        "name": "TokenDistribution",
                        "type": "event"
                    },
                    {
                        "anonymous": false,
                        "inputs":
                            [
                                {
                                    "indexed": true,
                                    "internalType": "address",
                                    "name": "tokenAddress",
                                    "type": "address"
                                },
                                {
                                    "indexed": true,
                                    "internalType": "address",
                                    "name": "owner",
                                    "type": "address"
                                }
                            ],
                        "name": "TokenWithdrawn",
                        "type": "event"
                    },
                    {
                        "anonymous": false,
                        "inputs":
                            [
                                {
                                    "indexed": false,
                                    "internalType": "address",
                                    "name": "account",
                                    "type": "address"
                                }
                            ],
                        "name": "Unpaused",
                        "type": "event"
                    },
                    {
                        "inputs":
                            [
                                {
                                    "internalType": "address[]",
                                    "name": "granters",
                                    "type": "address[]"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amount",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "start",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "duration",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "unit",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "revocable",
                                    "type": "bool"
                                }
                            ],
                        "name": "createFixedVestingSchedules",
                        "outputs":
                            [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs":
                            [
                                {
                                    "components":
                                        [
                                            {
                                                "internalType": "address",
                                                "name": "granter",
                                                "type": "address"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "amount",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "start",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "duration",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "unit",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "bool",
                                                "name": "revocable",
                                                "type": "bool"
                                            }
                                        ],
                                    "internalType": "struct LMTdcVestingManager.VestingParams[]",
                                    "name": "params",
                                    "type": "tuple[]"
                                }
                            ],
                        "name": "createFlexibleVestingSchedules",
                        "outputs":
                            [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs":
                            [
                                {
                                    "internalType": "address[]",
                                    "name": "recipients",
                                    "type": "address[]"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amount",
                                    "type": "uint256"
                                }
                            ],
                        "name": "distributeFixedAirdrop",
                        "outputs":
                            [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs":
                            [
                                {
                                    "internalType": "address[]",
                                    "name": "recipients",
                                    "type": "address[]"
                                },
                                {
                                    "internalType": "uint256[]",
                                    "name": "amounts",
                                    "type": "uint256[]"
                                }
                            ],
                        "name": "distributeFlexibleAirdrop",
                        "outputs":
                            [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs":
                            [],
                        "name": "lmtToken",
                        "outputs":
                            [
                                {
                                    "internalType": "contract LimitlessCoin",
                                    "name": "",
                                    "type": "address"
                                }
                            ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs":
                            [],
                        "name": "owner",
                        "outputs":
                            [
                                {
                                    "internalType": "address",
                                    "name": "",
                                    "type": "address"
                                }
                            ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs":
                            [],
                        "name": "pause",
                        "outputs":
                            [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs":
                            [],
                        "name": "paused",
                        "outputs":
                            [
                                {
                                    "internalType": "bool",
                                    "name": "",
                                    "type": "bool"
                                }
                            ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs":
                            [],
                        "name": "renounceOwnership",
                        "outputs":
                            [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs":
                            [
                                {
                                    "internalType": "address",
                                    "name": "newOwner",
                                    "type": "address"
                                }
                            ],
                        "name": "transferOwnership",
                        "outputs":
                            [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs":
                            [],
                        "name": "unpause",
                        "outputs":
                            [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs":
                            [
                                {
                                    "internalType": "address",
                                    "name": "tokenAddress",
                                    "type": "address"
                                }
                            ],
                        "name": "withdrawToken",
                        "outputs":
                            [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }
                ],

            }
        }
    },

    // Binance Smart Chain Testnet
    // 97: {
    //     chainId: '0x61',
    //     chainName: 'BSC Testnet',
    //     nativeCurrency: {
    //         name: 'Binance Coin',
    //         symbol: 'tBNB',
    //         decimals: 18,
    //     },
    //     rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    //     blockExplorerUrls: ['https://testnet.bscscan.com'],
    //     contracts: {
    //         tokenContract: {
    //             address: '0x199B07B2Cd39d0D975C726E036B4F8547965fc73',
    //             abi: [],
    //         },
    //         manageVestingContract: {
    //             address: '0x...',  // Your contract address on BSC Testnet
    //             abi: [],  // Your contract ABI
    //         },

    //         // Add other contracts for this network...
    //     },
    // },

};