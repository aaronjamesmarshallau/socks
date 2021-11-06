import { assertEquals } from "https://deno.land/std@0.113.0/testing/asserts.ts";
import randomBytes from 'https://deno.land/std@0.113.0/node/_crypto/randomBytes.ts';
import { Buffer } from 'https://deno.land/std@0.113.0/io/buffer.ts';
import { Client } from './client.ts';
import { Packet } from './packet.ts';

class MockConnection implements Deno.Reader, Deno.Closer, Deno.Writer {
	private iteration = 0;
	private bufferArray = new Uint8Array(0);
	private data = new Buffer(this.bufferArray);

	close(): void {
		throw new Error("Method not implemented.");
	}

	read(p: Uint8Array): Promise<number|null> {
		this.iteration++;
		const bytes = randomBytes(p.byteLength);
		p.set(bytes);

		if (this.iteration > 5) {
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

Deno.test({
	name: "Client receive failures are handled",
	fn: async () => {
		const mockConn = new MockConnection();
		const client = new Client(mockConn);

		await client.receive()
			.catch((_err) => {});
	}
});

Deno.test({
	name: "Client successfully writes string data",
	fn: async () => {
		const mockConn = new MockConnection();
		const client = new Client(mockConn);
		const test = "test";

		await client.write(test);

		const textEncoder = new TextEncoder();
		const testByteArray = textEncoder.encode(test);
		const buffer = mockConn.getBuffer();

		assertEquals(
			buffer.bytes(),
			testByteArray
		);
	}
});

Deno.test({
	name: "Client successfully writes Packet data",
	fn: async () => {
		const mockConn = new MockConnection();
		const client = new Client(mockConn);
		const packet = Packet.fromString(new TextEncoder(), "test");

		await client.write(packet);

		assertEquals(
			mockConn.getBuffer().bytes(),
			packet.toByteArray()
		);
	}
});

Deno.test({
	name: "Client successfully writes byte data",
	fn: async () => {
		const mockConn = new MockConnection();
		const client = new Client(mockConn);
		const textEncoder = new TextEncoder();
		const byteArray = textEncoder.encode("test");

		await client.write(byteArray);

		assertEquals(
			mockConn.getBuffer().bytes(),
			byteArray
		);
	}
});

Deno.test({
	name: "Client with null conn won't throw when written to",
	fn: async () => {
		const client = new Client(undefined);
		await client.write("test");
	}
})
