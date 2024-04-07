import type { Room } from './room'
import { Observable } from './observer'
import type { PeerData, PeerInstance, PeerSignalData } from './simple-peer'
import { Peer } from './simple-peer'

// eslint-disable-next-line ts/consistent-type-definitions
type WebRTCCoonEvents = {
  message: (data: PeerData) => void
  connect: () => void
  close: () => void
}

export class WebRTCConn extends Observable<WebRTCCoonEvents> {
  static New = (room: Room, initiator: boolean, remotePeerId: string) => {
    const webRTCCoon = room.webRTCConns.get(remotePeerId) || new WebRTCConn(room, initiator, remotePeerId)
    room.webRTCConns.set(remotePeerId, webRTCCoon)
    return webRTCCoon
  }

  room: Room
  peer: PeerInstance
  remotePeerId: string
  glareToken: number | undefined
  constructor(
    room: Room,
    initiator: boolean,
    remotePeerId: string,
  ) {
    super()
    this.room = room
    this.remotePeerId = remotePeerId

    const peer = this.peer = new Peer({
      initiator,
    })

    peer.on('connect', this.#handlePeerConnect)
    peer.on('signal', this.#handlePeerSignal)
    peer.on('close', this.#handlePeerClose)
    peer.on('data', this.#handlePeerData)
  }

  get connected() {
    return this.peer.connected
  }

  async send(data: PeerData) {
    try {
      console.log('send data by p2p', { from: this.room.peerId, to: this.remotePeerId, data })
      this.peer.send(data)
    } catch {}
  }

  #handlePeerData = (data: PeerData) => {
    this.room.miniWebRTC.emit('message', data)
  }

  resetGlareToken() {
    this.glareToken = undefined
  }

  #handlePeerSignal = (signal: PeerSignalData) => {
    if (this.glareToken === undefined)
      this.glareToken = Date.now() + Math.random()

    this.room.publishSignal({
      from: this.room.peerId,
      to: this.remotePeerId,
      token: this.glareToken,
      signal,
    })
  }

  #handlePeerConnect = () => {
    this.emit('connect')
  }

  #handlePeerClose = () => {
    this.emit('close')

    this.destroy()
  }

  destroy(): void {
    this.room.webRTCConns.has(this.remotePeerId) && this.room.webRTCConns.delete(this.remotePeerId)
    this.peer.destroy()
    super.destroy()
    this.room.resubscribe()
  }
}
