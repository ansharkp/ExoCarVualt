import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

// Define the App component
function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };

    provider && loadProvider();
  }, []);

  // Modified JSX structure with modified styles and positioning
  return (
    <div className="App">
      {/* Futuristic-themed navbar */}
      <nav className="navbar">
        <a href="#" className="navbar-brand">
          <h1>ExoVault</h1>
        </a>

        <ul className="navbar-nav">
          <li className="nav-item">
            <a href="#" className="nav-link">Home</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">Features</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">About</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">Contact</a>
          </li>
        </ul>
      </nav>

      {/* Background container with dynamic layers */}
      <div className="background-container">
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>
      </div>

      {/* Content container with account details, file upload, and file display */}
      <div className="content-container">
        <h2>Account Information</h2>
        <p>Account: {account ? account : "Not connected"}</p>

        <h2>Document Upload</h2>
        <FileUpload account={account} provider={provider} contract={contract} />

        <h2>Document Display</h2>
        <Display contract={contract} account={account} />
      </div>

      {/* Modal component for file sharing functionality */}
      {modalOpen && <Modal setModalOpen={setModalOpen} contract={contract} />}
    </div>
  );
}

// Export the App component
export default App;
