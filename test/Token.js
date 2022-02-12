const { expect } = require('chai');

describe("Token contract", () => {
  let Token;
  let hardToken;
  let owner;
  let address1;
  let address2;
  let addrs;

  beforeEach(async () => {
    // ethers available in global scope
    //ContractFactory an abstraction  to deploy new Contracts
    Token = await ethers.getContractFactory("Token");
    // Signer represents an Ethereum account
    [owner, address1, address2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    hardToken = await Token.deploy();
  });

  describe("Deployment", () => {
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

  describe("Transactions", () => {
    it("Should transfer tokens between accounts", async () => {
      await hardToken.transfer(address1.address, 50);
      expect(await hardToken.balanceOf(address1.address)).to.equal(50);

      await hardToken.connect(address1).transfer(address2.address, 50);
      expect(await hardToken.balanceOf(address2.address)).to.equal(50);
      expect(await hardToken.balanceOf(address1.address)).to.equal(0);
    });

    it("Should fail if sender doesn’t have enough tokens", async () => {
      //require will revert the transaction
      const initialOwnerBalance = await hardToken.balanceOf(owner.address);
      await expect(
        hardToken.connect(address1).transfer(owner.address, 25)
      ).to.be.revertedWith("Not enought tokens!");

      expect(await hardToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });
});
