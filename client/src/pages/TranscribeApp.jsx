import { useState, useEffect } from 'react';
import AudioUpload from '../components/AudioUpload';
import AudioRecorder from '../components/AudioRecorder';
import TranscriptionList from '../components/TranscriptionList';

function TranscribeApp({ user, onLogout, apiUrl }) {
  const [transcriptions, setTranscriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTranscriptions();
  }, []);

  const fetchTranscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/transcribe`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTranscriptions(data);
      }
    } catch (error) {
      console.error('Failed to fetch transcriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTranscriptionAdded = (newTranscription) => {
    setTranscriptions([newTranscription, ...transcriptions]);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/transcribe/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setTranscriptions(transcriptions.filter(t => t._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete transcription:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-indigo-600">SpeechToText</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user.email}</span>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload & Record Section */}
          <div className="lg:col-span-1 space-y-4">
            {/* Tab Navigation */}
            <div className="flex gap-2 bg-white rounded-lg p-1 shadow">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 px-4 rounded font-medium transition ${
                  activeTab === 'upload'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Upload
              </button>
              <button
                onClick={() => setActiveTab('record')}
                className={`flex-1 py-2 px-4 rounded font-medium transition ${
                  activeTab === 'record'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Record
              </button>
            </div>

            {/* Content */}
            {activeTab === 'upload' ? (
              <AudioUpload onSuccess={handleTranscriptionAdded} apiUrl={apiUrl} />
            ) : (
              <AudioRecorder onSuccess={handleTranscriptionAdded} apiUrl={apiUrl} />
            )}
          </div>

          {/* Transcriptions History */}
          <div className="lg:col-span-2">
            <TranscriptionList
              transcriptions={transcriptions}
              loading={loading}
              onDelete={handleDelete}
              onRefresh={fetchTranscriptions}
              currentUser={user}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranscribeApp;
