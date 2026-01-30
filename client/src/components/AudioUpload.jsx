import { useState } from 'react';
import axios from 'axios';

function AudioUpload({ onSuccess, apiUrl }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('audio/')) {
        setError('Please select an audio file');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('audio', file);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/transcribe`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      onSuccess(response.data);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Upload Audio</h2>

      <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
          id="audio-input"
        />
        <label htmlFor="audio-input" className="cursor-pointer">
          <svg
            className="w-12 h-12 mx-auto text-indigo-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className="text-gray-600">
            {file ? file.name : 'Click to select audio file'}
          </p>
          <p className="text-sm text-gray-400">or drag and drop</p>
        </label>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {uploading ? 'Uploading...' : 'Upload & Transcribe'}
      </button>
    </div>
  );
}

export default AudioUpload;
