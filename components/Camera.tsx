
import React, { useRef, useEffect, useState } from 'react';
import { Screen } from '../types';
import { X, Camera as CameraIcon, RefreshCw } from 'lucide-react';

interface CameraProps {
  onNavigate: (screen: Screen) => void;
}

const Camera: React.FC<CameraProps> = ({ onNavigate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Camera access denied or unavailable.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    // In a real app, you'd capture the frame here.
    // For this minimalist demo, we provide the UI feedback.
    const canvas = document.createElement('canvas');
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      alert("Photo captured to gallery (Simulated)");
    }
  };

  return (
    <div className="relative h-full bg-black flex flex-col animate-in fade-in duration-300">
      <div className="absolute top-10 left-8 z-10">
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="p-3 bg-black/40 rounded-full text-white backdrop-blur-md"
        >
          <X size={24} />
        </button>
      </div>

      {error ? (
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <p className="text-white/50">{error}</p>
        </div>
      ) : (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="flex-1 object-cover w-full h-full"
        />
      )}

      <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-12">
        <button 
          onClick={takePhoto}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform"
        >
          <div className="w-16 h-16 rounded-full bg-white/20"></div>
        </button>
      </div>
    </div>
  );
};

export default Camera;
