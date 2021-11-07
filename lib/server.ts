import { Client } from './client.ts';
import { ClientEvents } from "./events/client-events.ts";
import { EventEmitter } from './events/event-emitter.ts';
import { ServerEvent, ServerEvents } from './events/server-events.ts';

export class Server extends EventEmitter<ServerEvent> {
	/**
	 * Constructor for creating a server. When consuming the Socks library, the
	 * `Server.create` function should be preferred.
	 * @param options The options for the server.
	 * @param listener The factory function for creating a `Deno.Listener` given
	 * some `Deno.ConnectOptions`.
	 */
	constructor(
		private options: Deno.ConnectOptions,
		private listener: (options: Deno.ConnectOptions & { transport?: "tcp" | undefined }) => Deno.Listener
	) {
		super();
	}

	/**
	 * Creates a TCP server with the given `Deno.ConnectOptions`.
	 * @param options The options for the server.
	 * @returns The newly created `Server` object.
	 */
	public static create(options: Deno.ConnectOptions): Server {
		return new Server(
			options,
			Deno.listen
		)
	}

	/**
	 * Start listening to the provided port for client connections.
	 */
	public async listen(): Promise<void> {
		const server = this.listener(this.options);
		const clients: Array<Client> = [];

		this.emit(ServerEvents.listen);

		for await(const conn of server) {
			const client = new Client(conn);
			clients.push(client);

			this.emit(ServerEvents.connect, client);

			// Receive events for this client, but do not block.
			client.receive()
				.catch((err: Error) => this.emit(ServerEvents.error, err));

			// When we get a close event for this client, finalise the client
			// correctly.
			client.on(ClientEvents.close, () => {
				this.closeClient(client);

				const clientIndex = clients.indexOf(client);

				if (clientIndex >= 0) {
					clients.splice(clientIndex, 1);
				}
			});
		}

		return Promise.resolve();
	}

	/**
	 * Close the given client's connection to the server from our side.
	 * @param client The client to close.
	 * @returns Promise of the function eventually finalizing.
	 */
	public closeClient(client: Client): Promise<void> {
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
