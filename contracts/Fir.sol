// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract Fir {
    address private owner;
    struct FormData {
        string complaintType;
        string incidentDetails;
        string name;
        string contactAddress;
        string cityStateZip;
        string contact;
        string email;
    }
    mapping(address => FormData) private formDataMap;
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    constructor() {
        owner = msg.sender;
    }
    function setData(
        string memory _complaintType,
        string memory _incidentDetails,
        string memory _name,
        string memory _contactAddress,
        string memory _cityStateZip,
        string memory _contact,
        string memory _email
    ) public {
        FormData memory formData = FormData(
            _complaintType,
            _incidentDetails,
            _name,
            _contactAddress,
            _cityStateZip,
            _contact,
            _email
        );
        formDataMap[msg.sender] = formData;
    }
    function getData()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        FormData memory formData = formDataMap[msg.sender];
        return (
            formData.complaintType,
            formData.incidentDetails,
            formData.name,
            formData.contactAddress,
            formData.cityStateZip,
            formData.contact,
            formData.email
        );
    }
    function getDataByAddress(
        address _address
    )
        public
        view
        onlyOwner
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        FormData memory formData = formDataMap[_address];
        return (
            formData.complaintType,
            formData.incidentDetails,
            formData.name,
            formData.contactAddress,
            formData.cityStateZip,
            formData.contact,
            formData.email
        );
    }
}
