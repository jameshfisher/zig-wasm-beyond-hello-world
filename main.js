import { Arr } from "./numpy.js";

// A stupid way to calculate 0+1+2+3+...+(n-1).
function sumOfZeroUpTo(n) {
  const arr = new Arr(n);

  // Initialize the array using JS.
  // Exercise: do this in WASM instead.
  for (let i = 0; i < n; i++) {
    arr.view[i] = i;
  }

  // This should be fast, using WASM.
  console.log(`Sum of 0..${n} is:`, arr.sum());

  // arr now goes out of scope. It will eventually be GC'd.
}

// Run forever. If it ever stops, it's a bug.
while (true) {
  sumOfZeroUpTo(Math.floor(Math.random() * 10000000));

  // This encourages occasional GC runs ...
  await new Promise(resolve => setTimeout(resolve, 0));
}
