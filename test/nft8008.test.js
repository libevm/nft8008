const { expect } = require("chai");
const { parseUnits } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

const fs = require("fs");

describe("NFT8008", function () {
  it("Works", async function () {
    const NFT8008 = await ethers.getContractFactory("Nft8008");
    const nft8008Temp = await NFT8008.deploy({ gasLimit: 8000000 });
    const txRecp = await nft8008Temp
      .deployed()
      .then((x) => x.deployTransaction.wait());

    const nft8008 = await ethers.getContractAt("Nft8008", nft8008Temp.address);
    const clock8008 = await ethers.getContractAt(
      "Clock8008",
      "0xf2470e641a551D7Dbdf4B8D064Cf208edfB06586"
    );

    await clock8008.mint(3205, { value: parseUnits("0.1") });
    await nft8008.mintWithClock8008(3205);

    // await nft8008.mintWithClock8008(3204);

    const beforeBal = await ethers.provider.getBalance(nft8008.address);
    await nft8008.mint(809, { value: parseUnits("0.1") });
    const afterBal = await ethers.provider.getBalance(nft8008.address);
    expect(afterBal.gt(beforeBal)).to.be.true;

    const jsonDump = await nft8008.tokenURI(3205);
    const base64JsonDump = jsonDump.split(",").slice(1).join(",");
    const jsonMetadata = JSON.parse(
      Buffer.from(base64JsonDump, "base64").toString()
    );
    const imageDump = jsonMetadata.image.split(",").slice(1).join(",");
    const svgData = Buffer.from(imageDump, "base64").toString();

    console.log(jsonMetadata);
    fs.writeFileSync("/tmp/dump.svg", svgData);
  });
});
