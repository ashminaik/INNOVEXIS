import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { MagicCard } from './MagicBento'
import DecryptedText from './DecryptedText'
import Folder from './Folder'
import './Transcriber.css'

function Transcriber({ token }) {
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')
  const [recordingTime, setRecordingTime] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const fileInputRef = useRef(null)
  const timerRef = useRef(null)

  // Timer effect for recording duration
  useEffect(() => {
    if (recording) {
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [recording])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' })
        setAudioBlob(blob)
      }

      mediaRecorder.start()
      setRecording(true)
      setMessage('')
    } catch (error) {
      setMessage('Error accessing microphone: ' + error.message)
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current.stop()
    mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    setRecording(false)
    setMessage('')
  }

  const handleRecordClick = () => {
    if (recording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAudioBlob(file)
      setMessage('')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!loading && !recording && !audioBlob) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    if (loading || recording || audioBlob) return
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      const validTypes = ['audio/', 'video/mp4', 'video/webm']
      const isValid = validTypes.some(type => file.type.startsWith(type)) ||
        /\.(mp3|wav|m4a|aac|ogg|webm|flac|mp4)$/i.test(file.name)
      
      if (isValid) {
        setAudioBlob(file)
        setMessage('')
      } else {
        setMessage('Please drop a valid audio file')
      }
    }
  }

  const handleSubmit = async () => {
    if (!audioBlob) {
      setMessage('No audio to transcribe')
      return
    }

    setLoading(true)
    setMessage('Uploading and transcribing...')

    try {
      const base64Audio = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(audioBlob)
      })

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/transcribe/upload`,
        {
          audio: base64Audio,
          title: title || 'Untitled',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        }
      )

      setMessage('transcribing')
      setAudioBlob(null)
      setTitle('')
      setRecordingTime(0)
      if (fileInputRef.current) fileInputRef.current.value = ''

      // Poll for completion
      const transcriptId = response.data.transcriptId
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/transcribe/${transcriptId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          if (statusResponse.data.status === 'completed') {
            setMessage('completed')
            clearInterval(pollInterval)
            // Clear the completed message after 2.5 seconds
            setTimeout(() => setMessage(''), 2500)
          } else if (statusResponse.data.status === 'failed') {
            setMessage('Transcription failed')
            clearInterval(pollInterval)
          }
        } catch (err) {
          console.error('Polling error:', err)
        }
      }, 2000)
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message
      setMessage('Error: ' + errorMessage)
      
      if (errorMessage === 'Invalid token' || errorMessage === 'No token provided') {
        localStorage.removeItem('token')
        window.location.reload()
      }
    } finally {
      setLoading(false)
    }
  }

  const cancelAudio = () => {
    setAudioBlob(null)
    setMessage('')
    setRecordingTime(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="transcriber-container">
      {/* Title Input - MagicCard style */}
      <div className="title-card">
        <input
          type="text"
          placeholder="Enter title for transcription"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          className="title-input-magic"
        />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/mp4,video/webm,.mp3,.wav,.m4a,.aac,.ogg,.webm,.flac,.mp4"
        onChange={handleFileUpload}
        disabled={loading || recording}
        style={{ display: 'none' }}
      />

      {/* Magic Bento Cards */}
      <div className="magic-cards-container">
        <MagicCard
          onClick={handleRecordClick}
          disabled={loading || audioBlob}
          enableStars={true}
          enableBorderGlow={true}
          clickEffect={true}
          glowColor={recording ? "255, 59, 48" : "132, 0, 255"}
        >
          <div className="card__content card__content--centered">
            {recording ? (
              <>
                <div className="recording-indicator">
                  <span className="recording-dot"></span>
                  <span className="recording-timer">{formatTime(recordingTime)}</span>
                </div>
                <h3 className="card__title">Recording...</h3>
                <p className="card__description">Click to stop</p>
              </>
            ) : (
              <>
                <h3 className="card__title">Record audio</h3>
                <p className="card__description">Click to start recording</p>
              </>
            )}
          </div>
        </MagicCard>

        <MagicCard
          onClick={handleUploadClick}
          disabled={loading || recording || audioBlob}
          enableStars={true}
          enableBorderGlow={true}
          clickEffect={true}
          glowColor={isDragging ? "0, 255, 132" : "132, 0, 255"}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="card__content card__content--centered upload-card-content">
            <div className="folder-background">
              <Folder color="#5227FF" size={1.0} />
            </div>
            <div className="upload-text-content">
              <h3 className="card__title">Upload audio file</h3>
              <p className="card__description">Select or drop a file</p>
            </div>
          </div>
        </MagicCard>
      </div>

      {/* Submit Button - appears after audio is ready */}
      {audioBlob && !loading && (
        <div className="submit-section">
          <div className="submit-card" onClick={handleSubmit}>
            <span className="submit-text">Submit</span>
          </div>
          <div className="cancel-card" onClick={cancelAudio}>
            <span className="cancel-text">Cancel</span>
          </div>
        </div>
      )}

      {/* Loading/Processing State */}
      {loading && (
        <div className="processing-section">
          <div className="processing-card">
            <div className="processing-spinner"></div>
            <span className="processing-text">Processing transcription...</span>
          </div>
        </div>
      )}

      {/* Transcribing Message - plain text */}
      {message === 'transcribing' && !loading && (
        <div className="transcribing-section">
          <div className="transcribing-text">
            <DecryptedText
              text="transcribing audio now..."
              animateOn="view"
              speed={80}
              maxIterations={20}
              sequential={true}
              revealDirection="start"
              className="decrypted-revealed"
              encryptedClassName="decrypted-encrypted"
              parentClassName="decrypted-text"
            />
          </div>
        </div>
      )}

      {/* Completed Message - green card */}
      {message === 'completed' && !loading && (
        <div className="transcribing-section">
          <div className="transcribing-card completed">
            <DecryptedText
              text="Transcription Completed"
              animateOn="view"
              speed={80}
              maxIterations={20}
              sequential={true}
              revealDirection="start"
              className="decrypted-revealed"
              encryptedClassName="decrypted-encrypted"
              parentClassName="decrypted-text"
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {message && message !== 'transcribing' && message !== 'completed' && !loading && (
        <div className="message error">
          {message}
        </div>
      )}
    </div>
  )
}

export default Transcriber
