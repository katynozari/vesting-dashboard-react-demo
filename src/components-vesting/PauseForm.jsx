import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useChainId } from 'wagmi';
import { BaseError, ContractFunctionRevertedError } from 'viem';
import { useNetworkContract } from '../useNetworkContract';
import { getExplorerUrls, getNetworkNames } from '../utils/NetworkUtils';

function PauseForm() {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [txHash, setTxHash] = useState('');
    const [isOwner, setIsOwner] = useState(false);

    const { address, isConnected } = useAccount();
    const { writeContractAsync, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    });
    const publicClient = usePublicClient();
    const { contractConfig } = useNetworkContract('manageVestingContract');
    const chainId = useChainId();

    useEffect(() => {
        const checkOwnership = async () => {
            if (isConnected && address) {
                try {
                    const owner = await publicClient.readContract({
                        address: contractConfig?.address,
                        abi: contractConfig?.abi,
                        functionName: 'owner',
                    });
                    setIsOwner(owner.toLowerCase() === address.toLowerCase());
                } catch (error) {
                    console.error('Error checking ownership:', error);
                    setIsOwner(false);
                }
            } else {
                setIsOwner(false);
            }
        };

        checkOwnership();
    }, [isConnected, address, publicClient]);

    const handlePause = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setTxHash('');

        if (!isConnected) {
            setErrorMessage('Wallet not connected. Please connect your wallet.');
            return;
        }

        if (!isOwner) {
            setErrorMessage('Only the contract owner can pause the contract.');
            return;
        }

        try {
            const result = await writeContractAsync({
                address: contractAddress,
                abi: contractABI,
                functionName: 'pause',
            });

            setTxHash(result);
            setSuccessMessage('Pause transaction submitted. Waiting for confirmation...');
        } catch (error) {
            console.error('Transaction failed:', error);
            let errorMsg = 'Error pausing the contract. ';

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

    if (!isOwner) {
        return <p>You do not have permission to pause the contract.</p>;
    }

    return (
        <div className="form-container">
            <form onSubmit={handlePause} className="pause-form">
                <button
                    type="submit"
                    disabled={isPending || isConfirming || !isConnected}
                    className="submit-button"
                >
                    {isPending ? 'Waiting for approval...' : isConfirming ? 'Confirming...' : 'Pause Contract'}
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

export default PauseForm;