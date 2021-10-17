var express = require('express');
var router = express.Router();
const Web3 = require('web3');
const { route } = require('./users');
var Users = require("../entities/users");
const EthrDID = require('ethr-did');
const DidJwtVc = require('did-jwt-vc');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/generate', (req, res, next) => {
  
  let web3 = new Web3();
  const account = web3.eth.accounts.create();
  console.log(account);

  const did = `did:ethr:${account.address}`
  const { privateKey } = account;

  res.json({
    did: did,
    privateKey: privateKey,
  });
});

router.post('/issue/employee', async (req, res, next) => {

  const { uid, company, location } = req.body;

  const issuerIdentity = {
    "did": "did:ethr:0x1D7B0974adefB20133c3240d4C8137d9eB13F0ba",
    "privateKey": "0x8b60993c7cdeee28fef241ff654165fb8783c099963898f00905d7a37c3cefc9"
  }

  let web3 = new Web3('https://ropsten.infura.io/v3/49ca993172774f6d8d7896fd77ce1e67');

  const newAccount = web3.eth.accounts.create();
  const generatedAccount = {
    did: `did:ethr:${newAccount.address}`,
    privateKey: newAccount.privateKey,
  }
  const account = web3.eth.accounts.wallet.add('0x8b60993c7cdeee28fef241ff654165fb8783c099963898f00905d7a37c3cefc9');

  const userEntity = new Users();

  const targetData = userEntity.getOneData(uid);

  const issuer = new EthrDID.EthrDID({
    identifier: issuerIdentity.did.split(':')[2],
    privateKey: issuerIdentity.privateKey
  })

  const vcPayload = {
    sub: `did:ethr:${newAccount.address}`,
    nbf: new Date(new Date().getTime() + 60 * 1000).toISOString(),
    vc: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      credentialSubject: targetData
    }
  }

  const vcJwt = await DidJwtVc.createVerifiableCredentialJwt(vcPayload, issuer);

  // const contractABI = require('../MyContract.json').abi;

  // const myContract = new web3.eth.Contract(contractABI, '0x039EE2036681eAf3A854E8521637F7a53AaEe9FA', {
  //   from: account.address, // default from address
  //   gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
  // });
  // let isSuccess = false;
  // const receipt = await myContract.methods.setEmployee(did.split(':')[2]).send({from: account.address, gas: 2000000});
  
  // if(receipt){
  //   isSuccess = true;
  //   console.log(receipt);
  // }
  
  res.json({
    status: true,
    data: {
      vc: vcJwt,
      identity: generatedAccount
    },
  })
});

router.get('/:did', async (req, res, next) => {
  const { did } = req.params;

  let web3 = new Web3('https://ropsten.infura.io/v3/49ca993172774f6d8d7896fd77ce1e67');
  const account = web3.eth.accounts.wallet.add('0x90a18a43404c1915b9fa93688092ed13c39a7106a82087194af60b6983855f6f');
  const contractABI = require('../MyContract.json').abi;
  const myContract = new web3.eth.Contract(contractABI, '0x039EE2036681eAf3A854E8521637F7a53AaEe9FA', {
    from: account.address, // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
  });
  let isSuccess = false;
  const isEmployee = await myContract.methods.isEmployee(did.split(':')[2]).call({from: account.address, gas: 2000000});

  if(isEmployee !== undefined) isSuccess=true;

  res.json({
    status: isSuccess,
    isEmployee: isEmployee
  })
})

module.exports = router;
