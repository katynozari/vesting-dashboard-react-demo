import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useChainId } from 'wagmi';
import { BaseError, ContractFunctionRevertedError } from 'viem';
import { useNetworkContract } from '../useNetworkContract';
import { getExplorerUrls, getNetworkNames } from '../utils/NetworkUtils';

const VESTING_MANAGER_ROLE = '0xd810f479110c9771ec744414e571d78468b4e92a20f345df2ffbdc5f927a182e'; // keccak256("VESTING_MANAGER_ROLE")

function RevokeVestingScheduleForm() {
    const [formData, setFormData] = useState({
        granter: '',
        grantIndex: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [txHash, setTxHash] = useState('');

    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    });
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
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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

        // Validate granter address
        if (!formData.granter.startsWith('0x') || formData.granter.length !== 42) {
            setErrorMessage('Please enter a valid Ethereum address for the granter.');
            return;
        }

        // Validate grant index
        if (isNaN(Number(formData.grantIndex)) || Number(formData.grantIndex) < 0) {
            setErrorMessage('Please enter a valid non-negative number for grant index.');
            return;
        }

        const isVestingManager = await checkVestingManagerRole();
        if (!isVestingManager) {
            setErrorMessage('You are not authorized to revoke a vesting schedule. Only vesting managers can perform this action.');
            return;
        }

        try {
            const result = await writeContractAsync({
                address: contractConfig?.address,
                abi: contractConfig?.abi,
                functionName: 'revokeVestingSchedule',
                args: [
                    formData.granter,
                    parseInt(formData.grantIndex),
                ],
            });

            setTxHash(result);
            setSuccessMessage('Transaction submitted. Waiting for confirmation...');
        } catch (error) {
            console.error('Transaction failed:', error);
            let errorMsg = 'Error revoking vesting schedule. ';

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
            setSuccessMessage('Vesting schedule revoked successfully!');
            // Clear form, success message, and transaction hash after 1 minute
            const timer = setTimeout(() => {
                setFormData({
                    granter: '',
                    grantIndex: '',
                });
                setSuccessMessage('');
                setTxHash('');
            }, 60000); // 60 seconds = 1 minute
            return () => clearTimeout(timer);
        }
    }, [isConfirmed]);

    useEffect(() => {
        if (!isConnected) {
            setFormData({
                granter: '',
                grantIndex: '',
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
                    <label>Grant Index:</label>
                    <input
                        type="number"
                        name="grantIndex"
                        value={formData.grantIndex}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isPending || isConfirming || !isConnected}
                    className="submit-button"
                    style={{ backgroundColor: '#ae84c8' }}

                >
                    {isPending ? 'Waiting for approval...' : isConfirming ? 'Confirming...' : 'Revoke Vesting Schedule'}
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

export default RevokeVestingScheduleForm;