'use client';

import { api } from '@/lib/config/axios';
import { useAuthStore } from '@/store/auth/auth-store-provider';
import { Howl } from 'howler';
import { useState, useEffect, useRef } from 'react';

interface Track {
  title: string;
  artist: string;
  url: string;
}

export const AudioPlayer = () => {
  const [volume, setVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const access_token = useAuthStore((state) => state.access_token);

  const getTracks = async () => {
    await api.get('audio/get_tracks').then((response) => {
      console.log('🚀 ~ awaitapi.get ~ response:', response);
      setTracks(response.data);
    });
  };

  useEffect(() => {
    getTracks();
  }, []);

  useEffect(() => {
    if (selectedTrack) {
      initializeHowl('/' + selectedTrack);
    }

    return () => {
      soundRef.current?.unload();
      stopUpdatingTime();
    };
  }, [selectedTrack, isLooping]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  const getBlobFromUrl = async (url: string) => {
    const response = await api.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: response.headers['content-type'] });

    const objectUrl = URL.createObjectURL(blob);

    return objectUrl;
  };

  const initializeHowl = async (src: string) => {
    setIsLoading(true);
    const objectUrl = await getBlobFromUrl(src);
    setIsLoading(false);
    soundRef.current?.unload();
    soundRef.current = new Howl({
      src: [objectUrl],
      volume: volume,
      loop: isLooping,
      html5: true,
      xhr: {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        withCredentials: true,
      },
      onload: () => {
        setDuration(soundRef.current?.duration() || 0);
      },
      onplay: () => {
        setIsPlaying(true);
        setDuration(soundRef.current?.duration() || 0);
        startUpdatingTime();
      },
      onpause: () => {
        setIsPlaying(false);
        stopUpdatingTime();
      },
      onstop: () => {
        setIsPlaying(false);
        setCurrentTime(0);
        stopUpdatingTime();
      },
      onend: () => {
        if (!isLooping) {
          setIsPlaying(false);
          setCurrentTime(0);
          stopUpdatingTime();
        }
      },
    });
  };

  const startUpdatingTime = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (soundRef.current) {
          setCurrentTime(soundRef.current.seek() as number);
        }
      }, 1000);
    }
  };

  const stopUpdatingTime = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      intervalRef.current = null;
    }
  };

  const handleSeek = (time: number) => {
    if (soundRef.current) {
      soundRef.current.seek(time);
      setCurrentTime(time);
    }
  };

  const handleChangeVolume = (volume: number) => {
    setVolume(volume);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    if (soundRef.current) {
      soundRef.current.loop(!isLooping);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTrack(e.target.value);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 bg-black p-5 rounded-xl">
        <div className="flex flex-row gap-3 items-center">
          <p>Track:</p>
          <select value={selectedTrack} onChange={handleTrackChange} className="border rounded p-1 bg-black">
            <option value="">Select a track</option>
            {tracks.map((track, inx) => (
              <option key={inx} value={track.url}>
                {track.artist} - {track.title}
              </option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
        ) : (
          <>
            {isPlaying ? (
              <button className="m-2 rounded-md bg-green-500 text-white p-2" onClick={() => soundRef.current?.pause()}>
                Pause
              </button>
            ) : (
              <button className="m-2 rounded-md bg-blue-500 text-white p-2" onClick={() => soundRef.current?.play()}>
                Play
              </button>
            )}
          </>
        )}

        <div>
          <p>Current Volume: {Math.round(volume * 100)}%</p>
        </div>

        <div className="flex flex-row gap-3">
          <p>Volume:</p>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => handleChangeVolume(parseFloat(e.target.value))}
          />
        </div>

        <div className="flex flex-row gap-3">
          <p>Duration:</p>
          <div>{formatTime(currentTime)} </div>
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
          />
          <div>{formatTime(duration)}</div>
        </div>

        <div className="flex flex-row gap-3 items-center">
          <p>Loop:</p>
          <button
            className={`m-2 rounded-md p-2 ${isLooping ? 'bg-green-500 text-white' : 'bg-gray-500 text-black'}`}
            onClick={toggleLoop}
          >
            {isLooping ? 'Disable Loop' : 'Enable Loop'}
          </button>
        </div>
      </div>
    </>
  );
};
