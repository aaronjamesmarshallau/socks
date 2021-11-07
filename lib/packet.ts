/**
 * A packet of data sent or received by a `Server` or `Client`.
 */
export class Packet {
  private data: Uint8Array;

  private constructor(data?: Uint8Array) {
    this.data = data ?? new Uint8Array();
  }

  /**
   * Get the length of the packet's data.
   */
  public length() {
    return this.data.length;
  }

  /**
   * Get the underlying string for this packet's data using the provided decoder.
   * @param decoder The `TextDecoder` implementation to use to decode the data.
   */
  public toString(decoder: TextDecoder): string {
    return decoder.decode(this.data);
  }

  /**
   * Get the underlying data for this packet.
   */
  public toByteArray(): Uint8Array {
    return this.data;
  }

  /**
   * Construct a new `Packet` from the provided string and encoder.
   * @param data The string to convert.
   * @param encoder The encoder to use to encode the string.
   */
  public static fromPacket(packet: Packet): Packet {
    return new Packet(packet.data)
  }

  /**
   * Construct a new `Packet` from the provided buffer array.
   * @param data The buffer array to use.
   */
  public static fromBuffer(data?: Uint8Array): Packet {
    return new Packet(data);
  }

  /**
   * Construct a new `Packet` from the provided string and encoder.
   * @param data The string to use.
   * @param encoder The `TextEncoder` implementation to use to encode the string.
   */
  public static fromString(encoder: TextEncoder, data?: string): Packet {
    return new Packet(encoder.encode(data))
  }
}
