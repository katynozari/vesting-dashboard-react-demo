import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useWriteContract, usePublicClient, useChainId, useReadContract } from 'wagmi';
import Papa from 'papaparse';
import { formatEther, parseUnits } from 'viem';
import { useNetworkContract } from '../utils/useNetworkContract';

const formatEthValue = (weiValue) => {
    try {
        return parseFloat(formatEther(BigInt(weiValue))).toString();
    } catch {
        return '0';
    }
};

const MultiTransferTokenForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ tokenAddress: '', csvContent: '' });
    const [parsedData, setParsedData] = useState({ recipients: [], amounts: [] });
    const [tokenAllowance, setTokenAllowance] = useState(0);
    const [tokenDecimals, setTokenDecimals] = useState(18);
    const [estimatedFee, setEstimatedFee] = useState('0');
    const [errorMessage, setErrorMessage] = useState('');
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const { contractConfig } = useNetworkContract('MultiTransfer');
    const chainId = useChainId();

    const checkAllowance = async () => {
        try {
            const allowance = await publicClient.readContract({
                address: formData.tokenAddress,
                abi: [
                    {
                        name: 'allowance',
                        inputs: [
                            { type: 'address', name: 'owner' },
                            { type: 'address', name: 'spender' },
                        ],
                        outputs: [{ type: 'uint256' }],
                        type: 'function',
                        stateMutability: 'view',
                    },
                ],
                functionName: 'allowance',
                args: [address, contractConfig?.address],
            });
            setTokenAllowance(parseFloat(formatEther(BigInt(allowance))));
        } catch {
            setErrorMessage('Failed to check token allowance.');
        }
    };

    const fetchTokenDecimals = async () => {
        try {
            const decimals = await publicClient.readContract({
                address: formData.tokenAddress,
                abi: [{ name: 'decimals', type: 'function', stateMutability: 'view', outputs: [{ type: 'uint8' }] }],
                functionName: 'decimals',
            });
            setTokenDecimals(decimals);
        } catch {
            setTokenDecimals(18);
            setErrorMessage('Failed to fetch token decimals.');
        }
    };

    const parseCSV = useCallback(() => {
        const lines = formData.csvContent.split('\n').filter((line) => line.trim() !== '');
        const recipients = [];
        const amounts = [];
        const errors = [];

        lines.forEach((line, index) => {
            const [address, amount] = line.split(',').map((item) => item.trim());
            if (/^0x[a-fA-F0-9]{40}$/.test(address) && !isNaN(parseFloat(amount))) {
                recipients.push(address);
                amounts.push(parseUnits(amount, tokenDecimals).toString());
            } else {
                errors.push(`Line ${index + 1} is invalid.`);
            }
        });

        if (errors.length > 0) {
            setErrorMessage(errors.join(' '));
        } else {
            setParsedData({ recipients, amounts });
        }
    }, [formData.csvContent, tokenDecimals]);

    const calculateFee = async () => {
        try {
            const fee = await publicClient.readContract({
                address: contractConfig?.address,
                abi: contractConfig?.abi,
                functionName: 'previewFee',
                args: [parsedData.recipients.length],
            });
            setEstimatedFee(fee.toString());
        } catch {
            setErrorMessage('Failed to calculate estimated fee.');
        }
    };

    useEffect(() => {
        if (formData.tokenAddress.length === 42) {
            fetchTokenDecimals();
            checkAllowance();
        }
    }, [formData.tokenAddress]);

    useEffect(() => {
        if (formData.csvContent) {
            parseCSV();
        }
    }, [formData.csvContent, tokenDecimals]);

    const handleNext = () => {
        if (step === 1 && parsedData.recipients.length === 0) {
            setErrorMessage('Please upload a valid CSV file.');
            return;
        }
        if (step === 2 && tokenAllowance < parsedData.recipients.length) {
            setErrorMessage('Insufficient allowance. Please approve more tokens.');
            return;
        }
        if (step === 3) {
            calculateFee();
        }
        setStep((prev) => prev + 1);
        setErrorMessage('');
    };

    const handleBack = () => setStep((prev) => Math.max(1, prev - 1));

    return (
        <div className="form-container">
            <div className="steps">
                <div className={step === 1 ? 'active' : ''}>1. Prepare</div>
                <div className={step === 2 ? 'active' : ''}>2. Approve</div>
                <div className={step === 3 ? 'active' : ''}>3. Send</div>
            </div>
            {step === 1 && (
                <div>
                    <label>Token Address:</label>
                    <input
                        type="text"
                        value={formData.tokenAddress}
                        onChange={(e) => setFormData({ ...formData, tokenAddress: e.target.value })}
                    />
                    <label>CSV Content:</label>
                    <textarea
                        value={formData.csvContent}
                        onChange={(e) => setFormData({ ...formData, csvContent: e.target.value })}
                    />
                </div>
            )}
            {step === 2 && (
                <div>
                    <p>Token Allowance: {tokenAllowance}</p>
                    <p>
                        {tokenAllowance >= parsedData.recipients.length
                            ? 'You have sufficient allowance.'
                            : 'You need to approve more tokens.'}
                    </p>
                </div>
            )}
            {step === 3 && (
                <div>
                    <p>Estimated Fee: {formatEthValue(estimatedFee)}</p>
                    <button>Send</button>
                </div>
            )}
            <div>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <button disabled={step === 1} onClick={handleBack}>
                    Back
                </button>
                {step < 3 && (
                    <button onClick={handleNext}>
                        {step === 2 ? 'Approve' : 'Next'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default MultiTransferTokenForm;