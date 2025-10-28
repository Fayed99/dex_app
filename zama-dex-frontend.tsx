import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownUp, Droplets, TrendingUp, TrendingDown, Activity, Lock, Eye, EyeOff, RefreshCw, Settings, X, Plus, Clock, Filter, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock FHEVM SDK functions (replace with actual @fhevm/sdk imports)
const mockFHEVM = {
  createEncryptedInput: (contractAddress, userAddress) => ({
    add64: (value) => ({ value }),
    encrypt: async () => ({
      handles: ['0x' + Math.random().toString(16).slice(2)],
      proof: '0x' + Array(128).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    })
  }),
  userDecryptEuint: async (type, handle, contractAddress, signer) => {
    return Math.floor(Math.random() * 10000);
  }
};

const App = () => {
  const [activeTab, setActiveTab] = useState('swap');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [priceData, setPriceData] = useState([
    { time: '00:00', price: 2000 },
    { time: '04:00', price: 2050 },
    { time: '08:00', price: 1980 },
    { time: '12:00', price: 2100 },
    { time: '16:00', price: 2080 },
    { time: '20:00', price: 2150 },
    { time: '24:00', price: 2200 }
  ]);
  
  // Swap state
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showEncryptedBalance, setShowEncryptedBalance] = useState(false);
  
  // Liquidity state
  const [liquidityTokenA, setLiquidityTokenA] = useState('ETH');
  const [liquidityTokenB, setLiquidityTokenB] = useState('USDC');
  const [liquidityAmountA, setLiquidityAmountA] = useState('');
  const [liquidityAmountB, setLiquidityAmountB] = useState('');
  const [showCreatePool, setShowCreatePool] = useState(false);
  const [newPoolTokenA, setNewPoolTokenA] = useState('ETH');
  const [newPoolTokenB, setNewPoolTokenB] = useState('USDC');
  const [newPoolAmountA, setNewPoolAmountA] = useState('');
  const [newPoolAmountB, setNewPoolAmountB] = useState('');
  const [newPoolFee, setNewPoolFee] = useState('0.3');
  
  // Portfolio state
  const [balances, setBalances] = useState({
    ETH: { encrypted: true, value: null, decrypted: null },
    USDC: { encrypted: true, value: null, decrypted: null },
    DAI: { encrypted: true, value: null, decrypted: null }
  });
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'swap', from: 'ETH', to: 'USDC', amount: '1.5', time: '2 mins ago', status: 'completed', encrypted: true },
    { id: 2, type: 'liquidity', from: 'ETH', to: 'USDC', amount: '2.0', time: '15 mins ago', status: 'completed', encrypted: true },
    { id: 3, type: 'swap', from: 'USDC', to: 'DAI', amount: '3000', time: '1 hour ago', status: 'completed', encrypted: true },
    { id: 4, type: 'swap', from: 'ETH', to: 'WBTC', amount: '0.5', time: '3 hours ago', status: 'pending', encrypted: true }
  ]);
  const [filterType, setFilterType] = useState('all');

  // Orders/settings
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState('0.5');
  const [deadline, setDeadline] = useState('20');
  
  // Mock wallet connection
  const connectWallet = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsConnected(true);
      setWalletAddress('0x742d...5a3f');
      setBalances({
        ETH: { encrypted: true, value: '0xabc123...', decrypted: null },
        USDC: { encrypted: true, value: '0xdef456...', decrypted: null },
        DAI: { encrypted: true, value: '0xghi789...', decrypted: null }
      });
      setIsProcessing(false);
    }, 1500);
  };
  
  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setBalances({
      ETH: { encrypted: true, value: null, decrypted: null },
      USDC: { encrypted: true, value: null, decrypted: null },
      DAI: { encrypted: true, value: null, decrypted: null }
    });
  };
  
  // Decrypt balance
  const decryptBalance = async (token) => {
    if (!balances[token].value) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      const mockDecryptedValue = (Math.random() * 1000).toFixed(2);
      setBalances(prev => ({
        ...prev,
        [token]: { ...prev[token], decrypted: mockDecryptedValue }
      }));
      setIsProcessing(false);
    }, 1000);
  };
  
  // Swap handler
  const handleSwap = async () => {
    if (!fromAmount || !isConnected) return;
    
    setIsProcessing(true);
    
    // Simulate encryption and swap
    setTimeout(() => {
      alert(`Swapping ${fromAmount} ${fromToken} for ~${toAmount} ${toToken}\nTransaction encrypted and submitted!`);
      setFromAmount('');
      setToAmount('');
      setIsProcessing(false);
    }, 2000);
  };
  
  // Add liquidity handler
  const handleAddLiquidity = async () => {
    if (!liquidityAmountA || !liquidityAmountB || !isConnected) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      alert(`Adding liquidity:\n${liquidityAmountA} ${liquidityTokenA}\n${liquidityAmountB} ${liquidityTokenB}\nEncrypted transaction submitted!`);
      setLiquidityAmountA('');
      setLiquidityAmountB('');
      setIsProcessing(false);
    }, 2000);
  };
  
  // Calculate estimated output (mock calculation)
  useEffect(() => {
    if (fromAmount && !isNaN(fromAmount)) {
      // Mock exchange rate
      const rate = fromToken === 'ETH' ? 2000 : 0.0005;
      setToAmount((parseFloat(fromAmount) * rate).toFixed(6));
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken]);
  
  const tokens = ['ETH', 'USDC', 'DAI', 'WBTC'];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="border-b border-purple-700/30 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">The Dexter</h1>
                <p className="text-xs text-purple-300">Fully Confidential Trading</p>
              </div>
            </div>
            
            {!isConnected ? (
              <button
                onClick={connectWallet}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                <Wallet className="w-5 h-5" />
                {isProcessing ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="bg-purple-800/30 px-4 py-2 rounded-lg border border-purple-600/30">
                  <p className="text-sm text-purple-300">Connected</p>
                  <p className="font-mono text-sm">{walletAddress}</p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-purple-300 hover:text-white transition-colors"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-black/20 p-2 rounded-xl w-fit mx-auto backdrop-blur-sm border border-purple-700/30">
          {[
            { id: 'swap', label: 'Swap', icon: ArrowDownUp },
            { id: 'liquidity', label: 'Liquidity', icon: Droplets },
            { id: 'portfolio', label: 'Portfolio', icon: TrendingUp },
            { id: 'analytics', label: 'Analytics', icon: Activity },
            { id: 'history', label: 'History', icon: Clock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                  : 'hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Swap Tab */}
        {activeTab === 'swap' && (
          <div className="max-w-md mx-auto">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-700/30 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Swap Tokens</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 hover:bg-purple-800/50 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <Lock className="w-4 h-4" />
                    <span>Encrypted</span>
                  </div>
                </div>
              </div>

              {/* Order Type Selector */}
              <div className="flex gap-2 mb-4 bg-purple-900/30 p-1 rounded-lg">
                <button
                  onClick={() => setOrderType('market')}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                    orderType === 'market'
                      ? 'bg-purple-600'
                      : 'hover:bg-purple-800/50'
                  }`}
                >
                  Market
                </button>
                <button
                  onClick={() => setOrderType('limit')}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                    orderType === 'limit'
                      ? 'bg-purple-600'
                      : 'hover:bg-purple-800/50'
                  }`}
                >
                  Limit
                </button>
              </div>
              
              {/* From Token */}
              <div className="bg-purple-900/30 rounded-xl p-4 mb-2">
                <label className="text-sm text-purple-300 mb-2 block">From</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-2xl font-bold outline-none"
                  />
                  <select
                    value={fromToken}
                    onChange={(e) => setFromToken(e.target.value)}
                    className="bg-purple-800 rounded-lg px-4 py-2 font-semibold outline-none cursor-pointer"
                  >
                    {tokens.map(token => (
                      <option key={token} value={token}>{token}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Limit Price (only for limit orders) */}
              {orderType === 'limit' && (
                <div className="bg-purple-900/30 rounded-xl p-4 mb-2">
                  <label className="text-sm text-purple-300 mb-2 block">Limit Price</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      placeholder="Enter price"
                      className="flex-1 bg-transparent text-2xl font-bold outline-none"
                    />
                    <div className="bg-purple-800 rounded-lg px-4 py-2 font-semibold">
                      {toToken}/{fromToken}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Swap Arrow */}
              <div className="flex justify-center -my-2 relative z-10">
                <button className="bg-purple-700 hover:bg-purple-600 p-2 rounded-lg transition-colors">
                  <ArrowDownUp className="w-5 h-5" />
                </button>
              </div>
              
              {/* To Token */}
              <div className="bg-purple-900/30 rounded-xl p-4 mb-6">
                <label className="text-sm text-purple-300 mb-2 block">
                  To {orderType === 'market' ? '(estimated)' : '(minimum)'}
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={toAmount}
                    readOnly
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-2xl font-bold outline-none"
                  />
                  <select
                    value={toToken}
                    onChange={(e) => setToToken(e.target.value)}
                    className="bg-purple-800 rounded-lg px-4 py-2 font-semibold outline-none cursor-pointer"
                  >
                    {tokens.map(token => (
                      <option key={token} value={token}>{token}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Swap Info */}
              <div className="bg-purple-900/20 rounded-lg p-3 mb-4 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-purple-300">
                    {orderType === 'market' ? 'Current Rate' : 'Target Rate'}
                  </span>
                  <span>
                    1 {fromToken} ≈ {orderType === 'limit' && limitPrice ? limitPrice : (parseFloat(toAmount) / parseFloat(fromAmount || 1)).toFixed(4)} {toToken}
                  </span>
                </div>
                {orderType === 'limit' && (
                  <div className="flex justify-between mb-1">
                    <span className="text-purple-300">Order Type</span>
                    <span className="text-yellow-400">Limit Order</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-purple-300">Privacy</span>
                  <span className="text-green-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Fully Encrypted
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleSwap}
                disabled={!isConnected || !fromAmount || isProcessing || (orderType === 'limit' && !limitPrice)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!isConnected ? 'Connect Wallet' : isProcessing ? 'Processing...' : orderType === 'market' ? 'Swap' : 'Place Limit Order'}
              </button>
            </div>
          </div>
        )}
        
        {/* Liquidity Tab */}
        {activeTab === 'liquidity' && (
          <div className="max-w-md mx-auto">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-700/30 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add Liquidity</h2>
                <button
                  onClick={() => setShowCreatePool(true)}
                  className="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Pool
                </button>
              </div>
              
              {/* Token A */}
              <div className="bg-purple-900/30 rounded-xl p-4 mb-4">
                <label className="text-sm text-purple-300 mb-2 block">Token A</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={liquidityAmountA}
                    onChange={(e) => setLiquidityAmountA(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-2xl font-bold outline-none"
                  />
                  <select
                    value={liquidityTokenA}
                    onChange={(e) => setLiquidityTokenA(e.target.value)}
                    className="bg-purple-800 rounded-lg px-4 py-2 font-semibold outline-none cursor-pointer"
                  >
                    {tokens.map(token => (
                      <option key={token} value={token}>{token}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Token B */}
              <div className="bg-purple-900/30 rounded-xl p-4 mb-6">
                <label className="text-sm text-purple-300 mb-2 block">Token B</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={liquidityAmountB}
                    onChange={(e) => setLiquidityAmountB(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-2xl font-bold outline-none"
                  />
                  <select
                    value={liquidityTokenB}
                    onChange={(e) => setLiquidityTokenB(e.target.value)}
                    className="bg-purple-800 rounded-lg px-4 py-2 font-semibold outline-none cursor-pointer"
                  >
                    {tokens.map(token => (
                      <option key={token} value={token}>{token}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="bg-purple-900/20 rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-3">Pool Share Estimate</h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-300">{liquidityTokenA} per {liquidityTokenB}</span>
                    <span>~2.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Share of Pool</span>
                    <span>~0.05%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Privacy Level</span>
                    <span className="text-green-400">Encrypted Reserves</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleAddLiquidity}
                disabled={!isConnected || !liquidityAmountA || !liquidityAmountB || isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!isConnected ? 'Connect Wallet' : isProcessing ? 'Processing...' : 'Add Liquidity'}
              </button>
            </div>
          </div>
        )}
        
        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-700/30 p-6">
              <h2 className="text-2xl font-bold mb-6">Your Portfolio</h2>
              
              {!isConnected ? (
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
                  <p className="text-purple-300 text-lg">Connect your wallet to view portfolio</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(balances).map(([token, data]) => (
                    <div key={token} className="bg-purple-900/30 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center font-bold">
                          {token[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{token}</h3>
                          <p className="text-sm text-purple-300">
                            {data.decrypted !== null ? (
                              <span className="text-green-400">{data.decrypted} {token}</span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                Encrypted Balance
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => decryptBalance(token)}
                        disabled={isProcessing || data.decrypted !== null}
                        className="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {data.decrypted !== null ? (
                          <>
                            <Eye className="w-4 h-4" />
                            Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Decrypt
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-300 mb-1">Privacy Notice</p>
                    <p className="text-blue-200/80">
                      All balances are stored encrypted on-chain using FHE. Only you can decrypt your balances with your private key.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* Total Volume */}
              <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-700/30 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-purple-300">24h Volume</h3>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-3xl font-bold">$12.5M</p>
                <p className="text-sm text-green-400 mt-1">+15.3%</p>
              </div>

              {/* Total Liquidity */}
              <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-700/30 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-purple-300">Total Liquidity</h3>
                  <Droplets className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-3xl font-bold">$85.2M</p>
                <p className="text-sm text-blue-400 mt-1">Encrypted</p>
              </div>

              {/* Active Pools */}
              <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-700/30 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-purple-300">Active Pools</h3>
                  <Activity className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-3xl font-bold">24</p>
                <p className="text-sm text-purple-400 mt-1">Live Trading</p>
              </div>
            </div>

            {/* Price Chart */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-700/30 p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">ETH/USDC Price Chart</h2>
                <div className="flex gap-2">
                  {['1H', '24H', '7D', '30D'].map(period => (
                    <button
                      key={period}
                      className="px-3 py-1 rounded-lg bg-purple-800/50 hover:bg-purple-700 text-sm transition-colors"
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceData}>
                  <XAxis dataKey="time" stroke="#a78bfa" />
                  <YAxis stroke="#a78bfa" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e1b4b',
                      border: '1px solid #7c3aed',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Top Pools */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-700/30 p-6">
              <h2 className="text-xl font-bold mb-4">Top Pools by Volume</h2>
              <div className="space-y-3">
                {[
                  { pair: 'ETH/USDC', volume: '$4.2M', apr: '12.5%', liquidity: '$25M' },
                  { pair: 'WBTC/ETH', volume: '$3.1M', apr: '8.3%', liquidity: '$18M' },
                  { pair: 'DAI/USDC', volume: '$2.8M', apr: '5.2%', liquidity: '$32M' },
                  { pair: 'ETH/DAI', volume: '$1.5M', apr: '9.8%', liquidity: '$12M' }
                ].map((pool, idx) => (
                  <div
                    key={idx}
                    className="bg-purple-900/30 rounded-lg p-4 flex items-center justify-between hover:bg-purple-900/40 transition-colors cursor-pointer"
                  >
                    <div>
                      <h3 className="font-bold">{pool.pair}</h3>
                      <p className="text-sm text-purple-300">24h Volume: {pool.volume}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">{pool.apr} APR</p>
                      <p className="text-sm text-purple-300">TVL: {pool.liquidity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-700/30 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Transaction History</h2>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-purple-800 rounded-lg px-4 py-2 text-sm outline-none cursor-pointer"
                  >
                    <option value="all">All Transactions</option>
                    <option value="swap">Swaps Only</option>
                    <option value="liquidity">Liquidity Only</option>
                  </select>
                  <button className="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              {!isConnected ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
                  <p className="text-purple-300 text-lg">Connect wallet to view history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions
                    .filter(tx => filterType === 'all' || tx.type === filterType)
                    .map(tx => (
                      <div
                        key={tx.id}
                        className="bg-purple-900/30 rounded-lg p-4 hover:bg-purple-900/40 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.type === 'swap' ? 'bg-blue-500/20' : 'bg-green-500/20'
                            }`}>
                              {tx.type === 'swap' ? (
                                <ArrowDownUp className="w-5 h-5 text-blue-400" />
                              ) : (
                                <Droplets className="w-5 h-5 text-green-400" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold">
                                  {tx.type === 'swap' ? 'Swapped' : 'Added Liquidity'}
                                </h3>
                                {tx.encrypted && (
                                  <Lock className="w-3 h-3 text-purple-400" />
                                )}
                              </div>
                              <p className="text-sm text-purple-300">
                                {tx.amount} {tx.from} → {tx.to}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-semibold ${
                              tx.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              {tx.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                            </div>
                            <p className="text-sm text-purple-300">{tx.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-3 gap-4">
          <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-700/30 p-6">
            <Lock className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="font-bold mb-2">Fully Encrypted</h3>
            <p className="text-sm text-purple-300">All transactions and balances are encrypted end-to-end using Zama's FHE technology</p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-700/30 p-6">
            <ArrowDownUp className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-bold mb-2">Private Trading</h3>
            <p className="text-sm text-purple-300">Trade any token pair without revealing amounts or positions to anyone</p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-700/30 p-6">
            <Droplets className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="font-bold mb-2">Confidential Pools</h3>
            <p className="text-sm text-purple-300">Provide liquidity with encrypted reserves, protecting your positions from MEV</p>
          </div>
        </div>
        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl border border-purple-700/30 p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Transaction Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-purple-800/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Slippage Tolerance */}
              <div className="mb-6">
                <label className="text-sm text-purple-300 mb-3 block">Slippage Tolerance</label>
                <div className="flex gap-2 mb-3">
                  {['0.1', '0.5', '1.0'].map(val => (
                    <button
                      key={val}
                      onClick={() => setSlippage(val)}
                      className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                        slippage === val
                          ? 'bg-purple-600'
                          : 'bg-purple-900/50 hover:bg-purple-800/50'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                  <input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    placeholder="Custom"
                    className="w-24 bg-purple-900/50 rounded-lg px-3 py-2 outline-none text-center"
                  />
                </div>
                <p className="text-xs text-purple-400">
                  Your transaction will revert if the price changes unfavorably by more than this percentage.
                </p>
              </div>

              {/* Transaction Deadline */}
              <div className="mb-6">
                <label className="text-sm text-purple-300 mb-3 block">Transaction Deadline</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="flex-1 bg-purple-900/50 rounded-lg px-4 py-3 outline-none"
                  />
                  <span className="text-purple-300">minutes</span>
                </div>
                <p className="text-xs text-purple-400 mt-2">
                  Your transaction will revert if it is pending for more than this long.
                </p>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 rounded-xl font-bold transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Create Pool Modal */}
        {showCreatePool && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl border border-purple-700/30 p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Create New Pool</h3>
                <button
                  onClick={() => setShowCreatePool(false)}
                  className="p-2 hover:bg-purple-800/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Token Pair Selection */}
              <div className="mb-4">
                <label className="text-sm text-purple-300 mb-2 block">Select Token Pair</label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={newPoolTokenA}
                    onChange={(e) => setNewPoolTokenA(e.target.value)}
                    className="bg-purple-900/50 rounded-lg px-4 py-3 outline-none cursor-pointer"
                  >
                    {tokens.map(token => (
                      <option key={token} value={token}>{token}</option>
                    ))}
                  </select>
                  <select
                    value={newPoolTokenB}
                    onChange={(e) => setNewPoolTokenB(e.target.value)}
                    className="bg-purple-900/50 rounded-lg px-4 py-3 outline-none cursor-pointer"
                  >
                    {tokens.map(token => (
                      <option key={token} value={token}>{token}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fee Tier */}
              <div className="mb-4">
                <label className="text-sm text-purple-300 mb-2 block">Fee Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {['0.05', '0.3', '1.0'].map(fee => (
                    <button
                      key={fee}
                      onClick={() => setNewPoolFee(fee)}
                      className={`py-3 rounded-lg font-semibold transition-all ${
                        newPoolFee === fee
                          ? 'bg-purple-600'
                          : 'bg-purple-900/50 hover:bg-purple-800/50'
                      }`}
                    >
                      {fee}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Initial Liquidity */}
              <div className="mb-4">
                <label className="text-sm text-purple-300 mb-2 block">Initial Liquidity</label>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={newPoolAmountA}
                    onChange={(e) => setNewPoolAmountA(e.target.value)}
                    placeholder={`Amount of ${newPoolTokenA}`}
                    className="w-full bg-purple-900/50 rounded-lg px-4 py-3 outline-none"
                  />
                  <input
                    type="number"
                    value={newPoolAmountB}
                    onChange={(e) => setNewPoolAmountB(e.target.value)}
                    placeholder={`Amount of ${newPoolTokenB}`}
                    className="w-full bg-purple-900/50 rounded-lg px-4 py-3 outline-none"
                  />
                </div>
              </div>

              {/* Initial Price */}
              <div className="bg-purple-900/20 rounded-lg p-3 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-300">Initial Price</span>
                  <span>
                    1 {newPoolTokenA} = {newPoolAmountB && newPoolAmountA ? (parseFloat(newPoolAmountB) / parseFloat(newPoolAmountA)).toFixed(4) : '0'} {newPoolTokenB}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  alert(`Creating pool: ${newPoolTokenA}/${newPoolTokenB} with ${newPoolFee}% fee`);
                  setShowCreatePool(false);
                }}
                disabled={!newPoolAmountA || !newPoolAmountB}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                Create Pool
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;