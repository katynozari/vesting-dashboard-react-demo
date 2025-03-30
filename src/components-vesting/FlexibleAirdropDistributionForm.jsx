import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useChainId } from 'wagmi';
import { BaseError, ContractFunctionRevertedError, parseUnits } from 'viem';
import Papa from 'papaparse';
import DownloadSampleCSVFlexibleAirdrop from './DownloadSampleCsvFlexibleAirdrop';
import { useNetworkContract } from '../useNetworkContract';
import { getExplorerUrls, getNetworkNames } from '../utils/NetworkUtils';

const TOKEN_DECIMALS = 18;

function FlexibleAirdropDistributionForm() {
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
    const { contractConfig } = useNetworkContract('manageVestingContract');
    const chainId = useChainId();

    const checkOwnership = async (accountAddress) => {
        try {
            const owner = await publicClient.readContract({
                address: contractConfig?.address,
                abi: contractConfig?.abi,
                functionName: 'owner',
            });
            return owner.toLowerCase() === accountAddress.toLowerCase();
        } catch (error) {
            console.error('Error checking ownership:', error);
            return false;
        }
    };

    const handleCsvChange = (e) => {
        setCsvContent(e.target.value);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    setErrorMessage('Error parsing CSV file. Please check the format.');
                    setCsvContent('');
                } else {
                    const csvString = results.data
                        .map(row => `${row.address || ''},${row.amount || ''}`)
                        .join('\n');
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

    const parseData = useCallback(() => {
        const data = csvContent
            .split('\n')
            .map(line => {
                const [address, amount] = line.split(',').map(item => item.trim());
                return { address, amount };
            })
            .filter(item => item.address !== '' && item.amount !== '');

        let validData = [];
        let errorRows = [];

        data.forEach((item, index) => {
            if (!/^0x[a-fA-F0-9]{40}$/.test(item.address)) {
                errorRows.push({ row: index + 1, reason: 'Invalid address format' });
            } else if (isNaN(parseFloat(item.amount)) || parseFloat(item.amount) <= 0) {
                errorRows.push({ row: index + 1, reason: 'Invalid amount' });
            } else {
                validData.push(item);
            }
        });

        if (errorRows.length > 0) {
            const errorMessage = errorRows.map(err => `Row ${err.row}: ${err.reason}`).join('; ');
            setErrorMessage(`Invalid data: ${errorMessage}`);
        } else {
            setErrorMessage('');
        }

        setParsedData(validData);
    }, [csvContent]);

    useEffect(() => {
        parseData();
    }, [parseData]);

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
            setErrorMessage('You are not authorized to distribute airdrops. Only the contract owner can perform this action.');
            return;
        }

        if (parsedData.length === 0) {
            setErrorMessage('Please enter at least one valid recipient with an amount.');
            return;
        }

        try {
            const recipients = parsedData.map(item => item.address);
            const amounts = parsedData.map(item => parseUnits(item.amount, TOKEN_DECIMALS));

            const result = await writeContractAsync({
                address: contractConfig?.address,
                abi: contractConfig?.abi,
                functionName: 'distributeFlexibleAirdrop',
                args: [recipients, amounts],
            });

            setTxHash(result);
            setSuccessMessage('Transaction submitted. Waiting for confirmation...');
        } catch (error) {
            console.error('Transaction failed:', error);
            let errorMsg = 'Error distributing flexible airdrop. ';

            if (error instanceof BaseError) {
                const revertError = error.walk(err => err instanceof ContractFunctionRevertedError);
                if (revertError instanceof ContractFunctionRevertedError) {
                    errorMsg += revertError.shortMessage || 'Contract call reverted.';
                }
            } else {
                errorMsg += error.message || (typeof error === 'string' ? error : JSON.stringify(error));
            }

            setErrorMessage(errorMsg);
        }
    };

    useEffect(() => {
        if (isConfirmed) {
            setSuccessMessage('Flexible airdrop distributed successfully!');
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
            <form onSubmit={handleSubmit} className="internal-form">
                <div className="form-field">
                    <label>Recipient Addresses and Amounts (format: address,amount - one per line):</label>
                    <textarea
                        value={csvContent}
                        onChange={handleCsvChange}
                        rows="10"
                        placeholder="0x1234...,100&#10;0x5678...,200"
                    />
                    <div className="sample-csv-container">
                        <DownloadSampleCSVFlexibleAirdrop />
                    </div>
                </div>
                <div className="form-field">
                    <label>Or upload CSV file (two columns: address, amount):</label>
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
                    {isPending ? 'Waiting for approval...' : isConfirming ? 'Confirming...' : 'Distribute Flexible Airdrop'}
                </button>
                {parsedData.length > 0 && (
                    <p className="info-message">Number of valid recipients: {parsedData.length}</p>
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

export default FlexibleAirdropDistributionForm;