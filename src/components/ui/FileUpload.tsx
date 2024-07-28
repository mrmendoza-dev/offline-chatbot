

import React, { useState } from "react";



function FileUpload({ acceptedFileTypes, maxFileSizeMB, onFileUpload }: any) {
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSizeInBytes = maxFileSizeMB * 1024 * 1024;
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      // Check file size
      if (file.size > maxSizeInBytes) {
        setFileError(`File size exceeds ${maxFileSizeMB}MB.`);
        event.target.value = ""; // Clear the input
        onFileUpload(null); // Notify parent component of the error
        return;
      }

      // Check file type
      if (!fileExtension || !acceptedFileTypes.includes(fileExtension)) {
        setFileError(`Invalid file type.`);
        event.target.value = ""; // Clear the input
        onFileUpload(null); // Notify parent component of the error
        return;
      }

      setFileError(null);
      onFileUpload(file);
    } else {
      onFileUpload(null);
    }
  };

  const formatAcceptedFileTypes = (types: string[]) => {
    if (types.length === 1) {
      return types[0].toUpperCase();
    }
    const allButLast = types
      .slice(0, -1)
      .map((type) => type.toUpperCase())
      .join(", ");
    const last = types[types.length - 1].toUpperCase();
    return `${allButLast}, or ${last}`;
  };

  const acceptAttribute = acceptedFileTypes.map((type: any) => `.${type}`).join(",");

  return (
    <>
      <input
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="file_input"
        type="file"
        accept={acceptAttribute}
        onChange={handleFileChange}
      />
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
        {formatAcceptedFileTypes(acceptedFileTypes)} (MAX. {maxFileSizeMB}MB).
      </p>
      {fileError && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {fileError}
        </p>
      )}
    </>
  );
}


export default FileUpload;