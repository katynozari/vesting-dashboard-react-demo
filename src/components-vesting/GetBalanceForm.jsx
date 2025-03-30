import React, { useState, useEffect, useRef } from 'react';
import { useReadContract } from 'wagmi';
import { useNetworkContract } from '../useNetworkContract';

function GetBalanceForm({ address }) {
    const [balanceAddress, setBalanceAddress] = useState('');
    const [showBalanceBox, setShowBalanceBox] = useState(false);
    const [queryAddress, setQueryAddress] = useState('');
    const resultBoxRef = useRef(null);

    const { contractConfig } = useNetworkContract('tokenContract');

    const { data: balanceData, refetch: refetchBalance } = useReadContract({
        address: contractConfig?.address,
        abi: contractConfig?.abi,
        functionName: 'balanceOf',
        args: [queryAddress || address],
        enabled: false,
    });

    useEffect(() => {
        function handleClickOutside(event) {
            if (resultBoxRef.current && !resultBoxRef.current.contains(event.target)) {
                setShowBalanceBox(false);
            }
        }

        if (showBalanceBox) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showBalanceBox]);

    const handleGetBalance = async () => {
        setQueryAddress(balanceAddress);
        await refetchBalance();
        setShowBalanceBox(true);
    };

    return (
        <div>
            <div className="readOnly">
                <button onClick={handleGetBalance}>getBalance</button>
                <input
                    type="text"
                    value={balanceAddress}
                    onChange={(e) => setBalanceAddress(e.target.value)}
                    placeholder="Enter address (optional)"
                />
            </div>
            {showBalanceBox && (
                <div className="result-box" ref={resultBoxRef}>
                    <div>Balance Of Token: {balanceData ? balanceData.toString() : '0'}</div>
                </div>
            )}
        </div>
    );
}

export default GetBalanceForm;