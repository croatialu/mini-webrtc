import { Observable } from './observer'
import { Room } from './room'
import { SignalingConn } from './signaling-conn'
import type { PeerData } from './types'

interface MiniWebRTCOptions {
  signalingUrl: string
  webSocketConstructor?: WebSocket
}

export class MiniWebRTC extends Observable<{ message: (data: PeerData) => void }> {
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
