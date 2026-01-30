import { useState } from 'react';

function TranscriptionCard({ transcription, onDelete, currentUser }) {
  const [showFullText, setShowFullText] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transcription?')) {
      setIsDeleting(true);
      await onDelete(transcription._id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const textPreview = transcription.text.length > 200
    ? transcription.text.substring(0, 200) + '...'
    : transcription.text;

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 truncate">{transcription.fileName}</h3>
          <p className="meta">{formatDate(transcription.createdAt)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">{currentUser?.email || 'You'}</p>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50 mt-2"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded p-3 mb-3">
        <p className="text-gray-700 text-sm">
          {showFullText ? transcription.text : textPreview}
        </p>
        {transcription.text.length > 200 && (
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="text-indigo-600 text-sm font-medium mt-2 hover:underline"
          >
            {showFullText ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(transcription.text));
            element.setAttribute('download', `${transcription.fileName.split('.')[0]}.txt`);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Download Text
        </button>
        <span className="meta">{transcription.status}</span>
      </div>
    </div>
  );
}

export default TranscriptionCard;
