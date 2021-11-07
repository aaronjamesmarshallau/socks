import { assertEquals } from "https://deno.land/std@0.113.0/testing/asserts.ts";
import { ServerEvents } from "./events/server-events.ts";
import { MockConnection } from "./mocks/mock-connection.ts";
import { Server } from "./server.ts";

class MockListener implements Deno.Listener {
	public addr: Deno.Addr;
	public rid: number;

	constructor() {
		this.addr = {
			hostname: "localhost",
			port: 8080,
			transport: "tcp",
		};
		this.rid = 1;
	}

	accept(): Promise<Deno.Conn> {
		throw new Error("Method not implemented.");
	}
	close(): void {
		throw new Error("Method not implemented.");
	}
	[Symbol.asyncIterator](): AsyncIterableIterator<Deno.Conn> {
		const asyncFunkie = async function* () {
			yield new MockConnection();
		};

		return asyncFunkie();
	}

}

Deno.test({
	name: "Server emits listen upon listen",
	fn: () => {
		const mockListener = new MockListener();
		const typedAddr = mockListener.addr as Deno.NetAddr;
		const server = new Server({
				...typedAddr,
				transport: "tcp",
			},
			() => mockListener
		);

		let eventCallTimes = 0;
		server.on(ServerEvents.listen, () => {
			eventCallTimes++;
		});

		server.listen();

		assertEquals(
			eventCallTimes,
			1,
			"Server listen event is called multiple times.",
		);
	}
});

Deno.test({
	name: "Server emits client connect event",
	fn: async () => {
		const mockListener = new MockListener();
		const typedAddr = mockListener.addr as Deno.NetAddr;
		const server = new Server({
				...typedAddr,
				transport: "tcp",
			},
			() => mockListener
		);

		const promise = new Promise((res, rej) => {
			const timeout = setTimeout(() => {
				rej(new Error("Client connect event not called by server."));
			}, 500);

			server.on(ServerEvents.connect, () => {
				clearTimeout(timeout);
				res(undefined);
			});
		});

		server.listen();

		await promise;
	}
})
