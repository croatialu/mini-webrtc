# mini-webrtc

WIP...

## Install

## Usage

### Run signaling server

download, and run [server.js](https://github.com/yjs/y-webrtc/blob/master/bin/server.js)

### Setup

```ts
import { MiniWebRTC } from 'mini-webrtc'

const miniWebRTC = new MiniWebRTC(
  'room-name',
  {
    signalingUrl: 'ws://xxx',
  }
)
```
