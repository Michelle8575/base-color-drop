// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BaseColorDrop {
    mapping(address => uint8) public latestColor;
    mapping(address => uint256) public userDrops;
    mapping(uint8 => uint256) public colorCounts;
    uint256 public totalDrops;

    event ColorDropped(address indexed user, uint8 color, uint256 userDrops, uint256 totalDrops);

    function dropColor(uint8 color) external {
        require(color < 5, "Invalid color");

        latestColor[msg.sender] = color;

        unchecked {
            userDrops[msg.sender] += 1;
            colorCounts[color] += 1;
            totalDrops += 1;
        }

        emit ColorDropped(msg.sender, color, userDrops[msg.sender], totalDrops);
    }
}
