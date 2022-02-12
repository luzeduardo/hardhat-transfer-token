pragma solidity ^0.7.0;

contract Token {
    string public name = "Hard Token";
    string public symbol = "ht";

    uint256 public totalSupply = 1000000;
    address public owner;

    //storing each balanceon HashMap structure
    mapping (address => uint256) balances;

    //contract init, only when created
    constructor() {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    // external modifier makes a function only callable from outside the contract
    function transfer(address to, uint256 amount) external {
        //check if sender has enought tokens
        require(balances[msg.sender] >= amount, "Not enought tokens!");

        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

}