// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract VarUpdate{
  // Variable de estado
    string public greet = "Hello World!";

    // Debe enviar una transacción para escribir en una variable de estado.
    function set(string memory _greet) public {
        greet = _greet;
    }

    // Puede leer desde una variable de estado sin enviar una transacción.
    function get() public view returns (string memory) {
        return greet;
    }
    
}
