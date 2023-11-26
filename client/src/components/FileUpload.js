import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

// FileUpload component for uploading documents to IPFS
const FileUpload = ({ contract, account, provider }) => {
  // State to track the selected file and its name
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No document selected");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file) {
      try {
        // Create a FormData object and append the selected file
        const formData = new FormData();
        formData.append("file", file);

        // Make a POST request to Pinata API to pin the file to IPFS
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `498ffefeab6511977c14`,
            pinata_secret_api_key: `e3f207509c8bd5a67310ef6a292ce5ff26fc01c0d336b876028640185c4def64`,
            "Content-Type": "multipart/form-data",
          },
        });

        // Construct the IPFS hash URL and call the contract's add function
        const imgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        contract.add(account, imgHash);

        // Display success message and reset file state
        alert("Successfully document Uploaded");
        setFileName("No document selected");
        setFile(null);
      } catch (e) {
        // Display an error message if the document upload fails
        alert("Unable to upload document to Pinata");
      }
    }

    // Reset file state and display success message
    alert("Successfully document Uploaded");
    setFileName("No document selected");
    setFile(null);
  };

  // Handle file selection
  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    
    // Read the file as an array buffer
    reader.readAsArrayBuffer(data);

    // Set the selected file and its name when the reading is complete
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };

  // Render the FileUpload component
  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        {/* Label and input for choosing a document file */}
        <label htmlFor="file-upload" className="choose">
          Choose Document
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        {/* Display the selected document's name */}
        <span className="textArea">Document: {fileName}</span>
        {/* Button to upload the selected document */}
        <button type="submit" className="upload" disabled={!file}>
          Upload Document
        </button>
      </form>
    </div>
  );
};

// Export the FileUpload component as the default export
export default FileUpload;
