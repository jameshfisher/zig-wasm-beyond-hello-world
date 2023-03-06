# Zig+WebAssembly: beyond hello world

A toy version of numpy in 100 lines of Zig and JavaScript.

Zig can compile to WebAssembly,
but [the only official example](https://ziglang.org/documentation/master/#WebAssembly)
is "adding two numbers"!
How do you do non-trivial things,
like memory management and passing pointers over the FFI?
This repository is an example.
It provides a JS library that's a bit like numpy.
You can allocate arrays,
and calculate things like their sum.
Arrays are never copied over the FFI.
The API is idiomatic JS, e.g. garbage collection works as normal.

To build it (but you can skip this step, since `numpy.wasm` is committed):

```sh
brew install zig --HEAD # Install zig 0.11.x+
npm run build
```

Then to run it:

```
npm run start
```

If it works, you'll get output like:

```
Sum of 0..3820884 is: 7301368381440
Sum of 0..506341 is: 128189562880
Freeing 506341 floats at 17891328
Freeing 3820884 floats at 1114112
...
```

## Implementation notes

- For the non-copy requirement,
  the JS->WASM calls must only ever pass pointers into memory.

- The memory allocator _could_ be written in JavaScript,
  but [Zig has a `WasmAllocator`](https://ziglang.org/documentation/master/std/#A;std:heap.WasmAllocator) designed for this.

- To GC these arrays when their owning JS objects die, we use a `FinalizationRegistry`.
