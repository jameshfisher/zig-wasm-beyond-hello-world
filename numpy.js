// A module that's supposed to be a bit like numpy.
// An Arr represents a contiguous array of floats.
// Provides efficient .sum() etc.
// Backed by WebAssembly memory.
// Memory is owned by the Arr object in JS: it's freed when the JS object is GC'd.

// This import uses https://nodejs.org/api/esm.html#wasm-modules
// Alternatively, use the traditional API:
// https://developer.mozilla.org/en-US/docs/WebAssembly/Loading_and_running#using_fetch
import * as wasmModule from "./numpy.wasm";

const { memory, alloc, free, sum } = wasmModule;

const registry = new FinalizationRegistry(({ startByteIndex, numFloats }) => {
  console.log(`Freeing ${numFloats} floats at ${startByteIndex}`);
  free(startByteIndex, numFloats);
});

export class Arr {
  constructor(numFloats) {
    const startByteIndex = alloc(numFloats);
    if (this.startByteIndex === 0) {
      throw new Error("Allocation failure");
    } else {
      // console.log("startByteIndex", startByteIndex);
      this.numFloats = numFloats;
      this.startByteIndex = startByteIndex;
      this.view = new Float32Array(memory.buffer, startByteIndex, numFloats);
      registry.register(this, { startByteIndex, numFloats });
    }
  }
  sum() {
    return sum(this.startByteIndex, this.numFloats);
  }
}
