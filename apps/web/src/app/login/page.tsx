'use client';

import React from 'react';
import { GlassCard } from '@/components/layout/GlassCard';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use the environment variable for API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        login(username, data.access_token);
        router.push('/');
      } else {
        setError(data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Connection failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-[400px] p-8" hoverable={false}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-[#60a5fa] to-[#818cf8] flex items-center justify-center shadow-[0_4px_12px_rgba(99,102,241,0.35)] mb-4">
            <svg className="w-8 h-8 fill-white" viewBox="0 0 16 16">
              <path d="M3 3h4v4H3zm6 0h4v4h-4zM3 9h4v4H3zm6 2h1v2h-1zm2 0h1v2h-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Welcome to Mark<span className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">OS</span>
          </h1>
          <p className="text-[13px] text-text-secondary mt-1">Please sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-[12px] font-medium animate-in fade-in slide-in-from-top-1">
                ⚠️ {error}
              </div>
            )}
            <div>
              <label className="block text-[12px] font-semibold text-text-muted uppercase tracking-wider mb-1.5 ml-1">
                Username
              </label>
              <div className="flex items-center gap-2 bg-white/70 border border-glass rounded-xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-accent-blue/15 transition-all">
                <input
                  type="text"
                  placeholder="Enter username"
                  className="bg-transparent border-none outline-none w-full text-[14px] text-text-primary"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-muted uppercase tracking-wider mb-1.5 ml-1">
                Password
              </label>
              <div className="flex items-center gap-2 bg-white/70 border border-glass rounded-xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-accent-blue/15 transition-all">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none w-full text-[14px] text-text-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-8 py-3 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white rounded-xl font-semibold text-[14px] shadow-[0_2px_8px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_16px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 transition-all active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[12px] text-text-muted">
            Forgot password? <span className="text-accent-blue cursor-pointer font-medium">Reset here</span>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
