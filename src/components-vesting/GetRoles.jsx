import React, { useState, useEffect, useRef } from 'react';
import { useReadContract } from 'wagmi';
import { useNetworkContract } from '../useNetworkContract';

function GetRoles() {
    const [roleDisplay, setRoleDisplay] = useState('');
    const [showRoleBox, setShowRoleBox] = useState(false);
    const resultBoxRef = useRef(null);
    const { contractConfig } = useNetworkContract('tokenContract');

    const { data: adminRoleData, refetch: refetchAdminRole } = useReadContract({
        address: contractConfig?.address,
        abi: contractConfig?.abi,
        functionName: 'DEFAULT_ADMIN_ROLE',
        enabled: false,
    });

    const { data: vestingManagerRoleData, refetch: refetchVestingManagerRole } = useReadContract({
        address: contractConfig?.address,
        abi: contractConfig?.abi,
        functionName: 'VESTING_MANAGER_ROLE',
        enabled: false,
    });

    useEffect(() => {
        function handleClickOutside(event) {
            if (resultBoxRef.current && !resultBoxRef.current.contains(event.target)) {
                setShowRoleBox(false);
            }
        }

        if (showRoleBox) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showRoleBox]);

    const handleGetRole = async (roleType) => {
        if (roleType === 'admin') {
            await refetchAdminRole();
            setRoleDisplay(adminRoleData || '0x0000000000000000000000000000000000000000000000000000000000000000');
        } else {
            await refetchVestingManagerRole();
            setRoleDisplay(vestingManagerRoleData || '0xd810f479110c9771ec744414e571d78468b4e92a20f345df2ffbdc5f927a182e');
        }
        setShowRoleBox(true);
    };

    return (
        <div>
            <div className="readOnly" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button onClick={() => handleGetRole('admin')}>Get Admin Role</button>
                <button onClick={() => handleGetRole('vestingManager')}>Get Vesting Manager Role</button>
            </div>
            {showRoleBox && (
                <div className="result-box" ref={resultBoxRef} style={{ marginTop: '20px', wordBreak: 'break-all' }}>
                    <div>Role: {roleDisplay}</div>
                </div>
            )}
        </div>
    );
}

export default GetRoles;