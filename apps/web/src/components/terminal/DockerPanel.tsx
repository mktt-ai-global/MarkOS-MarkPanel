'use client';

import React, { useState } from 'react';
import { Play, Square, RotateCcw, FileText, Plus, Search, Filter, Box } from 'lucide-react';
import { LogModal } from './LogModal';

interface Container {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'exited' | 'restarting' | 'paused';
  statusText: string;
  ports: string[];
  cpu: string;
  memory: string;
}

const MOCK_CONTAINERS: Container[] = [
  { id: '1', name: 'agenthub-web', image: 'agenthub/web:latest', status: 'running', statusText: 'Up 47 days', ports: ['3000:3000'], cpu: '1.2%', memory: '240MB' },
  { id: '2', name: 'agenthub-api', image: 'agenthub/api:latest', status: 'running', statusText: 'Up 47 days', ports: ['8000:8000'], cpu: '8.7%', memory: '1.2GB' },
  { id: '3', name: 'postgres', image: 'postgres:15-alpine', status: 'running', statusText: 'Up 47 days', ports: ['5432:5432'], cpu: '1.4%', memory: '1.4GB' },
  { id: '4', name: 'redis', image: 'redis:7-alpine', status: 'running', statusText: 'Up 47 days', ports: ['6379:6379'], cpu: '0.1%', memory: '48MB' },
  { id: '5', name: 'chromadb', image: 'chromadb/chroma:latest', status: 'running', statusText: 'Up 12 days', ports: ['8001:8000'], cpu: '0.5%', memory: '890MB' },
  { id: '6', name: 'celery-worker', image: 'agenthub/api:latest', status: 'restarting', statusText: 'Restarting (3h)', ports: [], cpu: '3.2%', memory: '560MB' },
  { id: '7', name: 'nginx-proxy', image: 'nginxproxy/nginx-proxy', status: 'running', statusText: 'Up 2 days', ports: ['80:80', '443:443'], cpu: '0.2%', memory: '12MB' },
  { id: '8', name: 'portainer', image: 'portainer/portainer-ce', status: 'exited', statusText: 'Exited (24) 5 days ago', ports: ['9000:9000'], cpu: '0%', memory: '0B' },
];

export const DockerPanel: React.FC = () => {
  const [containers] = useState<Container[]>(MOCK_CONTAINERS);
  const [search, setSearch] = useState('');
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [logModalOpen, setLogModalOpen] = useState(false);

  const filtered = containers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.image.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (id: string, action: string) => {
    console.log(`Executing ${action} on ${id}`);
    // Implement API call here
  };

  const showLogs = (container: Container) => {
    setSelectedContainer(container);
    setLogModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Docker Containers</h2>
          <p className="text-sm text-slate-500 mt-1">{containers.length} containers total · {containers.filter(c => c.status === 'running').length} running</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all font-medium text-sm">
            <Plus size={16} />
            <span>Deploy</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 glass rounded-2xl px-4 py-2.5 flex items-center space-x-3 border border-white/40 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search containers or images..." 
            className="bg-transparent border-none outline-none w-full text-sm text-slate-700 placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="p-2.5 glass rounded-2xl border border-white/40 shadow-sm text-slate-500 hover:text-blue-600 transition-colors">
          <Filter size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((container) => (
          <div key={container.id} className="glass-card rounded-2xl border border-white/40 overflow-hidden group">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${
                    container.status === 'running' ? 'bg-green-500/10 text-green-600' :
                    container.status === 'restarting' ? 'bg-amber-500/10 text-amber-600' :
                    'bg-slate-500/10 text-slate-600'
                  }`}>
                    <Box size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 truncate max-w-[140px] leading-tight">{container.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono truncate max-w-[140px] mt-0.5">{container.image}</p>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  container.status === 'running' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                  container.status === 'restarting' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                  'bg-slate-500/10 text-slate-600 border border-slate-500/20'
                }`}>
                  {container.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5 p-3 bg-slate-500/5 rounded-xl border border-slate-500/5">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">CPU Usage</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-slate-700">{container.cpu}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Memory</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-slate-700">{container.memory}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-1.5">
                  <button 
                    onClick={() => handleAction(container.id, 'start')}
                    disabled={container.status === 'running'}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-green-600 hover:bg-green-50 transition-colors disabled:opacity-30" title="Start"
                  >
                    <Play size={14} fill="currentColor" />
                  </button>
                  <button 
                    onClick={() => handleAction(container.id, 'stop')}
                    disabled={container.status !== 'running'}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30" title="Stop"
                  >
                    <Square size={14} fill="currentColor" />
                  </button>
                  <button 
                    onClick={() => handleAction(container.id, 'restart')}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 transition-colors" title="Restart"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
                <button 
                  onClick={() => showLogs(container)}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors text-xs font-medium"
                >
                  <FileText size={14} />
                  <span>Logs</span>
                </button>
              </div>
            </div>
            
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
               <span className="truncate">{container.statusText}</span>
               <span className="font-mono text-[10px] text-slate-500">{container.ports.join(', ') || 'No ports'}</span>
            </div>
          </div>
        ))}
      </div>

      <LogModal 
        isOpen={logModalOpen} 
        onClose={() => setLogModalOpen(false)} 
        containerName={selectedContainer?.name || ''}
      />
    </div>
  );
};
