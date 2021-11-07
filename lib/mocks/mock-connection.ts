import randomBytes from 'https://deno.land/std@0.113.0/node/_crypto/randomBytes.ts';
import { Buffer } from 'https://deno.land/std@0.113.0/io/buffer.ts';

export class MockConnection implements Deno.Conn {
	private iteration = 0;
	private bufferArray = new Uint8Array(0);
	private data = new Buffer(this.bufferArray);
	private throwAfter?: number = undefined;
	private stopAfter: number;

	public localAddr: Deno.Addr;
	public remoteAddr: Deno.Addr;
	public rid: number;

	constructor(throwAfter?: number, stopAfter: number = 5) {
		this.localAddr = {
			hostname: "localhost",
			port: 47000,
			transport: "tcp",
		};

		this.remoteAddr = {
			hostname: "localhost",
			port: 47000,
			transport: "tcp",
		};

		this.rid = 10;

		this.throwAfter = throwAfter;
		this.stopAfter = stopAfter;
	}

	closeWrite(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	close(): void {

	}

	read(p: Uint8Array): Promise<number|null> {
		this.iteration++;

		if (this.stopAfter !== undefined && this.iteration > this.stopAfter) {
			return Promise.resolve(null);
		}

		const bytes = randomBytes(p.byteLength);
		p.set(bytes);

		if (this.throwAfter !== undefined && this.iteration > this.throwAfter) {
			throw new Error("blah");
		}

		return Promise.resolve(bytes.length);
	}

	write(p: Uint8Array): Promise<number> {
		return this.data.write(p);
	}

	public getBuffer(): Buffer {
		return this.data;
	}
}
