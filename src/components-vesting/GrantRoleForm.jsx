import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useChainId } from 'wagmi';
import { BaseError, ContractFunctionRevertedError } from 'viem';
import { useNetworkContract } from '../useNetworkContract';
import { getExplorerUrls, getNetworkNames } from '../utils/NetworkUtils';

const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';

function GrantRoleForm() {
    const [formData, setFormData] = useState({
        account: '',
        role: '',
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

    const { contractConfig } = useNetworkContract('tokenContract');
    const chainId = useChainId();

    const checkAdminRole = async (accountAddress) => {
        if (!isConnected || !accountAddress) return false;

        try {
            const result = await publicClient.readContract({
                address: contractConfig?.address,
                abi: contractConfig?.abi,
                functionName: 'hasRole',
                args: [DEFAULT_ADMIN_ROLE, accountAddress],
            });
            return result;
        } catch (error) {
            console.error('Error checking admin role:', error);
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

        const isAdmin = await checkAdminRole(address);
        if (!isAdmin) {
            setErrorMessage('You are not authorized to grant roles. Only admins can perform this action.');
            return;
        }

        // Validate account address
        if (!formData.account.startsWith('0x') || formData.account.length !== 42) {
            setErrorMessage('Please enter a valid Ethereum address for the account.');
            return;
        }

        // Validate role (simple check for non-empty string)
        if (formData.role.trim() === '') {
            setErrorMessage('Please enter a valid role.');
            return;
        }

        try {
            const result = await writeContractAsync({
                address: contractConfig?.address,
                abi: contractConfig?.abi,
                functionName: 'grantRole',
                args: [
                    formData.role,
                    formData.account,
                ],
            });

            setTxHash(result);
            setSuccessMessage('Transaction submitted. Waiting for confirmation...');
        } catch (error) {
            console.error('Transaction failed:', error);
            let errorMsg = 'Error granting role. ';

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
            setSuccessMessage('Role granted successfully!');
            // Clear form, success message, and transaction hash after 1 minute
            const timer = setTimeout(() => {
                setFormData({
                    account: '',
                    role: '',
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
                account: '',
                role: '',
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
                    <label>Account Address:</label>
                    <input
                        type="text"
                        name="account"
                        value={formData.account}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-field">
                    <label>Role (bytes32):</label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isPending || isConfirming || !isConnected}
                    className="submit-button"
                >
                    {isPending ? 'Waiting for approval...' : isConfirming ? 'Confirming...' : 'Grant Role'}
                </button>
                <div className="transaction-status">
                    {errorMessage && (
                        <div className="error-box">
                            <p className="error-message">{errorMessage}</p>
                        </div>
                    )}
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

export default GrantRoleForm;