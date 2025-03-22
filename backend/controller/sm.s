// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentStorage {
    struct Document {
        string fileCID;
        string fileName;
        address owner;
    }

    mapping(address => Document[]) public userDocs;

    function storeDocument(string memory _fileCID, string memory _fileName) public {
        userDocs[msg.sender].push(Document(_fileCID, _fileName, msg.sender));
    }

    function getDocuments() public view returns (Document[] memory) {
        return userDocs[msg.sender];
    }
}
