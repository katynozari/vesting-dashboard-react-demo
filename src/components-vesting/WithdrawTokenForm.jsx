import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useChainId } from 'wagmi';
import { BaseError, ContractFunctionRevertedError } from 'viem';
import { useNetworkContract } from '../useNetworkContract';
import { getExplorerUrls, getNetworkNames } from '../utils/NetworkUtils';

function WithdrawTokenForm() {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [txHash, setTxHash] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');

    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    });
    const { contractConfig } = useNetworkContract('manageVestingContract');
    const chainId = useChainId();

    const checkOwnership = async (accountAddress) => {
        if (!isConnected || !accountAddress) return false;

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


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setTxHash('');

        if (!isConnected) {
            setErrorMessage('Wallet not connected. Please connect your wallet.');
            return;
        }

        if (!tokenAddress) {
            setErrorMessage('Please enter a valid token address.');
            return;
        }

        const isOwner = await checkOwnership(address);
        if (!isOwner) {
            setErrorMessage('You are not authorized to withdraw tokens. Only the owner can perform this action.');
            return;
        }

        try {
            const result = await writeContractAsync({
                address: contractConfig?.address,
                abi: contractConfig?.abi,
                functionName: 'withdrawToken',
                args: [tokenAddress],
            });

            setTxHash(result);
            setSuccessMessage('Transaction submitted. Waiting for confirmation...');
        } catch (error) {
            console.error('Transaction failed:', error);
            let errorMsg = 'Error withdrawing tokens. ';

            if (error instanceof BaseError) {
                const revertError = error.walk(err => err instanceof ContractFunctionRevertedError);
                if (revertError instanceof ContractFunctionRevertedError) {
                    errorMsg += revertError.shortMessage || 'Contract call reverted.';
                    if (revertError.shortMessage.includes("No tokens to withdraw")) {
                        errorMsg = "There are no tokens to withdraw for the specified address.";
                    }
                }
            } else {
                errorMsg += error.message || (typeof error === 'string' ? error : JSON.stringify(error));
            }

            setErrorMessage(errorMsg);
        }
    };

    useEffect(() => {
        if (isConfirmed) {
            setSuccessMessage('Tokens withdrawn successfully!');
            // Clear success message and transaction hash after 1 minute
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setTxHash('');
            }, 60000); // 60 seconds = 1 minute
            return () => clearTimeout(timer);
        }
    }, [isConfirmed]);

    useEffect(() => {
        if (!isConnected) {
            setErrorMessage('');
            setSuccessMessage('');
            setTxHash('');
        }
    }, [isConnected]);

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="internal-form">
                <input
                    type="text"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="Enter token address"
                    className="input-field"
                />
                <button
                    type="submit"
                    disabled={isPending || isConfirming || !isConnected}
                    className="submit-button"
                >
                    {isPending ? 'Waiting for approval...' : isConfirming ? 'Confirming...' : 'Withdraw Tokens'}
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

export default WithdrawTokenForm;