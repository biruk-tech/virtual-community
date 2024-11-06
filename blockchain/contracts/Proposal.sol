// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Proposal {
    struct ProposalData {
        uint id;
        string title;
        string description;
        address creator;
        bool isActive;
        uint voteCount;
    }

    mapping(uint => ProposalData) public proposals;
    uint public proposalCount;

    function createProposal(string memory _title, string memory _description, uint _voteCount) public {
        proposalCount++;
        proposals[proposalCount] = ProposalData(proposalCount, _title, _description, msg.sender, true, _voteCount);
    }

    // Additional functions for voting, closing proposals, etc.
}
