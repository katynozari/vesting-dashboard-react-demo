import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useChainId } from 'wagmi';
import { BaseError, ContractFunctionRevertedError, parseUnits } from 'viem';
import Papa from 'papaparse';
import DownloadSampleCSVJustAddresses from './DownloadSampleCSVJustAddresses';
import { useNetworkContract } from '../useNetworkContract';
import { getExplorerUrls, getNetworkNames } from '../utils/NetworkUtils';

const VESTING_MANAGER_ROLE = '0xd810f479110c9771ec744414e571d78468b4e92a20f345df2ffbdc5f927a182e';
const TOKEN_DECIMALS = 18;

function MultipleVestingScheduleForm() {
    const [formData, setFormData] = useState({
        amount: '',
        startDate: '',
        useCurrentTimestamp: false,
        duration: '',
        unit: '',
        revocable: false,
    });
    const [csvContent, setCsvContent] = useState('');
    const [parsedAddresses, setParsedAddresses] = useState([]);
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
                console.error('Token Contract address is not set');
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
            complete: (results) => {
                const addresses = results.data
                    .flat()
                    .map(address => address.trim().replace(/^"|"$/g, '')) // Remove quotes
                    .filter(address => address !== '' && address !== 'Recipient Address');
                setCsvContent(addresses.join('\n'));
                setErrorMessage('');
            },
            error: (error) => {
                setErrorMessage(`Error reading file: ${error.message}`);
                setCsvContent('');
            }
        });
    };

    const parseAddresses = useCallback(() => {
        const addresses = csvContent.split('\n').filter(address => address.trim() !== '');
        let validAddresses = [];
        let errorRows = [];

        addresses.forEach((address, index) => {
            address = address.trim();
            if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
                validAddresses.push(address);
            } else {
                errorRows.push({ row: index + 1, address });
            }
        });

        if (errorRows.length > 0) {
            const errorMessage = errorRows.map(err => `Row ${err.row}: Invalid address ${err.address}`).join('; ');
            setErrorMessage(`Invalid addresses found: ${errorMessage}`);
        } else {
            setErrorMessage('');
        }

        setParsedAddresses(validAddresses);
    }, [csvContent]);

    useEffect(() => {
        parseAddresses();
    }, [parseAddresses]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

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

        if (parsedAddresses.length === 0) {
            setErrorMessage('Please enter at least one valid recipient address.');
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
            const amountInWei = parseUnits(formData.amount, TOKEN_DECIMALS);
            const startTimestamp = formData.useCurrentTimestamp ? 0 : Math.floor(new Date(formData.startDate).getTime() / 1000);

            const result = await writeContractAsync({
                address: manageVestingContractConfig?.address,
                abi: manageVestingContractConfig?.abi,
                functionName: 'createFixedVestingSchedules',
                args: [
                    parsedAddresses,
                    amountInWei,
                    startTimestamp,
                    parseInt(formData.duration),
                    parseInt(formData.unit),
                    formData.revocable,
                ],
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

            setErrorMessage(errorMsg);
        }
    };

    useEffect(() => {
        if (isConfirmed) {
            setSuccessMessage('Multiple vesting schedules created successfully!');
            const timer = setTimeout(() => {
                setFormData({
                    amount: '',
                    startDate: '',
                    useCurrentTimestamp: false,
                    duration: '',
                    unit: '',
                    revocable: false,
                });
                setCsvContent('');
                setParsedAddresses([]);
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
                    <label>Recipient Addresses (one per line or upload CSV):</label>
                    <textarea
                        value={csvContent}
                        onChange={handleCsvChange}
                        rows="5"
                        placeholder="0x1234..."
                    />
                    <div className="sample-csv-container">
                        <DownloadSampleCSVJustAddresses />
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
                <div className="form-field">
                    <label>Amount per Recipient:</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-field">
                    <label>Start Date:</label>
                    <div className="start-date-container">
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            disabled={formData.useCurrentTimestamp}
                        />
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="useCurrentTimestamp"
                                checked={formData.useCurrentTimestamp}
                                onChange={handleChange}
                            />
                            Use current timestamp
                        </label>
                    </div>
                </div>
                <div className="form-field">
                    <label>Duration (seconds):</label>
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-field">
                    <label>Unit:</label>
                    <input
                        type="number"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-field checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="revocable"
                            checked={formData.revocable}
                            onChange={handleChange}
                        />
                        Revocable
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={isPending || isConfirming || !isConnected}
                    className="submit-button"
                >
                    {isPending ? 'Waiting for approval...' : isConfirming ? 'Confirming...' : 'Create Multiple Vesting Schedules'}
                </button>
                {parsedAddresses.length > 0 && (
                    <p className="info-message">Number of valid recipients: {parsedAddresses.length}</p>
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

export default MultipleVestingScheduleForm;