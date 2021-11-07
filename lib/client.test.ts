import { assertEquals } from "https://deno.land/std@0.113.0/testing/asserts.ts";
import { Client } from './client.ts';
import { Packet } from './packet.ts';
import { MockConnection } from './mocks/mock-connection.ts';
import { ClientEvents } from "./events/client-events.ts";

Deno.test({
	name: "Client receive failures are handled",
	fn: async () => {
		const mockConn = new MockConnection(5);
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
	},
});

Deno.test({
	name: 'Client emits receive event on data',
	fn: async () => {
		const connection = new MockConnection(undefined, 5);
		const client = new Client(connection);

		const promise = new Promise((res, rej) => {
			const timeout = setTimeout(() => {
				rej(new Error("No data received before timeout."));
			}, 500);

			client.on(ClientEvents.receive, (_data: Packet) => {
				clearTimeout(timeout);
				res(undefined);
			});
		});

		await Promise.all([
			client.receive(),
			promise,
		]);
	},
});
