import { ClientEvent, ClientEvents } from './events/client-events.ts';
import { EventEmitter } from './events/event-emitter.ts';
import { iterateReader } from 'https://deno.land/std@0.113.0/streams/conversion.ts';
import { Packet } from './packet.ts';

export class Client extends EventEmitter<ClientEvent> {
	constructor(
		private conn?: Deno.Reader & Deno.Closer & Deno.Writer
	) {
		super();
	}

	public isOpen(): boolean {
		return this.conn !== undefined;
	}

	public close(): void {
		if (this.conn !== undefined) {
			this.conn.close();
			this.conn = undefined;
			this.emit(ClientEvents.close)
		}
	}

	public async receive(): Promise<void> {
		if (this.conn === undefined) {
			return;
		}

		for await (const buffer of iterateReader(this.conn, { bufSize: 1024 })) {
			this.emit(ClientEvents.receive, Packet.fromBuffer(buffer))
		}

		this.close();
	}

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
