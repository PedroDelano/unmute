import { useEffect, useState } from "react";

export const useBackendServerUrl = () => {
  const [backendServerUrl, setBackendServerUrl] = useState<string | null>(null);

  useEffect(() => {
    // 1) If a fixed URL is provided, use it and exit.
    const fixed = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
    if (fixed) {
      setBackendServerUrl(fixed.replace(/\/$/, "")); // strip trailing slash
      return; // <-- no value returned (no cleanup)
    }

    // 2) Otherwise, compute from window (client-only).
    if (typeof window === "undefined") return;

    const inDocker = ["true", "1"].includes(
      (process.env.NEXT_PUBLIC_IN_DOCKER || "").toLowerCase()
    );

    const url = new URL(window.location.href);
    if (!inDocker) {
      // By default, target localhost:8000 (same host, port 8000)
      url.port = "8000";
      url.pathname = "";
    } else {
      // In-Docker mode expects a reverse proxy at /api
      url.pathname = "/api";
    }
    url.search = ""; // drop any query params

    setBackendServerUrl(url.toString().replace(/\/$/, ""));
  }, []);

  return backendServerUrl;
};

