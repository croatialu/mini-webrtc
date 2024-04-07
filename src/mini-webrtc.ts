import { Observable } from './observer'
import { Room } from './room'
import { SignalingConn } from './signaling-conn'
import type { PeerData } from './simple-peer'
import { Peer } from './simple-peer'

interface MiniWebRTCOptions {
  signalingUrl: string
  webSocketConstructor?: WebSocket
}

export class MiniWebRTC extends Observable<{ message: (data: PeerData) => void }> {
  static get config() {
    return Peer.config
  }

  static set config(config) {
    Peer.config = config
  }

  static get channelConfig() {
    return Peer.channelConfig
  }

  static set channelConfig(config) {
    Peer.channelConfig = config
  }

  static get WEBRTC_SUPPORT() {
    return Peer.WEBRTC_SUPPORT
  }

  room: Room
  signalingConn?: SignalingConn
  constructor(roomName: string, { signalingUrl, webSocketConstructor }: MiniWebRTCOptions) {
    super()
    this.room = Room.New(this, roomName)

    this.room.awaitLeadership().then(() => {
      this.signalingConn = SignalingConn.New(signalingUrl, webSocketConstructor)
    })
  }

  send(data: PeerData) {
    this.room.send(data)
  }

  destroy(): void {
    this.room.destroy()
    this.signalingConn?.destroy()
  }
}
