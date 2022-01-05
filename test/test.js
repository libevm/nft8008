const { expect } = require("chai");
const { parseUnits } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

const fs = require('fs')

describe("Watch", function () {
  it("Deployable", async function () {
    const Clock8008 = await ethers.getContractFactory("Clock8008");
    const clock = await Clock8008.deploy();
    await clock.deployed().then(x => x.deployTransaction.wait())

    await clock.mint(1, { value: parseUnits("0.1") });
    await clock.ownerClaim(8008);

    const jsonDump = await clock.tokenURI(8008)
    const base64JsonDump = jsonDump.split(',').slice(1).join(',')
    const jsonMetadata = JSON.parse(Buffer.from(base64JsonDump, 'base64').toString())
    const imageDump = jsonMetadata.image.split(',').slice(1).join(',')
    const svgData = Buffer.from(imageDump, 'base64').toString()

    console.log(jsonMetadata)
    fs.writeFileSync('/tmp/dump.svg', svgData)
  });
});
