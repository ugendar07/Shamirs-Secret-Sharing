const SecretSharing = artifacts.require("./SecretSharing");
 
module.exports = function(deployer) {
  deployer.deploy(SecretSharing);
};