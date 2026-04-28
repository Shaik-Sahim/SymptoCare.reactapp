import { useState, useRef } from 'react';

/**
 * Reusable camera scanner widget.
 *
 * Props:
 *   page       – unique key ('vision' | 'skin')
 *   addToast   – toast function
 *   logVault   – vault logger function
 *   onAnalyze  – callback fired after scanning animation completes
 *   icon       – bootstrap-icon class for the idle overlay icon
 *   iconColor  – CSS color for the idle icon
 *   children   – optional label shown above the scanner
 */
export default function Scanner({ page, addToast, logVault, onAnalyze, icon, iconColor = 'rgba(255,255,255,.2)', children }) {
  const videoRef  = useRef(null);
  const streamRef = useRef(null);
  const [camState,  setCamState]  = useState('idle');       // idle | streaming | captured
  const [scanning,  setScanning]  = useState(false);
  const [snapData,  setSnapData]  = useState(null);

  // ── Start camera ──────────────────────────────────────────────────────────
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      await new Promise(res => { video.onloadedmetadata = res; setTimeout(res, 2000); });
      await video.play();
      setCamState('streaming');
      addToast('Camera ready! Position yourself and capture.');
    } catch (err) {
      if (err.name === 'NotAllowedError')  addToast('Camera permission denied. Please allow camera access.', 'error');
      else if (err.name === 'NotFoundError') addToast('No camera found on this device.', 'error');
      else addToast('Camera error: ' + err.message, 'error');
    }
  };

  // ── Capture photo ─────────────────────────────────────────────────────────
  const capturePhoto = () => {
    if (camState !== 'streaming') { addToast('Please start camera first', 'error'); return; }
    const video = videoRef.current;
    if (!video?.srcObject || video.videoWidth === 0) { addToast('Camera not ready yet', 'error'); return; }

    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    setSnapData(canvas.toDataURL('image/jpeg', 0.9));

    // Stop stream
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCamState('captured');
    addToast('Photo captured! Click Analyze to get AI results.');
    logVault('Photo Captured', 'Image saved for analysis', 'scan');
  };

  // ── Retake ────────────────────────────────────────────────────────────────
  const retake = () => { setSnapData(null); setCamState('idle'); startCamera(); };

  // ── Analyze ───────────────────────────────────────────────────────────────
  const analyze = () => {
    if (camState !== 'captured') { addToast('Please capture a photo first', 'error'); return; }
    setScanning(true);
    setTimeout(() => { setScanning(false); onAnalyze(); }, 2500);
  };

  return (
    <div>
      {children}

      {/* Camera box */}
      <div className="scanner-wrap" id={`${page}-wrap`}>
        {scanning && (
          <>
            <div className="scan-overlay" />
            <div className="laser-line" />
            <div className="scanner-corners"><div className="sc-tr" /><div className="sc-bl" /></div>
          </>
        )}

        {/* Live video */}
        <video
          ref={videoRef}
          autoPlay playsInline muted
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            display: camState === 'streaming' ? 'block' : 'none',
          }}
        />

        {/* Snapshot */}
        {snapData && (
          <img
            src={snapData}
            alt="Captured"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}

        {/* Idle overlay */}
        {camState === 'idle' && !snapData && (
          <div className="scanner-ui">
            <i className={`bi ${icon}`} style={{ fontSize: '4rem', color: iconColor }} />
            <p style={{ color: 'rgba(255,255,255,.4)', marginTop: 12, fontSize: '1.1rem', fontWeight: 600 }}>
              POSITION THE AREA
            </p>
            <button className="btn-primary mt3" onClick={startCamera}>
              <i className="bi bi-camera-video" />Initialize Camera
            </button>
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 20 }}>
        {camState === 'streaming' && (
          <button className="btn-primary" onClick={capturePhoto}>
            <i className="bi bi-camera-fill" />Capture Photo
          </button>
        )}
        {camState === 'captured' && (
          <>
            <button className="btn-dark" onClick={analyze}><i className="bi bi-cpu" />Analyze with AI</button>
            <button className="btn-outline"  onClick={retake}><i className="bi bi-arrow-clockwise" />Retake</button>
          </>
        )}
      </div>
    </div>
  );
}