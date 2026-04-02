'use client';

import React, { useEffect, useRef, useState } from 'react';
import { embedDashboard } from '@superset-ui/embedded-sdk';

interface SupersetDashboardProps {
  uuid: string;
  supersetUrl: string;
}

const SupersetDashboard: React.FC<SupersetDashboardProps> = ({ uuid, supersetUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/superset/token');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch token');
        }
        const data = await response.json();
        return data.token;
      } catch (err) {
        console.error('Superset Dashboard Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
        return null;
      }
    };

    if (containerRef.current) {
      embedDashboard({
        id: uuid,
        supersetDomain: supersetUrl,
        mountPoint: containerRef.current,
        fetchGuestToken: fetchToken,
        dashboardUiConfig: {
          hideTitle: true,
          hideTab: true,
          hideChartControls: true,
        },
      }).then(() => {
        setLoading(false);
      }).catch((err) => {
        console.error('Embedding failed:', err);
        setError('Embedding failed');
        setLoading(false);
      });
    }
  }, [uuid, supersetUrl]);

  if (error) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-red-50 text-red-600 rounded-lg border border-red-200">
        <div className="text-center p-8">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="font-bold">Failed to load analytics dashboard</p>
          <p className="text-sm opacity-75 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[60vh] flex-1 bg-white rounded-lg overflow-hidden border border-gray-100 relative shadow-inner flex flex-col">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 transition-opacity duration-300">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="flex-1 w-full relative min-h-[60vh] [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-none"
      />
    </div>
  );
};

export default SupersetDashboard;
