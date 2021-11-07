import { assertEquals } from 'https://deno.land/std@0.113.0/testing/asserts.ts';
import { EventEmitter, EventKey } from './event-emitter.ts';

class MockEmitterKey implements EventKey {
	asString(): string {
		return 'mock';
	}
}

class MockEmitter extends EventEmitter<MockEmitterKey> {
}

Deno.test({
	name: 'Listener can be added to event emitter',
	fn: () => {
		const emitter = new MockEmitter();
		const key = new MockEmitterKey();
		let fired = false;

		emitter.on(key, () => {
			fired = true;
		});
		emitter.emit(key);

		assertEquals(fired, true, 'Listener was not fired on event emit');
  }
});


Deno.test({
	name: 'Multiple listeners can be emitted to',
	fn: () => {
		const emitter = new MockEmitter();
		const key = new MockEmitterKey();
		const firedEvents: number[] = [];

		emitter.on(key, () => {
			firedEvents.push(1);
		});
		emitter.on(key, () => {
			firedEvents.push(2);
		});
		emitter.emit(key);

		assertEquals(firedEvents.length, 2, 'Not all listeners were fired on event emit')
		assertEquals(firedEvents[0], 1, 'First listener added was not fired on event emit');
		assertEquals(firedEvents[1], 2, 'Second listener added was not fired on event emit');
  }
});
