import React, { useState, useEffect, useRef } from 'react';
import { useReadContract } from 'wagmi';
import { useNetworkContract } from '../useNetworkContract';

function GetTransferabletTokensForm({ address }) {
    const [showTransferableBox, setShowTransferableBox] = useState(false);
    const [transferableAddress, setTransferableAddress] = useState('');
    const [queryAddress, setQueryAddress] = useState('');
    const resultBoxRef = useRef(null);
    const { contractConfig } = useNetworkContract('tokenContract');

    const { data: transferableTokensData, refetch: refetchTransferableTokens } = useReadContract({
        address: contractConfig?.address,
        abi: contractConfig?.abi,
        functionName: 'transferableTokens',
        args: [queryAddress || address],
        enabled: false,
    });

    useEffect(() => {
        function handleClickOutside(event) {
            if (resultBoxRef.current && !resultBoxRef.current.contains(event.target)) {
                setShowTransferableBox(false);
            }
        }

        if (showTransferableBox) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showTransferableBox]);

    const handleGetTransferableTokens = async () => {
        setQueryAddress(transferableAddress);
        await refetchTransferableTokens();
        setShowTransferableBox(true);
    };

    return (
        <div>
            <div className="readOnly">
                <button onClick={handleGetTransferableTokens}>getTransferableTokens</button>
                <input
                    type="text"
                    value={transferableAddress}
                    onChange={(e) => setTransferableAddress(e.target.value)}
                    placeholder="Enter address (optional)"
                />
            </div>

            {showTransferableBox && (
                <div className="result-box" ref={resultBoxRef}>
                    <div>Transferable Tokens: {transferableTokensData ? transferableTokensData.toString() : '0'}</div>
                </div>
            )}
        </div>
    )
}

export default GetTransferabletTokensForm;