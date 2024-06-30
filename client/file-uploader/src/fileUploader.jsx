import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const server = "http://localhost:4000";

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadedFileUrl, setDownloadedFileUrl] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsFileSelected(true);
  };

  const getNewUrl = async (fileName, method) =>{
    try {
      const queryParams = {file: fileName, method: method};

      const response = await axios.get(server + '/pre-signed-url', { params: queryParams });
      if (response.data === null) {
        throw 'Error getting new url';
      }
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

  }

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const putUrl = await getNewUrl(selectedFile.name, 'PUT');

      console.log("putUrl", putUrl);

      const response = await axios.put(putUrl, selectedFile, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        },
      });

      if (response === null) {
        throw 'Error uploading file';
      }

      console.log('File uploaded successfully:', response.data);
      // Add any success handling code here (e.g., show success message)
      const getUrl = await getNewUrl(selectedFile.name, 'GET');
      console.log("getUrl", getUrl);
      // Assuming the server responds with a URL to download the uploaded file
      setDownloadedFileUrl(getUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      // Add any error handling code here (e.g., show error message)
    }
  };

  const handleDownload = async () => {
    if (!downloadedFileUrl) return;

    try {
      const response = await axios.get(downloadedFileUrl, {
        responseType: 'blob', // Important: responseType must be set to 'blob' for file download
      });

      // Create a blob object from the file response
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // Create a temporary URL to download the file
      const url = window.URL.createObjectURL(blob);

      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'downloaded-file.txt'); // Specify the default file name here
      document.body.appendChild(link);
      link.click();

      // Clean up resources
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Handle errors as needed
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">File Uploader</h2>
      <div className="custom-file mb-3">
        <input type="file" className="custom-file-input" id="customFile" onChange={handleFileChange} />
        <label className="custom-file-label" htmlFor="customFile">
          {selectedFile ? selectedFile.name : 'Choose file'}
        </label>
      </div>
      {isFileSelected && (
        <button className="btn btn-primary mb-3 mr-3" onClick={handleUpload}>
          Upload File
        </button>
      )}
      {downloadedFileUrl && (
        <button className="btn btn-success mb-3" onClick={handleDownload}>
          Download File
        </button>
      )}
      {uploadProgress > 0 && (
        <div className="progress mb-3">
          <div className="progress-bar" role="progressbar" style={{ width: `${uploadProgress}%` }}>
            {uploadProgress}%
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
