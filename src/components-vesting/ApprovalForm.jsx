import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { BaseError, ContractFunctionRevertedError, parseUnits } from 'viem';
import { useNetworkContract } from '../useNetworkContract';
import { getExplorerUrls, getNetworkNames } from '../utils/NetworkUtils';

const TOKEN_DECIMALS = 18;

function ApprovalForm() {
    const [formData, setFormData] = useState({
        spender: '',
        amount: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [txHash, setTxHash] = useState('');

    const { isConnected } = useAccount();
    const { writeContractAsync, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    const { contractConfig } = useNetworkContract('tokenContract');
    const chainId = useChainId();

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

        if (!formData.spender || !formData.amount) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        try {
            const amountInWei = parseUnits(formData.amount, TOKEN_DECIMALS);
            const result = await writeContractAsync({
                address: contractConfig?.address,
                abi: contractConfig?.abi,
                functionName: 'approve',
                args: [formData.spender, amountInWei],
            });

            setTxHash(result);
            setSuccessMessage('Approval transaction submitted. Waiting for confirmation...');
        } catch (error) {
            console.error('Transaction failed:', error);
            let errorMsg = 'Error approving tokens. ';

            if (error instanceof BaseError) {
                const revertError = error.walk(err => err instanceof ContractFunctionRevertedError);
                if (revertError instanceof ContractFunctionRevertedError) {
                    errorMsg += revertError.shortMessage || 'Contract call reverted.';
                } else {
                    errorMsg += error.shortMessage || error.message || 'Unknown error occurred.';
                }
            } else {
                errorMsg += error.message || (typeof error === 'string' ? error : JSON.stringify(error));
            }

            setErrorMessage(errorMsg);
            console.log('Full error object:', error); // Add this line for debugging
        }
    };

    useEffect(() => {
        console.log('isConfirmed:', isConfirmed); // Add this line
        if (isConfirmed) {
            setSuccessMessage('Approval successful!');
            // Clear form, success message, and transaction hash after 1 minute
            const timer = setTimeout(() => {
                setFormData({
                    spender: '',
                    amount: '',
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
                spender: '',
                amount: '',
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
                    <label>Spender Address:</label>
                    <input
                        type="text"
                        name="spender"
                        value={formData.spender}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-field">
                    <label>Amount to Approve:</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isPending || isConfirming || !isConnected}
                    className="submit-button"
                >
                    {isPending ? 'Waiting for approval...' : isConfirming ? 'Confirming...' : 'Approve Tokens'}
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

export default ApprovalForm;