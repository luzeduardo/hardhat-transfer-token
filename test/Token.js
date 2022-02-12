const { expect } = require('chai');

describe("Token contract", function() {
  let Token;
  let hardToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // ethers available in global scope
    //ContractFactory an abstraction  to deploy new Contracts
    Token = await ethers.getContractFactory("Token");
    // Signer represents an Ethereum account
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    hardToken = await Token.deploy();
  });

  describe("Deployment", function () {
    it("Deploy should apply the total supply tokens to the owner", async () => {
      //once the Contract is deployed we can call Contract methods on hardToken
      const ownerBalance = await hardToken.balanceOf(owner.address);
      expect(await hardToken.totalSupply()).to.equal(ownerBalance);
    });

    it("right owner", async () => {
      expect(await hardToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async () => {
      const ownerBalance = await hardToken.balanceOf(owner.address);
      const totalSupply = await hardToken.totalSupply();
      expect(totalSupply).to.equal(ownerBalance); 
    });
  });
});

describe("Transactions", function() {
  it("Should transfer tokens between accounts", async function() {
    const [owner, address1, address2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    const hardToken = await Token.deploy();

    await hardToken.transfer(address1.address, 50);
    expect(await hardToken.balanceOf(address1.address)).to.equal(50);

    await hardToken.connect(address1).transfer(address2.address, 50);
    expect(await hardToken.balanceOf(address2.address)).to.equal(50);
    expect(await hardToken.balanceOf(address1.address)).to.equal(0);
  });
});