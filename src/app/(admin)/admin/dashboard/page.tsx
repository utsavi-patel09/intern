
'use client';

import React, { useEffect, useRef, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";

export default function AdminCustomDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const uuid = "9c396d1f-0fed-4979-a26e-bfc89030c1a2";
  const supersetUrl = "http://localhost:8088";

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const fetchToken = async () => {
      const response = await fetch("/api/superset/token");
      const data = await response.json();
      return data.token;
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
      }).then(() => setLoading(false));
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-red-50 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "80px", height: "100%", width: "100%" }} className="fixed inset-0 bg-white" >

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full h-full overflow-hidden [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-none"
      />

    </div>
  );
}