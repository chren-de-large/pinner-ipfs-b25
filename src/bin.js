#!/usr/bin/env node

'use strict'
var MSGS = [];
const IPFS = require('ipfs');
const PUBSUB_CHANNEL = 'client-ipfs-b25';
const ipfsRepo = './ipfs-chat';
const ipfsOptions = {
  repo: ipfsRepo,
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Bootstrap: [
      "/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd",
      "/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3",
      "/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM",
      "/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu",
      "/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm",
      "/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64"
    ],
    Addresses: {
      Swarm: [
        '/dns4/libp2p-signaling.herokuapp.com/tcp/443/wss/p2p-websocket-star/'
        // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star/'
        // Use local signal server
        // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
      ]
    }
  }
};
const node = new IPFS(ipfsOptions);
node.on('ready', async () => {
  const version = await node.version()
  console.log('Version:', version.version)
  node.pubsub.subscribe(PUBSUB_CHANNEL, (encodedMsg) => {
    const data = JSON.parse(encodedMsg.data.toString());
    if (data.ev === 'message') {
      saveMsg(data);
    }
    if (data.ev === 'getAllMessage') {
      const msg = {
        ev: 'prevMessage',
        msgs: MSGS
      }
      const msgEncoded = node.types.Buffer.from(JSON.stringify(msg));
      node.pubsub.publish(PUBSUB_CHANNEL, msgEncoded);
      console.warn('send getAllMessage');
    }
  });
});

function saveMsg(d) {
  MSGS.push(d);
  if (MSGS.length > 10) MSHS.pop();
}