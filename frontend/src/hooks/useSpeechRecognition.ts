import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  SpeechRecognitionConstructor,
  SpeechRecognitionErrorEventLike,
  SpeechRecognitionErrorType,
  SpeechRecognitionEventLike,
  SpeechRecognitionInstance,
} from '../types/speech';

function getSpeechRecognitionClass(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

function getFriendlyErrorMessage(errorType: SpeechRecognitionErrorType): string {
  switch (errorType) {
    case 'not-allowed':
      return 'Permiso de micrófono denegado. Permite el acceso al micrófono en tu navegador para dictar preguntas.';
    case 'no-speech':
      return 'No se detectó ninguna voz. Intenta hablar más cerca del micrófono.';
    case 'audio-capture':
      return 'No se detectó ningún micrófono disponible en tu dispositivo.';
    case 'network':
      return 'Error de red en el servicio de reconocimiento de voz. Comprueba tu conexión.';
    case 'not-supported':
      return 'Tu navegador no soporta reconocimiento de voz. Puedes usar el teclado normalmente.';
    default:
      return 'Hubo una incidencia con el micrófono. Inténtalo de nuevo.';
  }
}

export interface UseSpeechRecognitionOptions {
  lang?: string;
  onTranscript?: (transcript: string) => void;
}

export interface UseSpeechRecognitionResult {
  isSupported: boolean;
  isListening: boolean;
  error: SpeechRecognitionErrorType | null;
  errorMessage: string | null;
  startListening: () => void;
  stopListening: () => void;
  clearError: () => void;
}

export function useSpeechRecognition({
  lang = 'es-ES',
  onTranscript,
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionResult {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<SpeechRecognitionErrorType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTranscribedRef = useRef(false);
  const manualStopRef = useRef(false);
  const hadErrorRef = useRef(false);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const isSupported = Boolean(getSpeechRecognitionClass());

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setErrorMessage(null);
  }, []);

  const stopListening = useCallback(() => {
    manualStopRef.current = true;
    clearSilenceTimer();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignored if already stopped
      }
    }
    setIsListening(false);
  }, [clearSilenceTimer]);

  const startListening = useCallback(() => {
    clearError();
    hasTranscribedRef.current = false;
    manualStopRef.current = false;
    hadErrorRef.current = false;
    clearSilenceTimer();

    const RecognitionClass = getSpeechRecognitionClass();
    if (!RecognitionClass) {
      setError('not-supported');
      setErrorMessage(getFriendlyErrorMessage('not-supported'));
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignored
        }
      }

      const recognition = new RecognitionClass();
      recognition.lang = lang;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        clearError();
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
          if (!hasTranscribedRef.current && !manualStopRef.current) {
            try {
              recognitionRef.current?.abort();
            } catch {
              // Ignored
            }
            setError('no-speech');
            setErrorMessage(getFriendlyErrorMessage('no-speech'));
            setIsListening(false);
          }
        }, 7000);
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        clearSilenceTimer();
        hasTranscribedRef.current = true;

        let accumulated = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const item = event.results[i];
          if (item && item[0]) {
            accumulated += item[0].transcript;
          }
        }
        if (accumulated.trim() && onTranscriptRef.current) {
          onTranscriptRef.current(accumulated.trim());
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        clearSilenceTimer();
        hadErrorRef.current = true;
        const errType: SpeechRecognitionErrorType =
          event.error === 'not-allowed'
            ? 'not-allowed'
            : event.error === 'no-speech'
              ? 'no-speech'
              : event.error === 'audio-capture'
                ? 'audio-capture'
                : event.error === 'network'
                  ? 'network'
                  : 'unknown';

        setError(errType);
        setErrorMessage(getFriendlyErrorMessage(errType));
        setIsListening(false);
      };

      recognition.onend = () => {
        clearSilenceTimer();
        if (!hadErrorRef.current && !hasTranscribedRef.current && !manualStopRef.current) {
          setError('no-speech');
          setErrorMessage(getFriendlyErrorMessage('no-speech'));
        }
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      clearSilenceTimer();
      setError('unknown');
      setErrorMessage(getFriendlyErrorMessage('unknown'));
      setIsListening(false);
    }
  }, [lang, clearError, clearSilenceTimer]);

  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignored on unmount
        }
      }
    };
  }, [clearSilenceTimer]);

  return {
    isSupported,
    isListening,
    error,
    errorMessage,
    startListening,
    stopListening,
    clearError,
  };
}
