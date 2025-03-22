import React, { useState } from 'react';
import axios from 'axios';

const ExcelLeadUploadForm = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/leads/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
      alert('Leads created successfully!');
    } catch (error) {
      console.error('Error creating leads:', error);
      setMessage('Error creating leads');
    }
  };

  return (
    <div>
      <h1>Upload Excel to Generate Leads</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ExcelLeadUploadForm;
