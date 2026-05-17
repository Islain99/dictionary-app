import { useState, useCallback, useRef, useEffect } from 'react';

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const audioRef = useRef(null);

  // Nettoie l'audio quand le composant est démonté
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const play = useCallback((url) => {
    if (!url) {
      setAudioError('No audio available for this word.');
      return;
    }

    // Stoppe l'audio en cours si différent
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setAudioError(null);
    setIsPlaying(true);

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      setIsPlaying(false);
      setAudioError('Could not play audio.');
    };

    audio.play().catch(() => {
      setIsPlaying(false);
      setAudioError('Could not play audio.');
    });
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  return { isPlaying, audioError, play, stop };
};