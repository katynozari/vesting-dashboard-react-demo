import React, { useState, useEffect, useRef } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useNetworkContract } from '../useNetworkContract';

function HasRoleForm() {
    const [formData, setFormData] = useState({
        account: '',
        role: '',
    });
    const [showResultBox, setShowResultBox] = useState(false);
    const [queryData, setQueryData] = useState({ account: '', role: '' });
    const resultBoxRef = useRef(null);
    const { isConnected } = useAccount();
    const { contractConfig } = useNetworkContract('tokenContract');

    const { data: hasRoleData, refetch: refetchHasRole, isFetching } = useReadContract({
        address: contractConfig?.address,
        abi: contractConfig?.abi,
        functionName: 'hasRole',
        args: [queryData.role, queryData.account],
        enabled: false,
    });

    useEffect(() => {
        function handleClickOutside(event) {
            if (resultBoxRef.current && !resultBoxRef.current.contains(event.target)) {
                setShowResultBox(false);
            }
        }

        if (showResultBox) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showResultBox]);

    useEffect(() => {
        if (!isFetching && hasRoleData !== undefined) {
            setShowResultBox(true);
        }
    }, [hasRoleData, isFetching]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckRole = async () => {
        if (!isConnected) {
            alert('Wallet not connected. Please connect your wallet.');
            return;
        }

        try {
            setShowResultBox(false); // Hide any previous result
            setQueryData(formData);
            await refetchHasRole();
        } catch (error) {
            console.error('Error checking role:', error);
            alert('Error checking role. Please try again.');
        }
    };

    return (
        <div>
            <div className="readOnly">
                <button onClick={handleCheckRole}>
                    Check Role
                </button>
                <input
                    type="text"
                    name="account"
                    value={formData.account}
                    onChange={handleChange}
                    placeholder="Enter account address"
                />
                <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Enter role (bytes32)"
                />
            </div>

            {showResultBox && hasRoleData !== undefined && (
                <div className="result-box" ref={resultBoxRef}>
                    <div>Has Role: {hasRoleData ? 'True' : 'False'}</div>
                </div>
            )}
        </div>
    );
}

export default HasRoleForm;