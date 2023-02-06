/**
 * @module Process
 */
import { primordials, send } from './ipc.js'
import { EventEmitter } from './events.js'

let didEmitExitEvent = false

class Process extends EventEmitter {
  arch = primordials.arch
  argv = globalThis.__args?.argv ?? []
  argv0 = globalThis.__args?.argv?.[0] ?? null
  config = globalThis.__args?.config ?? {}
  cwd = () => primordials.cwd
  env = globalThis.__args?.env ?? {}
  exit = exit
  homedir = homedir
  platform = primordials.platform
  version = globalThis.__args?.version ?? ''
}

const isNode = Boolean(globalThis.process?.versions?.node)
const process = isNode
  ? globalThis.process
  : new Process()

if (!isNode) {
  EventEmitter.call(process)
}

export default process

/**
 * @returns {string} The home directory of the current user.
 */
export function homedir () {
  return window.__args.env.HOME ?? ''
}

/**
 * @param {number=} [code=0] - The exit code. Default: 0.
 */
export function exit (code) {
  if (!didEmitExitEvent) {
    didEmitExitEvent = true
    queueMicrotask(() => process.emit('exit', code))
    send('exit', { value: code ?? 0 })
  }
}
