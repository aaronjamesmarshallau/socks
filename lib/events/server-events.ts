import { EventKey } from './event-emitter.ts';

/**
 * Abstract implementation of a server-based event.
 */
export abstract class ServerEvent implements EventKey {
  constructor(
    private key: string,
  ) {
	}

  public asString(): string {
		return this.key;
	}
}

/**
 * Event fired when a server begins listening on a port.
 */
class ListenEvent extends ServerEvent {
	constructor() {
		super('listen');
	}
}

/**
 * Event fired when a client connected to the server.
 */
class ConnectEvent extends ServerEvent {
	constructor() {
		super('connect');
	}
}

/**
 * Event fired when a server shutdown occurs.
 */
class ShutdownEvent extends ServerEvent {
	constructor() {
		super('shutdown');
	}
}

/**
 * Event fired when a server encounters anerror.
 */
class ErrorEvent extends ServerEvent {
	constructor() {
		super('error');
	}
}

/**
 * Server-based events.
 */
export class ServerEvents {
	public static readonly listen: ServerEvent = new ListenEvent();
	public static readonly connect: ServerEvent = new ConnectEvent();
	public static readonly shutdown: ServerEvent = new ShutdownEvent();
	public static readonly error: ServerEvent = new ErrorEvent();
}
