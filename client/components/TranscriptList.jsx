import { useState, useEffect } from 'react'
import axios from 'axios'
import './TranscriptList.css'

function TranscriptList({ token }) {
  const [transcripts, setTranscripts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    fetchTranscripts()
    const interval = setInterval(fetchTranscripts, 3000) // Poll every 3 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchTranscripts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/transcribe/list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setTranscripts(response.data)
      setError('')
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch transcripts'
      setError(errorMessage)
      console.error(err)
      
      // If token is invalid, trigger logout
      if (errorMessage === 'Invalid token' || errorMessage === 'No token provided') {
        localStorage.removeItem('token')
        window.location.reload()
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteTranscript = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transcript?')) {
      return
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/transcribe/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setTranscripts(transcripts.filter((t) => t._id !== id))
    } catch (err) {
      setError('Failed to delete transcript')
    }
  }

  const [copiedId, setCopiedId] = useState(null)

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: '○',
      processing: '◐',
      completed: '●',
      failed: '✕',
    }
    return statusMap[status] || '?'
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
  }

  const getAudioUrl = (audioPath) => {
    // Construct full URL for the audio file
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '')
    return `${baseUrl}${audioPath}`
  }

  return (
    <div className="transcript-container">
      <div className="transcript-header">
        <h2>Transcription History</h2>
        <button onClick={fetchTranscripts} className="refresh-btn">
          Refresh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading transcripts...</div>
      ) : transcripts.length === 0 ? (
        <div className="empty-state">
          <p>No transcriptions yet. Start by recording or uploading audio!</p>
        </div>
      ) : (
        <div className="transcripts-grid">
          {transcripts.map((transcript) => {
            const { date, time } = formatDateTime(transcript.createdAt)
            return (
              <div key={transcript._id} className="transcript-card">
                <div
                  className="card-header"
                  onClick={() =>
                    setExpandedId(
                      expandedId === transcript._id ? null : transcript._id
                    )
                  }
                >
                  <div className="card-title">
                    <span className={`status-badge status-${transcript.status}`}>
                      {getStatusBadge(transcript.status)}
                    </span>
                    <h3>{transcript.title}</h3>
                    <span className="card-meta-inline">
                      {date} • {time}
                      {transcript.confidence && ` • ${(transcript.confidence * 100).toFixed(1)}% Confidence`}
                    </span>
                  </div>
                  <span className="expand-icon">
                    {expandedId === transcript._id ? '▼' : '▶'}
                  </span>
                </div>

                {expandedId === transcript._id && (
                  <div className="card-content card-content-compact">
                    {/* Audio Player */}
                    {transcript.audioUrl && (
                      <div className="audio-player-section-compact">
                        <audio 
                          controls 
                          className="audio-player"
                          src={getAudioUrl(transcript.audioUrl)}
                        >
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}

                    {transcript.status === 'completed' && transcript.text && (
                      <div className="transcript-text-compact">
                        <p>{transcript.text}</p>
                        <button
                          onClick={() => copyToClipboard(transcript.text, transcript._id)}
                          className="copy-btn-styled"
                          title="Copy text"
                        >
                          {copiedId === transcript._id ? (
                            <span className="copy-success">
                              <svg className="copy-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 7 2 2 4-4m-5-9v4h4V3h-4Z"/>
                              </svg>
                              <span>Copied</span>
                            </span>
                          ) : (
                            <span className="copy-default">
                              <svg className="copy-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"/>
                              </svg>
                              <span>Copy</span>
                            </span>
                          )}
                        </button>
                      </div>
                    )}

                    {transcript.status === 'processing' && (
                      <div className="processing-message">
                        Processing your audio... This may take a few moments.
                      </div>
                    )}

                    {transcript.status === 'failed' && (
                      <div className="error-message">
                        Transcription failed. Please try again.
                      </div>
                    )}

                    <button
                      onClick={() => deleteTranscript(transcript._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TranscriptList
