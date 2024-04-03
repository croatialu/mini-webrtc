import type {
  SimplePeerData as PeerData,
  Instance as PeerInstance,
  Options as PeerOptions,
  SignalData as PeerSignalData,
  SimplePeer,
} from 'simple-peer'

export type {
  PeerSignalData,
  PeerInstance,
  PeerOptions,
  PeerData,
  SimplePeer,
}

export interface WSSubscribePayload {
  type: 'subscribe'
  topics: string[]
}

export interface WSPublishPayload<Data = any> {
  type: 'publish'
  topic: string
  data: Data
}

export interface WSSignalPayload {
  type: 'signal'
  signal: PeerSignalData
  from: string
  to: string
  token: number
}

export interface WSAnnouncePayload {
  type: 'announce'
  from: string
}
