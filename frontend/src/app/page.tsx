'use client';

import { useState, useEffect } from 'react';
import WalletConnect from '@/components/wallet/WalletConnect';
import axios from 'axios';

interface Project {
  id: number;
  projectId: number;
  title: string;
  description: string;
  totalAmount: number;
  releasedAmount: number;
  status: string;
  freelancerAddress: string;
  createdAt: string;
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'create'>('projects');

  // Form state for creating project
  const [freelancerAddress, setFreelancerAddress] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [milestones, setMilestones] = useState([{ title: '', description: '', amount: '' }]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  useEffect(() => {
    if (walletAddress) {
      fetchProjects();
    }
  }, [walletAddress]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/projects/client/${walletAddress}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (key: string) => {
    setWalletAddress(key);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setProjects([]);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', description: '', amount: '' }]);
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/projects`,
        {
          freelancerAddress,
          title,
          description,
          totalAmount: parseFloat(totalAmount) * 10000000, // Convert XLM to stroops
          tokenAddress: 'native',
        },
        {
          headers: { 'x-wallet-address': walletAddress },
        }
      );

      alert(`Project created! ID: ${response.data.projectId}`);
      // Reset form
      setFreelancerAddress('');
      setTitle('');
      setDescription('');
      setTotalAmount('');
      setMilestones([{ title: '', description: '', amount: '' }]);
      setActiveTab('projects');
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const formatAmount = (stroops: number): string => {
    return (stroops / 10000000).toFixed(2);
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <header className="flex justify-between items-center py-4 border-b border-white/10 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-xl">
              ⚡
            </div>
            <span className="text-2xl font-bold">
              Milestone<span className="gradient-text">Trust</span>
            </span>
          </div>
          <WalletConnect onConnect={handleConnect} onDisconnect={handleDisconnect} />
        </header>

        {/* Hero Section */}
        <div className="text-center py-12">
          <div className="inline-block bg-purple-500/15 border border-purple-500/30 rounded-full px-4 py-1.5 text-sm mb-6">
            🤝 Decentralized Freelance Payments
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Get Paid Per{' '}
            <span className="gradient-text">Milestone</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Lock funds in escrow. Release payments as milestones are completed. No more waiting 30+ days.
          </p>
        </div>

        {/* Tabs */}
        {walletAddress && (
          <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              My Projects
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              + Create Project
            </button>
          </div>
        )}

        {/* Projects List */}
        {activeTab === 'projects' && (
          <>
            {!walletAddress ? (
              <div className="glass-card p-12 text-center">
                <p className="text-gray-400">Connect your wallet to see your projects</p>
              </div>
            ) : loading ? (
              <div className="glass-card p-12 text-center">
                <p className="text-gray-400">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-gray-400 mb-4">No projects yet</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold"
                >
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="glass-card p-6 hover:border-purple-500/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold gradient-text">
                          {formatAmount(project.totalAmount)} XLM
                        </div>
                        <div className="text-sm text-gray-400">
                          Released: {formatAmount(project.releasedAmount)} XLM
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          project.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : project.status === 'completed'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Freelancer: {project.freelancerAddress.substring(0, 10)}...
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Create Project Form */}
        {activeTab === 'create' && walletAddress && (
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
            <form onSubmit={createProject} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Freelancer Address *</label>
                <input
                  type="text"
                  value={freelancerAddress}
                  onChange={(e) => setFreelancerAddress(e.target.value)}
                  placeholder="G..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Build Landing Page"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the project scope..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Total Amount (XLM) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="e.g., 500"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Milestones</label>
                {milestones.map((milestone, index) => (
                  <div key={index} className="mb-4 p-4 bg-white/5 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Milestone title"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Amount (XLM)"
                        value={milestone.amount}
                        onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <textarea
                      placeholder="Milestone description"
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full mt-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMilestone}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  + Add Milestone
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Create Project & Lock Funds
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/10 mt-12 text-gray-400 text-sm">
          <p>Built on Stellar Soroban | Milestone-based Escrow for Freelancers</p>
          <p className="mt-2">© 2026 MilestoneTrust — Decentralized Freelance Payments</p>
        </footer>
      </div>
    </main>
  );
}