import type { Instance, Options, SignalData, SimplePeer, SimplePeerData } from 'simple-peer'
// @ts-expect-error type error
import _Peer from 'simple-peer/simplepeer.min.js'

export type {
  SignalData as PeerSignalData,
  SimplePeer,
  Options as PeerOptions,
  SimplePeerData as PeerData,
  Instance as PeerInstance,
}

export const Peer = _Peer as SimplePeer
