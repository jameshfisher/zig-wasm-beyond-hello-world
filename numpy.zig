const std = @import("std");

// FIXME alloc/free requires a "ctx", but what is it?! It appears to be ignored.
var ctx: u32 = 42;

// Allocate array of `numFloats` floats.
// Return byte index into linear memory where array starts, or 0 on failure.
export fn alloc(numFloats: u32) u32 {
    const maybe_ptr = std.heap.WasmAllocator.vtable.alloc(
        &ctx,
        numFloats * @sizeOf(f32),
        @alignOf(f32),
        0,
    );
    if (maybe_ptr) |ptr| {
        return @ptrToInt(ptr);
    } else {
        return 0;
    }
}

// Must also provide `numFloats`, because it's demanded by Zig allocator free().
// JS should call this when finished with the array; using a FinalizationRegistry is recommended.
export fn free(startByteIndex: u32, numFloats: u32) void {
    const byte_ptr: [*]u8 = @intToPtr([*]u8, startByteIndex);
    std.heap.WasmAllocator.vtable.free(
        &ctx,
        byte_ptr[0 .. numFloats * @sizeOf(f32)],
        @alignOf(f32),
        0,
    );
}

export fn sum(startByteIndex: u32, numFloats: u32) f32 {
    const float_ptr = @intToPtr([*]f32, startByteIndex);
    var total: f32 = 0;
    for (float_ptr[0..numFloats]) |b| {
        total += b;
    }
    return total;
}
