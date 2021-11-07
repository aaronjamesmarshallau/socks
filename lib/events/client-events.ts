import { EventKey } from './event-emitter.ts';

/**
 * Abstract implementation of a client-based event.
 */
export abstract class ClientEvent implements EventKey {
	/**
	 * Initialize the base properties for this `ClientEvent`
	 * @param key The string key to use.
	 */
  constructor(
    private key: string,
  ) {
	}

  public asString(): string {
		return this.key;
	}
}

/**
 * Event fired when a client closes a connection.
 */
class CloseEvent extends ClientEvent {
	/**
	 * Instantiate a new instance of `CloseEvent`.
	 */
	constructor() {
		super("close");
	}
}

/**
 * Event fired when a client receives a packet.
 */
class ReceiveEvent extends ClientEvent {
	/**
	 * Instantiate a new instance of `ReceiveEvent`.
	 */
	constructor() {
		super("receive");
	}
}

/**
 * Client-based events.
 */
export class ClientEvents {
	/**
	 * Event fired when a client closes a connection.
	 */
	public static readonly close: ClientEvent = new CloseEvent();

	/**
	 * Event fired when a client receives a packet.
	 */
	public static readonly receive: ClientEvent = new ReceiveEvent();
}
