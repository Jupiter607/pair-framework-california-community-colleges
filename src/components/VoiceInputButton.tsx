import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import { transcribeAudio } from '../services/api';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  placeholderText?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  className = '',
  placeholderText = 'Speak your input...'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useFallbackRecording, setUseFallbackRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API availability
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          onTranscript(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error, switching to audio recording:', event.error);
        setUseFallbackRecording(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setUseFallbackRecording(true);
    }
  }, [onTranscript]);

  const startListening = async () => {
    if (!useFallbackRecording && recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        return;
      } catch (err) {
        console.warn('Native speech recognition failed, fallback to recorder', err);
        setUseFallbackRecording(true);
      }
    }

    // Fallback: MediaRecorder sending audio to Gemini backend
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsProcessing(true);
        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            const res = await transcribeAudio(base64Audio, 'audio/webm');
            if (res.transcript) {
              onTranscript(res.transcript);
            }
            setIsProcessing(false);
          };
        } catch (err) {
          console.error('Failed to transcribe audio:', err);
          setIsProcessing(false);
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      alert('Could not access microphone. Please check browser permissions.');
    }
  };

  const stopListening = () => {
    if (!useFallbackRecording && recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <button
      type="button"
      id="btn-voice-input"
      onClick={toggleListening}
      disabled={isProcessing}
      title={isListening ? 'Click to stop voice recording' : placeholderText}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        isListening
          ? 'bg-rose-600 text-white animate-pulse shadow-md'
          : isProcessing
          ? 'bg-amber-100 text-amber-800 border border-amber-300'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
      } ${className}`}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Transcribing Voice...</span>
        </>
      ) : isListening ? (
        <>
          <MicOff className="w-4 h-4" />
          <span>Listening (Recording)...</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 text-slate-600" />
          <span>Voice Input</span>
        </>
      )}
    </button>
  );
};
