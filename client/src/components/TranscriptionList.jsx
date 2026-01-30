import TranscriptionCard from './TranscriptionCard';

function TranscriptionList({ transcriptions, loading, onDelete, onRefresh, currentUser }) {
  if (loading && transcriptions.length === 0) {
    return (
      <div className="card text-center p-8">
        <p className="text-gray-600">Loading transcriptions...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Transcription History</h2>
        <button
          onClick={onRefresh}
          className="btn btn-primary"
        >
          Refresh
        </button>
      </div>

      {transcriptions.length === 0 ? (
        <div className="text-center py-8 card">
          <p className="text-gray-500">No transcriptions yet. Start by uploading or recording audio.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {transcriptions.map((transcription) => (
            <TranscriptionCard
              key={transcription._id}
              transcription={transcription}
              onDelete={onDelete}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TranscriptionList;
