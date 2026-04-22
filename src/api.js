const API_BASE = "https://docdine-api-1.onrender.com";

export const api = {
  async upload(file, onProgress) {
    const form = new FormData();
    form.append("file", file);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE}/extract`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 40));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          try { reject(new Error(JSON.parse(xhr.responseText).detail || "Server error")); }
          catch { reject(new Error(`Server error ${xhr.status}`)); }
        }
      };
      xhr.onerror = () => reject(new Error("Network error — is the API reachable?"));
      xhr.send(form);
    });
  },

  async pollStatus(jobId, onProgress) {
    const start   = Date.now();
    const timeout = 120_000;
    while (Date.now() - start < timeout) {
      await new Promise(r => setTimeout(r, 1500));
      const res  = await fetch(`${API_BASE}/jobs/${jobId}`);
      if (!res.ok) throw new Error(`Status check failed (${res.status})`);
      const data = await res.json();
      if (data.progress) onProgress(40 + Math.round(data.progress * 0.6));
      if (data.status === "done")   return data.result;
      if (data.status === "failed") throw new Error(data.error || "Extraction failed");
    }
    throw new Error("Timed out waiting for extraction");
  },

  async health() {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(4000) });
      return res.ok;
    } catch { return false; }
  },
};
