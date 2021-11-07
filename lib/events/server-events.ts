import { EventKey } from './event-emitter.ts';

/**
 * Abstract implementation of a server-based event.
 */
export abstract class ServerEvent implements EventKey {
	/**
	 * Instantiates the base class data for this `ServerEvent`.
	 * @param key The string data that this event is represented by.
	 */
  constructor(
    private key: string,
  ) {
	}

	/** @inheritdoc */
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
	/**
	 * Event fired when a server begins listening on a port.
	 */
	public static readonly listen: ServerEvent = new ListenEvent();

	/**
	 * Event fired when a client connected to the server.
	 */
	public static readonly connect: ServerEvent = new ConnectEvent();

	/**
	 * Event fired when a server shutdown occurs.
	 */
	public static readonly shutdown: ServerEvent = new ShutdownEvent();

	/**
	 * Event fired when a server encounters anerror.
	 */
	public static readonly error: ServerEvent = new ErrorEvent();
}
