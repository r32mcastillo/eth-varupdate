const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Actualizar variable",()=>{
  it("update",async ()=>{
    const msg      = "nuevo mensaje";
    const contract = await ethers.getContractFactory("VarUpdate");
    const deployed = await contract.deploy();
    await deployed.set(msg);
    const newmsg   = await deployed.get();
    console.log('====================================');
    console.log(newmsg);
    console.log('====================================');
    expect(msg).to.equal(newmsg);
  });
});