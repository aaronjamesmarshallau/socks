import { Client } from './client.ts';
import { ClientEvents } from "./events/client-events.ts";
import { EventEmitter } from './events/event-emitter.ts';
import { ServerEvent, ServerEvents } from './events/server-events.ts';

export class Server extends EventEmitter<ServerEvent> {
	constructor(
		public options: Deno.ConnectOptions
	) {
		super();
	}

	/**
	 * Start listening to the provided port for client connections.
	 */
	public async listen(): Promise<void> {
		const server = Deno.listen(this.options);
		const clients: Array<Client> = [];

		this.emit(ServerEvents.listen);

		for await(const conn of server) {
			const client = new Client(conn);
			clients.push(client);

			this.emit(ServerEvents.connect, client);

			client.receive()
				.catch((err: Error) => this.emit(ServerEvents.error, err));

			client.on(ClientEvents.close, () => {
				this.closeClient(client);

				const clientIndex = clients.indexOf(client);

				if (clientIndex >= 0) {
					clients.splice(clientIndex, 1);
				}
			});
		}

		await Promise.resolve();
	}

	closeClient(client: Client): Promise<void> {
		if (client.isOpen()) {
			try {
				client.close();
				return Promise.resolve();
			} catch (err) {
				return Promise.reject(err);
			}
		}

		return Promise.resolve();
	}
}
