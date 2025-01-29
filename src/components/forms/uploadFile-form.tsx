'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { api } from '@/lib/config/axios';
import { IsLoadingIcon } from '../ui/loading';

export const UploadFileForm = () => {
  const [file, setFile] = useState<FileList | null>(null);
  const [artist, setArtist] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [album, setAlbum] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [year, setYear] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files);
  };

  const handleUpload = () => {
    const formData = new FormData();
    if (file) {
      formData.append('audioFile', file[0]);
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('album', album);
      formData.append('genre', genre);
      formData.append('year', year);
    }
    setIsLoading(true);
    api
      .post('/audio/uploadAudio', formData)
      .then(() => {
        setIsLoading(false);
        window.location.reload();
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <>
      <div className="rounded-xl bg-black p-2 py-6 ">
        {isLoading ? (
          <>
            <div className="h-[452px] w-[291px] flex flex-col items-center justify-center">
              <IsLoadingIcon />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5">
            <div className="w-1/2 flex flex-col items-center justify-center">
              <label htmlFor="Artist">Artist*</label>
              <Input
                type="text"
                id="Artist"
                value={artist}
                onChange={(e) => {
                  setArtist(e.target.value);
                }}
              />
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center">
              <label htmlFor="Title">Title*</label>
              <Input
                type="text"
                id="Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center">
              <label htmlFor="Album">Album</label>
              <Input
                type="text"
                id="Album"
                value={album}
                onChange={(e) => {
                  setAlbum(e.target.value);
                }}
              />
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center">
              <label htmlFor="Genre">Genre</label>
              <Input
                type="text"
                id="Genre"
                value={genre}
                onChange={(e) => {
                  setGenre(e.target.value);
                }}
              />
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center">
              <label htmlFor="Year">Year</label>
              <Input
                type="text"
                id="Year"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                }}
              />
            </div>
            <div className="w-4/5 my-2 flex flex-col items-center justify-center">
              <Input id="file-input" onChange={handleFileChange} type="file" accept="audio/*" />
            </div>
            <Button disabled={!title || !artist || !file} onClick={handleUpload}>
              Upload
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
