const { expect } = require("chai");
const { parseUnits } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

const fs = require("fs");

describe("Clock", function () {
  it("Works", async function () {
    const Clock8008 = await ethers.getContractFactory("Clock8008");
    const clock = await Clock8008.deploy({ gasLimit: 8000000 });
    const txRecp = await clock.deployed().then((x) => x.deployTransaction.wait());

    await clock.mint(1, { value: parseUnits("0.1") });
    await clock.ownerClaim(8008);

    const jsonDump = await clock.tokenURI(101);
    const base64JsonDump = jsonDump.split(",").slice(1).join(",");
    const jsonMetadata = JSON.parse(
      Buffer.from(base64JsonDump, "base64").toString()
    );
    const imageDump = jsonMetadata.image.split(",").slice(1).join(",");
    const svgData = Buffer.from(imageDump, "base64").toString();

    const [user, other] = await ethers.getSigners();

    const beforeBal = await ethers.provider.getBalance(user.address);
    await clock.withdrawETH(user.address);
    const afterBal = await ethers.provider.getBalance(user.address);

    expect(afterBal.gt(beforeBal)).to.be.true;

    await clock.mint(2, { value: parseUnits("0.1") });
    await clock
      .connect(other)
      .withdrawETH(user.address)
      .then(() => {
        throw new Error("Oops");
      }).catch(() => {});

    // console.log(jsonMetadata);
    fs.writeFileSync("/tmp/dump.svg", svgData);
  });
});
