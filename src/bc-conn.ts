import type { LeaderElector } from 'broadcast-channel'
import { BroadcastChannel, createLeaderElection } from 'broadcast-channel'
import { Observable } from './observer'
import type { PeerData } from './simple-peer'

// eslint-disable-next-line ts/consistent-type-definitions
type BCConnEvents = {
  message: (data: PeerData) => void
  leader: () => void
}

export class BCConn extends Observable<BCConnEvents> {
  #channel: BroadcastChannel
  #elector: LeaderElector

  constructor(
    roomName: string,
  ) {
    super()
    const channel = this.#channel = new BroadcastChannel(roomName)
    const elector = this.#elector = createLeaderElection(channel)

    channel.addEventListener('message', this.#handleMessage)

    elector.awaitLeadership().then(() => {
      this.emit('leader')
    })
  }

  awaitLeadership() {
    return this.#elector.awaitLeadership()
  }

  async isLeader() {
    await this.#elector.hasLeader()
    return this.#elector.isLeader
  }

  #handleMessage = (data: PeerData) => {
    this.emit('message', data)
  }

  async send(data: PeerData) {
    await this.#elector.hasLeader()

    console.log('send data by bc', data)
    this.#channel.postMessage(
      data,
    )
  }

  destroy(): void {
    this.#channel.close()
    this.#elector.die()

    super.destroy()
  }
}
