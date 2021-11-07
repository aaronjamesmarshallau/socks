/**
 * Strongly typed key class for the event emitter.
 */
export interface EventKey {
	/**
	 * Retrieve the string implementation of our `EventKey`
	 */
	asString(): string;
}

interface ListenerMap {
	[key: string]: Array<(args: any[]) => void>
}

/**
 * A dispatcher class for emitting and subscribing to events.
 */
export abstract class EventEmitter<T extends EventKey>  {
	private listeners: ListenerMap;

	/**
	 * Initialize the EventEmitter base class.
	 */
	constructor() {
		this.listeners = {};
	}

	/**
	 * Subscribe to the given event.
	 * @param key The event key to subscribe to.
	 * @param callback The callback to fire when the event is emitted.
	 */
	public on(key: T, callback: (...args: any[]) => void): void {
		if (this.listeners[key.asString()] === undefined) {
			this.listeners[key.asString()] = [];
		}

		this.listeners[key.asString()].push(callback);
	}

	/**
	 * Emits the given event to all subscribers.
	 * @param key The key of the event to emit.
	 * @param data The data (if any) to emit with the event.
	 */
	public emit(key: T, ...data: any[]): void {
		if (key.asString() in this.listeners) {
			const listeners = this.listeners[key.asString()];

			for (const listener of listeners) {
				listener(data);
			}
		}
	}
}
