import { useState, useEffect } from 'react';
import { useChainId, useSwitchChain } from 'wagmi';
import { networkConfigs } from './networkConfigs';

export function useNetworkContract(contractName) {
    const chainId = useChainId();
    const { switchNetwork } = useSwitchChain();
    const [contractConfig, setContractConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        if (chainId && networkConfigs[chainId]) {
            const config = networkConfigs[chainId].contracts[contractName];
            if (config) {
                setContractConfig(config);
            } else {
                console.error(`Contract ${contractName} not found on network ${chainId}`);
                setContractConfig(null);
            }
        } else {
            setContractConfig(null);
        }
        setIsLoading(false);
    }, [chainId, contractName]);

    const switchToSupportedNetwork = async (targetChainId) => {
        if (switchNetwork) {
            await switchNetwork(targetChainId);
        } else {
            console.error('Network switching not supported');
        }
    };

    return { contractConfig, switchToSupportedNetwork, isLoading };
}