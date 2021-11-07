import { ClientEvent, ClientEvents } from './events/client-events.ts';
import { EventEmitter } from './events/event-emitter.ts';
import { iterateReader } from 'https://deno.land/std@0.113.0/streams/conversion.ts';
import { Packet } from './packet.ts';

/**
 * Represents the server view of a client connection.
 */
export class Client extends EventEmitter<ClientEvent> {
	/**
	 * Instantiate a new instance of the `Client` class.
	 * @param conn The connection that this `Client` wraps.
	 */
	constructor(
		private conn?: Deno.Reader & Deno.Closer & Deno.Writer
	) {
		super();
	}

	/**
	 * Check if this `Client` is connected.
	 * @returns True if we have an underlying connection, otherwise false.
	 */
	public isOpen(): boolean {
		return this.conn !== undefined;
	}

	/**
	 * Close this client's connection.
	 */
	public close(): void {
		if (this.conn !== undefined) {
			this.conn.close();
			this.conn = undefined;
			this.emit(ClientEvents.close)
		}
	}

	/**
	 * Begin receiving data from the given client.
	 * @returns A promise that will resolve when the client connection is closed.
	 */
	public async receive(): Promise<void> {
		if (this.conn === undefined) {
			return;
		}

		for await (const buffer of iterateReader(this.conn, { bufSize: 1024 })) {
			this.emit(ClientEvents.receive, Packet.fromBuffer(buffer))
		}

		this.close();
	}

	/**
	 * Sends data to the client.
	 * @param data The data to write to the client.
	 * @returns A promise that will resolve when the data is successfully written.
	 */
	public async write(data: Uint8Array | string | Packet): Promise<number> {
		if (this.conn === undefined) {
			return 0;
		}

		if (data instanceof Uint8Array) {
			return await this.conn.write(data);
		}

		if (typeof data === 'string') {
			const textEncoder = new TextEncoder();

			return await this.conn.write(textEncoder.encode(data));
		}

		if (data instanceof Packet) {
			return await this.conn.write(data.toByteArray());
		}

		return 0;
	}
}
