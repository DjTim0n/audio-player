'use client';

import { Howl } from 'howler';
import { useState, useEffect, useRef } from 'react';

export const AudioPlayer = () => {
  const [volume, setVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Текущее время трека
  const [duration, setDuration] = useState(0); // Длительность трека
  const [isLooping, setIsLooping] = useState(false); // Режим повтора
  const [selectedTrack, setSelectedTrack] = useState('./RobZombieDragula.mp3'); // Выбранный трек
  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const tracks = [
    { label: 'Rob Zombie - Dragula', src: './RobZombieDragula.mp3' },
    { label: 'BR.wav', src: './BR.wav' },
  ];

  useEffect(() => {
    initializeHowl(selectedTrack);

    return () => {
      soundRef.current?.unload();
      stopUpdatingTime(); // Чистим интервал
    };
  }, [selectedTrack, isLooping]); // Пересоздаём Howl при смене трека или режима повтора

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  const initializeHowl = (src: string) => {
    soundRef.current?.unload(); // Удаляем предыдущий объект Howl
    soundRef.current = new Howl({
      src: [src],
      volume: volume,
      loop: isLooping,
      onplay: () => {
        setIsPlaying(true);
        setDuration(soundRef.current?.duration() || 0); // Устанавливаем длительность
        startUpdatingTime(); // Начинаем обновлять время
      },
      onpause: () => {
        setIsPlaying(false);
        stopUpdatingTime(); // Останавливаем обновление времени
      },
      onstop: () => {
        setIsPlaying(false);
        setCurrentTime(0); // Сбрасываем текущее время
        stopUpdatingTime();
      },
      onend: () => {
        if (!isLooping) {
          setIsPlaying(false);
          setCurrentTime(0);
          stopUpdatingTime();
        }
      },
      preload: true,
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
      soundRef.current.seek(time); // Перематываем на указанное время
      setCurrentTime(time);
    }
  };

  const handleChangeVolume = (volume: number) => {
    setVolume(volume);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping); // Переключаем режим повтора
    if (soundRef.current) {
      soundRef.current.loop(!isLooping); // Обновляем loop в Howl
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0'); // Добавляем ведущий ноль для секунд
    return `${minutes}:${seconds}`;
  };

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTrack(e.target.value);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-dvh gap-4">
        <div className="flex flex-row gap-3 items-center mb-5">
          <p>Track:</p>
          <select value={selectedTrack} onChange={handleTrackChange} className="border rounded p-1 bg-black">
            {tracks.map((track) => (
              <option key={track.src} value={track.src}>
                {track.label}
              </option>
            ))}
          </select>
        </div>

        {isPlaying ? (
          <button className="m-2 rounded-md bg-green-500 text-white p-2" onClick={() => soundRef.current?.pause()}>
            Pause
          </button>
        ) : (
          <button className="m-2 rounded-md bg-blue-500 text-white p-2" onClick={() => soundRef.current?.play()}>
            Play
          </button>
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
