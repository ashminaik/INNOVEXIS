import { useState, useRef } from 'react';
import axios from 'axios';

function AudioRecorder({ onSuccess, apiUrl }) {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setError('');
    } catch (err) {
      setError('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleUpload = async () => {
    if (!audioBlob) {
      setError('Please record audio first');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/transcribe`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      onSuccess(response.data);
      setAudioBlob(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Record Audio</h2>

      <div className="flex gap-3">
        {!recording ? (
          <button
            onClick={startRecording}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            <span className="w-3 h-3 bg-white rounded-full"></span>
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
            Stop Recording
          </button>
        )}
      </div>

      {audioBlob && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Recording ready:</p>
          <audio
            src={URL.createObjectURL(audioBlob)}
            controls
            className="w-full mb-3"
          />
          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="btn btn-primary flex-1"
            >
              {uploading ? 'Uploading...' : 'Submit Recording'}
            </button>
            <button
              onClick={() => { setAudioBlob(null); setError(''); }}
              className="btn btn-muted flex-1"
            >
              Re-record
            </button>
          </div>
        </div>
      )}

      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
    </div>
  );
}

export default AudioRecorder;
