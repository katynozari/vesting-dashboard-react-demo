import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useChainId } from 'wagmi';
import { BaseError, ContractFunctionRevertedError, parseUnits } from 'viem';
import { useNetworkContract } from '../useNetworkContract';
import { getExplorerUrls, getNetworkNames } from '../utils/NetworkUtils';

const VESTING_MANAGER_ROLE = '0xd810f479110c9771ec744414e571d78468b4e92a20f345df2ffbdc5f927a182e'; // keccak256("VESTING_MANAGER_ROLE")
const TOKEN_DECIMALS = 18; // Assuming 18 decimals, adjust if different

function VestingScheduleForm() {
    const [formData, setFormData] = useState({
        granter: '',
        amount: '',
        startDate: '',
        useCurrentTimestamp: false,
        duration: '',
        unit: '',
        revocable: false,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [txHash, setTxHash] = useState('');

    const { address, isConnected } = useAccount();
    const { writeContractAsync, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    });
    const publicClient = usePublicClient();
    const { contractConfig } = useNetworkContract('lmtContract');
    const chainId = useChainId();

    const checkVestingManagerRole = async () => {
        if (!isConnected || !address) return false;

        try {
            const { result } = await publicClient.simulateContract({
                address: contractConfig?.address,
                abi: contractConfig?.abi,
                functionName: 'hasRole',
                args: [VESTING_MANAGER_ROLE, address],
            });
            return result;
        } catch (error) {
            console.error('Error checking vesting manager role:', error);
            return false;
        }
    };

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

        // Validate form fields
        if (formData.granter.trim() === '') {
            setErrorMessage('Please enter a granter address.');
            return;
        }

        if (!formData.granter.startsWith('0x') || formData.granter.length !== 42) {
            setErrorMessage('Please enter a valid Ethereum address for the granter.');
            return;
        }

        if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
            setErrorMessage('Amount must be greater than zero!');
            return;
        }

        if (!formData.useCurrentTimestamp && formData.startDate.trim() === '') {
            setErrorMessage('Please select a start date or use the current timestamp.');
            return;
        }

        if (isNaN(Number(formData.duration)) || Number(formData.duration) < 0) {
            setErrorMessage('Please enter a valid non-negative number for duration.');
            return;
        }

        const unitValue = Number(formData.unit);
        if (isNaN(unitValue) || unitValue <= 0 || unitValue > 100) {
            setErrorMessage('Unit should be greater than zero and smaller than or equal to 100!');
            return;
        }

        const isVestingManager = await checkVestingManagerRole();
        if (!isVestingManager) {
            setErrorMessage('You are not authorized to create a vesting schedule. Only vesting managers can perform this action.');
            return;
        }

        try {
            const valueInWei = parseUnits(formData.amount, TOKEN_DECIMALS);
            const startTimestamp = formData.useCurrentTimestamp ? 0 : Math.floor(new Date(formData.startDate).getTime() / 1000);

            const result = await writeContractAsync({
                address: contractConfig?.address,
                abi: contractConfig?.abi,
                functionName: 'createVestingSchedule',
                args: [
                    formData.granter,
                    valueInWei,
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
            let errorMsg = 'Error creating vesting schedule. ';

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
            setSuccessMessage('Vesting schedule created successfully!');
            const timer = setTimeout(() => {
                setFormData({
                    granter: '',
                    amount: '',
                    startDate: '',
                    useCurrentTimestamp: false,
                    duration: '',
                    unit: '',
                    revocable: false,
                });
                setSuccessMessage('');
                setTxHash('');
            }, 60000);
            return () => clearTimeout(timer);
        }
    }, [isConfirmed]);

    useEffect(() => {
        if (!isConnected) {
            setFormData({
                granter: '',
                amount: '',
                startDate: '',
                useCurrentTimestamp: false,
                duration: '',
                unit: '',
                revocable: false,
            });
            setErrorMessage('');
            setSuccessMessage('');
            setTxHash('');
        }
    }, [isConnected]);

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="internal-form">
                <div className="form-field">
                    <label>Granter Address:</label>
                    <input
                        type="text"
                        name="granter"
                        value={formData.granter}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-field">
                    <label>Amount:</label>
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
                    {isPending ? 'Waiting for approval...' : isConfirming ? 'Confirming...' : 'Create Vesting Schedule'}
                </button>
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

export default VestingScheduleForm;