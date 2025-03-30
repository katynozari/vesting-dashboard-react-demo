import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useChainId } from 'wagmi';
import { BaseError, ContractFunctionRevertedError, parseUnits } from 'viem';
import Papa from 'papaparse';
import DownloadSampleCSVFlexible from "./DownloadSampleCSVFlexible";
import { useNetworkContract } from '../useNetworkContract';
import { getExplorerUrls, getNetworkNames } from '../utils/NetworkUtils';

const VESTING_MANAGER_ROLE = '0xd810f479110c9771ec744414e571d78468b4e92a20f345df2ffbdc5f927a182e';
const TOKEN_DECIMALS = 18;

function MultipleVestingScheduleFlexibleForm() {
    const [csvContent, setCsvContent] = useState('');
    const [parsedData, setParsedData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [txHash, setTxHash] = useState('');


    const { writeContractAsync, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    });
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const { contractConfig: manageVestingContractConfig } = useNetworkContract('manageVestingContract');
    const { contractConfig: tokenContractConfig } = useNetworkContract('tokenContract');
    const chainId = useChainId();

    const checkOwnership = async (accountAddress) => {
        try {
            const owner = await publicClient.readContract({
                address: manageVestingContractConfig?.address,
                abi: manageVestingContractConfig?.abi,
                functionName: 'owner',
            });
            return owner.toLowerCase() === accountAddress.toLowerCase();
        } catch (error) {
            console.error('Error checking ownership:', error);
            return false;
        }
    };

    const checkVestingManagerRole = async () => {
        try {
            if (!tokenContractConfig?.address) {
                console.error('token Contract address is not set');
                return false;
            }

            const result = await publicClient.readContract({
                address: tokenContractConfig.address,
                abi: tokenContractConfig.abi,
                functionName: 'hasRole',
                args: [VESTING_MANAGER_ROLE, manageVestingContractConfig?.address],
            });
            console.log('hasRole result:', result);
            return result;
        } catch (error) {
            console.error('Error checking vesting manager role:', error);
            return false;
        }
    };

    const handleCsvChange = (e) => {
        setCsvContent(e.target.value);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true, // This tells Papa Parse to treat the first row as headers
            complete: (results) => {
                if (results.errors.length > 0) {
                    setErrorMessage('Error parsing CSV file. Please check the file format.');
                    setCsvContent('');
                } else {
                    // Convert parsed data back to CSV string format, excluding the header
                    const csvString = results.data.map(row =>
                        `${row.address},${row.amount},${row.start},${row.duration},${row.unit},${row.revocable}`
                    ).join('\n');
                    setCsvContent(csvString);
                    setErrorMessage('');
                }
            },
            error: (error) => {
                setErrorMessage(`Error reading file: ${error.message}`);
                setCsvContent('');
            }
        });
    };

    const parseVestingData = useCallback(() => {
        const rows = csvContent.split('\n').filter(row => row.trim() !== '');
        let parsedData = [];
        let errorRows = [];

        rows.forEach((row, index) => {
            const [address, amount, start, duration, unit, revocable] = row.split(',').map(item => item.trim());

            try {
                if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
                    throw new Error('Invalid Ethereum address format');
                }

                const parsedAmount = parseFloat(amount);
                const parsedStart = parseInt(start, 10);
                const parsedDuration = parseInt(duration, 10);
                const parsedUnit = parseInt(unit, 10);

                if (isNaN(parsedAmount) || isNaN(parsedStart) || isNaN(parsedDuration) || isNaN(parsedUnit)) {
                    throw new Error('Invalid numeric value');
                }

                const normalizedRevocable = revocable.toUpperCase();
                if (normalizedRevocable !== 'TRUE' && normalizedRevocable !== 'FALSE') {
                    throw new Error('Invalid boolean value for revocable');
                }

                parsedData.push({
                    address,
                    amount: parseUnits(parsedAmount.toString(), TOKEN_DECIMALS),
                    start: parsedStart,
                    duration: parsedDuration,
                    unit: parsedUnit,
                    revocable: normalizedRevocable === 'TRUE'
                });
            } catch (error) {
                errorRows.push({ row: index + 1, reason: error.message });
            }
        });

        if (errorRows.length > 0) {
            const errorMessage = errorRows.map(err => `Row ${err.row}: ${err.reason}`).join('; ');
            setErrorMessage(`Invalid data in CSV: ${errorMessage}`);
        } else {
            setErrorMessage('');
        }

        console.log('Parsed vesting data:', parsedData);
        setParsedData(parsedData);
    }, [csvContent]);


    useEffect(() => {
        parseVestingData();
    }, [parseVestingData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setTxHash('');

        if (!isConnected) {
            setErrorMessage('Wallet not connected. Please connect your wallet.');
            return;
        }

        const isOwner = await checkOwnership(address);
        if (!isOwner) {
            setErrorMessage('You are not authorized to create vesting schedules. Only the contract owner can perform this action.');
            return;
        }

        if (parsedData.length === 0) {
            setErrorMessage('Please enter valid vesting data.');
            return;
        }

        if (parsedData.length > 100) {
            setErrorMessage('Too many recipients. Maximum allowed is 100.');
            return;
        }

        if (!tokenContractConfig?.address) {
            setErrorMessage('Token Contract is not properly configured. Please check your network settings.');
            return;
        }

        if (!manageVestingContractConfig?.address) {
            setErrorMessage('Manage Vesting Contract is not properly configured. Please check your network settings.');
            return;
        }

        const isVestingManager = await checkVestingManagerRole();
        if (!isVestingManager) {
            setErrorMessage('The contract does not have the vesting manager role. Please grant this role before creating vesting schedules.');
            return;
        }


        try {
            // Format the data to match the expected input structure
            const vestingParams = parsedData.map(data => ({
                granter: data.address,
                amount: data.amount,
                start: data.start,
                duration: data.duration,
                unit: data.unit,
                revocable: data.revocable
            }));

            console.log('Submitting transaction with data:', vestingParams);

            const result = await writeContractAsync({
                address: manageVestingContractConfig?.address,
                abi: manageVestingContractConfig?.abi,
                functionName: 'createFlexibleVestingSchedules',
                args: [vestingParams],
            });

            setTxHash(result);
            setSuccessMessage('Transaction submitted. Waiting for confirmation...');
        } catch (error) {
            console.error('Transaction failed:', error);
            let errorMsg = 'Error creating multiple vesting schedules. ';

            if (error instanceof BaseError) {
                const revertError = error.walk(err => err instanceof ContractFunctionRevertedError);
                if (revertError instanceof ContractFunctionRevertedError) {
                    errorMsg += revertError.shortMessage || 'Contract call reverted.';
                }
            } else {
                errorMsg += error.message || (typeof error === 'string' ? error : JSON.stringify(error));
            }

            console.error('Detailed error:', error);
            setErrorMessage(errorMsg);
        }
    };

    useEffect(() => {
        if (isConfirmed) {
            setSuccessMessage('Multiple vesting schedules created successfully!');
            const timer = setTimeout(() => {
                setCsvContent('');
                setParsedData([]);
                setSuccessMessage('');
                setTxHash('');
            }, 60000);
            return () => clearTimeout(timer);
        }
    }, [isConfirmed]);

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="vesting-form">
                <div className="form-field">
                    <label>Vesting Data (per line address,amount,start,duration,unit,revocable or upload CSV):</label>
                    <textarea
                        value={csvContent}
                        onChange={handleCsvChange}
                        rows="10"
                        placeholder="0x1234...,100,1630000000,31536000,12,true"
                    />
                    <div className="sample-csv-container">
                        <DownloadSampleCSVFlexible />
                    </div>
                </div>
                <div className="form-field">
                    <label>Or upload CSV file:</label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isPending || isConfirming || !isConnected}
                    className="submit-button"
                >
                    {isPending ? 'Waiting for approval...' : isConfirming ? 'Confirming...' : 'Create Multiple Vesting Schedules'}
                </button>
                {parsedData.length > 0 && (
                    <p className="info-message">Number of vesting schedules to create: {parsedData.length}</p>
                )}
                <div className="transaction-status">
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {txHash && (
                        <p style={{ wordBreak: 'break-all', marginTop: '10px' }}>
                            <p>Transaction Hash: {txHash}</p>
                            {chainId && (
                                <>
                                    <p>Network: {getNetworkNames(chainId)}</p>
                                    {getExplorerUrls(chainId, txHash) ? (
                                        <a href={getExplorerUrls(chainId, txHash)} target="_blank" rel="noopener noreferrer">
                                            View on Explorer
                                        </a>
                                    ) : (
                                        <p>Explorer not available for this network</p>
                                    )}
                                </>
                            )}
                            {!chainId && <p>Network information not available</p>}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}

export default MultipleVestingScheduleFlexibleForm;