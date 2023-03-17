import React, { useState } from "react";

export default function useFileHandler() {
  const [isFileError, setIsFileError] = useState<boolean>(false);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File>();

  const regex = /(\.jpg|\.jpeg|\.png|\.webp)$/i;

  function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    setIsFileError(false);


    if(!e.target.files) return;
    const file = e.target.files[0];
    const size = file && file.size / 1024 / 1024;

    const value = e.target.value;

    setIsFileLoading(true);

    if (!regex.exec(value)) {
      console.error("File type must be .jpg or .png");
      setIsFileError(true);
    } else if (size && size > 1) {
      console.error("File size exceeded 1 MB");
    } else if(file) {
      setFile(file);
    }

    setIsFileLoading(false);
  }

  return { file,  uploadFile, isFileError, isFileLoading };
}
