const { expect } = require("chai");
const { parseUnits } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Watch", function () {
  it("Deployable", async function () {
    const Clock8008 = await ethers.getContractFactory("Clock8008");
    const clock = await Clock8008.deploy();
    const txRecp = await clock.deployed().then(x => x.deployTransaction.wait())

    console.log(txRecp)

    await clock.mint(1, { value: parseUnits("0.1") });

    const gg = await clock.tokenURI(1)
    console.log('gg', gg)
  });
});
