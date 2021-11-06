import { EventKey } from './event-emitter.ts';

/**
 * Abstract implementation of a client-based event.
 */
export abstract class ClientEvent implements EventKey {
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
	constructor() {
		super("close");
	}
}

/**
 * Event fired when a client receives a packet.
 */
class ReceiveEvent extends ClientEvent {
	constructor() {
		super("receive");
	}
}

/**
 * Client-based events.
 */
export class ClientEvents {
	public static readonly close: ClientEvent = new CloseEvent();
	public static readonly receive: ClientEvent = new ReceiveEvent();
}
