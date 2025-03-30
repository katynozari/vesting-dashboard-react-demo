import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useReadContract, useWatchContractEvent } from 'wagmi';
import { useNetworkContract } from '../useNetworkContract';

function GetGrantsForm({ address }) {
    const [grantsAddress, setGrantsAddress] = useState('');
    const [showGrantsBox, setShowGrantsBox] = useState(false);
    const [queryAddress, setQueryAddress] = useState('');
    const [localGrantsData, setLocalGrantsData] = useState(null);
    const resultBoxRef = useRef(null);
    const { contractConfig } = useNetworkContract('tokenContract');

    const { data: grantsData, refetch, isError } = useReadContract({
        address: contractConfig?.address,
        abi: contractConfig?.abi,
        functionName: 'getGrants',
        args: [queryAddress || address],
        enabled: false,
    });

    const handleGetGrants = useCallback(async () => {
        setQueryAddress(grantsAddress || address);
        try {
            await refetch();
        } catch (error) {
            console.error('Error fetching grants:', error);
            setLocalGrantsData(null);
        }
        setShowGrantsBox(true);
    }, [grantsAddress, address, refetch]);

    // Watch for VestingScheduleRevoked events
    useWatchContractEvent({
        address: contractConfig?.address,
        abi: contractConfig?.abi,
        eventName: 'VestingScheduleRevoked',
        listener: (logs) => {
            logs.forEach(log => {
                if (log.args.holder === (queryAddress || address)) {
                    handleGetGrants();
                }
            });
        },
    });

    useEffect(() => {
        if (isError) {
            setLocalGrantsData(null);
        } else if (grantsData) {
            setLocalGrantsData(grantsData);
        }
    }, [grantsData, isError]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (resultBoxRef.current && !resultBoxRef.current.contains(event.target)) {
                setShowGrantsBox(false);
            }
        }

        if (showGrantsBox) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showGrantsBox]);

    // Polling mechanism to refresh grants data periodically
    useEffect(() => {
        const interval = setInterval(() => {
            if (showGrantsBox) {
                handleGetGrants();
            }
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [showGrantsBox, handleGetGrants]);

    const formattedGrants = localGrantsData && localGrantsData.length > 0
        ? localGrantsData.map(grant => ({
            granter: grant.schedule.granter,
            amount: grant.schedule.amount.toString(),
            start: grant.schedule.start.toString(),
            duration: grant.schedule.duration.toString(),
            unit: grant.schedule.unit.toString(),
            revocable: grant.schedule.revocable ? 'Yes' : 'No',
            releaseTokens: grant.releaseTokens.toString()
        }))
        : null;

    return (
        <div>
            <div className="readOnly">
                <button onClick={handleGetGrants}>getGrants</button>
                <input
                    type="text"
                    value={grantsAddress}
                    onChange={(e) => setGrantsAddress(e.target.value)}
                    placeholder="Enter address (optional)"
                />
            </div>

            {showGrantsBox && (
                <div className="result-box" ref={resultBoxRef}>
                    {isError ? (
                        <p>No grants found for this address.</p>
                    ) : formattedGrants ? (
                        formattedGrants.map((grant, index) => (
                            <div key={index}>
                                <p>Granter: {grant.granter || 'N/A'}</p>
                                <p>Amount: {grant.amount || 'N/A'}</p>
                                <p>Start: {grant.start || 'N/A'}</p>
                                <p>Duration: {grant.duration || 'N/A'}</p>
                                <p>Unit: {grant.unit || 'N/A'}</p>
                                <p>Revocable: {grant.revocable || 'N/A'}</p>
                                <p>Released Tokens: {grant.releaseTokens || 'N/A'}</p>
                            </div>
                        ))
                    ) : (
                        <p>No grants found for this address.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default GetGrantsForm;