import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const App = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [formData, setFormData] = useState({
    complaintType: "",
    incidentDetails: "",
    name: "",
    contactAddress: "", // This will hold the latitude and longitude
    cityStateZip: "",
    contact: "",
    email: "",
  });
  const [fetchedData, setFetchedData] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [searchAddress, setSearchAddress] = useState("");

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  // ABI
  const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor",
    },
    {
      "inputs": [],
      "name": "getData",
      "outputs": [
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_address", "type": "address" },
      ],
      "name": "getDataByAddress",
      "outputs": [
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "string", "name": "", "type": "string" },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "inputs": [
        { "internalType": "string", "name": "_complaintType", "type": "string" },
        { "internalType": "string", "name": "_incidentDetails", "type": "string" },
        { "internalType": "string", "name": "_name", "type": "string" },
        { "internalType": "string", "name": "_contactAddress", "type": "string" },
        { "internalType": "string", "name": "_cityStateZip", "type": "string" },
        { "internalType": "string", "name": "_contact", "type": "string" },
        { "internalType": "string", "name": "_email", "type": "string" },
      ],
      "name": "setData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    },
  ];

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const signer = provider.getSigner();
          const userAddress = await signer.getAddress();
          setAccount(userAddress);

          const contractInstance = new ethers.Contract(contractAddress, abi, signer);
          setContract(contractInstance);
        } catch (error) {
          console.error("Error initializing Ethereum provider:", error);
        }
      } else {
        console.error("Ethereum wallet not found. Please install MetaMask.");
      }
    };

    // Fetch geolocation
    const fetchGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            setFormData((prevData) => ({
              ...prevData,
              contactAddress: `Lat: ${latitude}, Lon: ${longitude}`,
            }));
          },
          (error) => {
            console.error("Error fetching geolocation:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    init();
    fetchGeolocation();
  }, [contractAddress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitFormData = async () => {
    if (contract) {
      try {
        const tx = await contract.setData(
          formData.complaintType,
          formData.incidentDetails,
          formData.name,
          formData.contactAddress, // Geolocation-based address
          formData.cityStateZip,
          formData.contact,
          formData.email
        );
        await tx.wait();
        console.log("Form data submitted successfully.");
        alert("Data successfully submitted to the blockchain!");
      } catch (error) {
        console.error("Error submitting form data:", error);
      }
    }
  };

  const fetchUserData = async () => {
    if (contract) {
      try {
        const data = await contract.getData();
        setFetchedData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const fetchOwnerData = async () => {
    if (contract && searchAddress) {
      try {
        const data = await contract.getDataByAddress(searchAddress);
        setOwnerData(data);
      } catch (error) {
        console.error("Error fetching data by address:", error);
      }
    }
  };

  return (
    <div>
      <h1>Incident Reporting System</h1>
      <p>Connected to: {account || "Not connected"}</p>

      <div>
        <h2>Submit Incident Form</h2>
        <input
          type="text"
          name="complaintType"
          placeholder="Complaint Type"
          value={formData.complaintType}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="incidentDetails"
          placeholder="Incident Details"
          value={formData.incidentDetails}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="contactAddress"
          placeholder="Device Location (auto-filled)"
          value={formData.contactAddress}
          readOnly // Make it read-only since it's auto-filled
        />
        <input
          type="text"
          name="cityStateZip"
          placeholder="City, State, Zip"
          value={formData.cityStateZip}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleInputChange}
        />
        <button onClick={submitFormData}>Submit Data</button>
      </div>

      <div>
        <h2>Fetch My Data</h2>
        <button onClick={fetchUserData}>Get My Data</button>
        {fetchedData && (
          <div>
            <p>Complaint Type: {fetchedData[0]}</p>
            <p>Incident Details: {fetchedData[1]}</p>
            <p>Name: {fetchedData[2]}</p>
            <p>Contact Address: {fetchedData[3]}</p>
            <p>City, State, Zip: {fetchedData[4]}</p>
            <p>Contact: {fetchedData[5]}</p>
            <p>Email: {fetchedData[6]}</p>
          </div>
        )}
      </div>

      <div>
        <h2>Fetch Data by Address</h2>
        <input
          type="text"
          placeholder="Enter Address"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
        />
        <button onClick={fetchOwnerData}>Search</button>
        {ownerData && (
          <div>
            <p>Complaint Type: {ownerData[0]}</p>
            <p>Incident Details: {ownerData[1]}</p>
            <p>Name: {ownerData[2]}</p>
            <p>Contact Address: {ownerData[3]}</p>
            <p>City, State, Zip: {ownerData[4]}</p>
            <p>Contact: {ownerData[5]}</p>
            <p>Email: {ownerData[6]}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
