import React, { useState } from 'react';
import logo from './logo.png';
import './App.css';
import { AppKitProvider } from './walletConnectConfig';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAccount } from 'wagmi';
import VestingScheduleForm from './components-vesting/VestingScheduleForm';
import RevokeVestingScheduleForm from './components-vesting/RevokeVestingScheduleForm';
import GrantRoleForm from './components-vesting/GrantRoleForm';
import GetBalanceForm from './components-vesting/GetBalanceForm';
import GetTransferabletTokensForm from './components-vesting/GetTransferabletTokensForm';
import GetGrantsForm from './components-vesting/GetGrantsForm';
import GetRoles from './components-vesting/GetRoles';
import HasRoleForm from './components-vesting/HasRoleForm';
import RevokeRoleForm from './components-vesting/RevokeRoleForm';
import MultipleVestingScheduleForm from './components-vesting/MultipleVestingScheduleFormFixed';
import MultipleVestingScheduleFlexibleForm from './components-vesting/MultipleVestingScheduleFlexibleForm';
import ApprovalForm from './components-vesting/ApprovalForm';
import AirdropDistributionForm from './components-vesting/AirdropDistributionForm';
import FlexibleAirdropDistributionForm from './components-vesting/FlexibleAirdropDistributionForm';
import WithdrawTokenForm from './components-vesting/WithdrawTokenForm';


function ConnectButton() {
  return <w3m-button />;
}

function NetworkButton() {
  return <w3m-network-button />;
}


function MainContent() {
  const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] = useState(false);
  const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const toggleForm = (formName) => {
    setActiveForm(activeForm === formName ? null : formName);
  };
  const closeAll = () => {
    setIsNetworkSwitchHighlighted(false);
    setIsConnectHighlighted(false);
  };

  const { address } = useAccount();

  return (
    <div className="App" onMouseLeave={closeAll}>
      <header>
        <div
          className="backdrop"
          style={{
            opacity: isConnectHighlighted || isNetworkSwitchHighlighted ? 1 : 0,
          }}
        />
        <div className="header">
          <div className="logo">
            <img src={logo} alt="Logo" height="32" width="203" />
            <div className="logo-text">Vesting Management Dapp</div>
          </div>


          <div className="buttons">
            <div
              onClick={closeAll}
              className={`highlight network-button ${isNetworkSwitchHighlighted ? 'highlightSelected' : ''}`}
            >
              <NetworkButton />
            </div>
            <div
              onClick={closeAll}
              className={`highlight connect-button ${isConnectHighlighted ? 'highlightSelected' : ''}`}
            >
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>
      <main className="main-content">
        <div className="sidebar">
          <h2>Actions</h2>
          <button
            onClick={() => toggleForm('approve')}
            className={activeForm === 'approve' ? 'active' : ''}
          >
            Approve
          </button>
          <button
            onClick={() => toggleForm('vestingSchedule')}
            className={activeForm === 'vestingSchedule' ? 'active' : ''}
          >
            Vesting Schedule
          </button>
          <button
            onClick={() => toggleForm('revokeVesting')}
            className={activeForm === 'revokeVesting' ? 'active' : ''}
          >
            Revoke Vesting
          </button>
          <button
            onClick={() => toggleForm('multipleVesting')}
            className={activeForm === 'multipleVesting' ? 'active' : ''}
          >
            Multiple Vesting
          </button>
          <button
            onClick={() => toggleForm('MultipleVestingFlexible')}
            className={activeForm === 'MultipleVestingFlexible' ? 'active' : ''}
          >
            Flexible Multiple Vesting
          </button>
          <button
            onClick={() => toggleForm('airdropDistribution')}
            className={activeForm === 'airdropDistribution' ? 'active' : ''}
          >
            Airdrop Distribution
          </button>
          <button
            onClick={() => toggleForm('airdropDistributionFlexible')}
            className={activeForm === 'airdropDistributionFlexible' ? 'active' : ''}
          >
            Flexible Airdrop Distribution
          </button>
          <button
            onClick={() => toggleForm('grantRole')}
            className={activeForm === 'grantRole' ? 'active' : ''}
          >
            Grant Role
          </button>
          <button
            onClick={() => toggleForm('revokeRole')}
            className={activeForm === 'revokeRole' ? 'active' : ''}
          >
            Revoke Role
          </button>
          <button
            onClick={() => toggleForm('withdrawToken')}
            className={activeForm === 'withdrawToken' ? 'active' : ''}
          >
            Withdraw Token
          </button>
        </div>

        <div className="content-area">
          {!activeForm ? (
            <div className="logo-container">
              <img src={logo} alt="Token Logo" className="token-logo" />
              <div className="logo-text">Vesting Management Dapp</div>
            </div>
          ) : (
            <>
              {activeForm === 'approve' && <ApprovalForm />}
              {activeForm === 'vestingSchedule' && <VestingScheduleForm />}
              {activeForm === 'revokeVesting' && <RevokeVestingScheduleForm />}
              {activeForm === 'multipleVesting' && <MultipleVestingScheduleForm />}
              {activeForm === 'MultipleVestingFlexible' && <MultipleVestingScheduleFlexibleForm />}
              {activeForm === 'airdropDistribution' && <AirdropDistributionForm />}
              {activeForm === 'airdropDistributionFlexible' && <FlexibleAirdropDistributionForm />}
              {activeForm === 'grantRole' && <GrantRoleForm />}
              {activeForm === 'revokeRole' && <RevokeRoleForm />}
              {activeForm === 'withdrawToken' && <WithdrawTokenForm />}
            </>
          )}
        </div>

        <div className="info-panel">
          <h2>Account Info</h2>
          <GetBalanceForm address={address} />
          <GetTransferabletTokensForm address={address} />
          <GetGrantsForm address={address} />
          <GetRoles />
          <HasRoleForm />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppKitProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainContent />} />
        </Routes>
      </Router>
    </AppKitProvider>
  );
}


export default App;

