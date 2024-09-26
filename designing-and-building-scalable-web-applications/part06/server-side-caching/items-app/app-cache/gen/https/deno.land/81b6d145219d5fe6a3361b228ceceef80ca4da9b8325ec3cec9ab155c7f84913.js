// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
import { deferred } from "../async/mod.ts";
import { assert, assertStringIncludes, fail } from "../testing/asserts.ts";
import { readAll } from "../streams/conversion.ts";
export function notImplemented(msg) {
  const message = msg ? `Not implemented: ${msg}` : "Not implemented";
  throw new Error(message);
}
export function warnNotImplemented(msg) {
  const message = msg ? `Not implemented: ${msg}` : "Not implemented";
  console.warn(message);
}
export const _TextDecoder = TextDecoder;
export const _TextEncoder = TextEncoder;
export function intoCallbackAPI(// deno-lint-ignore no-explicit-any
func, cb, // deno-lint-ignore no-explicit-any
...args) {
  func(...args).then((value)=>cb && cb(null, value), (err)=>cb && cb(err));
}
export function intoCallbackAPIWithIntercept(// deno-lint-ignore no-explicit-any
func, interceptor, cb, // deno-lint-ignore no-explicit-any
...args) {
  func(...args).then((value)=>cb && cb(null, interceptor(value)), (err)=>cb && cb(err));
}
export function spliceOne(list, index) {
  for(; index + 1 < list.length; index++)list[index] = list[index + 1];
  list.pop();
}
// Taken from: https://github.com/nodejs/node/blob/ba684805b6c0eded76e5cd89ee00328ac7a59365/lib/internal/util.js#L125
// Return undefined if there is no match.
// Move the "slow cases" to a separate function to make sure this function gets
// inlined properly. That prioritizes the common case.
export function normalizeEncoding(enc) {
  if (enc == null || enc === "utf8" || enc === "utf-8") return "utf8";
  return slowCases(enc);
}
// https://github.com/nodejs/node/blob/ba684805b6c0eded76e5cd89ee00328ac7a59365/lib/internal/util.js#L130
function slowCases(enc) {
  switch(enc.length){
    case 4:
      if (enc === "UTF8") return "utf8";
      if (enc === "ucs2" || enc === "UCS2") return "utf16le";
      enc = `${enc}`.toLowerCase();
      if (enc === "utf8") return "utf8";
      if (enc === "ucs2") return "utf16le";
      break;
    case 3:
      if (enc === "hex" || enc === "HEX" || `${enc}`.toLowerCase() === "hex") {
        return "hex";
      }
      break;
    case 5:
      if (enc === "ascii") return "ascii";
      if (enc === "ucs-2") return "utf16le";
      if (enc === "UTF-8") return "utf8";
      if (enc === "ASCII") return "ascii";
      if (enc === "UCS-2") return "utf16le";
      enc = `${enc}`.toLowerCase();
      if (enc === "utf-8") return "utf8";
      if (enc === "ascii") return "ascii";
      if (enc === "ucs-2") return "utf16le";
      break;
    case 6:
      if (enc === "base64") return "base64";
      if (enc === "latin1" || enc === "binary") return "latin1";
      if (enc === "BASE64") return "base64";
      if (enc === "LATIN1" || enc === "BINARY") return "latin1";
      enc = `${enc}`.toLowerCase();
      if (enc === "base64") return "base64";
      if (enc === "latin1" || enc === "binary") return "latin1";
      break;
    case 7:
      if (enc === "utf16le" || enc === "UTF16LE" || `${enc}`.toLowerCase() === "utf16le") {
        return "utf16le";
      }
      break;
    case 8:
      if (enc === "utf-16le" || enc === "UTF-16LE" || `${enc}`.toLowerCase() === "utf-16le") {
        return "utf16le";
      }
      break;
    default:
      if (enc === "") return "utf8";
  }
}
export function validateIntegerRange(value, name, min = -2147483648, max = 2147483647) {
  // The defaults for min and max correspond to the limits of 32-bit integers.
  if (!Number.isInteger(value)) {
    throw new Error(`${name} must be 'an integer' but was ${value}`);
  }
  if (value < min || value > max) {
    throw new Error(`${name} must be >= ${min} && <= ${max}. Value was ${value}`);
  }
}
export function once(callback) {
  let called = false;
  return function(...args) {
    if (called) return;
    called = true;
    callback.apply(this, args);
  };
}
/**
 * @param {number} [expectedExecutions = 1]
 * @param {number} [timeout = 1000] Milliseconds to wait before the promise is forcefully exited */ export function mustCall(fn = ()=>{}, expectedExecutions = 1, timeout = 1000) {
  if (expectedExecutions < 1) {
    throw new Error("Expected executions can't be lower than 1");
  }
  let timesExecuted = 0;
  const completed = deferred();
  const abort = setTimeout(()=>completed.reject(), timeout);
  function callback(...args) {
    timesExecuted++;
    if (timesExecuted === expectedExecutions) {
      completed.resolve();
    }
    fn.apply(this, args);
  }
  const result = completed.then(()=>clearTimeout(abort)).catch(()=>fail(`Async operation not completed: Expected ${expectedExecutions}, executed ${timesExecuted}`));
  return [
    result,
    callback
  ];
}
/** Asserts that an error thrown in a callback will not be wrongly caught. */ export async function assertCallbackErrorUncaught({ prelude, invocation, cleanup }) {
  // Since the error has to be uncaught, and that will kill the Deno process,
  // the only way to test this is to spawn a subprocess.
  const p = Deno.run({
    cmd: [
      Deno.execPath(),
      "eval",
      "--no-check",
      "--unstable",
      `${prelude ?? ""}

      ${invocation}(err) => {
        // If the bug is present and the callback is called again with an error,
        // don't throw another error, so if the subprocess fails we know it had the correct behaviour.
        if (!err) throw new Error("success");
      });`
    ],
    stderr: "piped"
  });
  const status = await p.status();
  const stderr = new TextDecoder().decode(await readAll(p.stderr));
  p.close();
  p.stderr.close();
  await cleanup?.();
  assert(!status.success);
  assertStringIncludes(stderr, "Error: success");
}
export function makeMethodsEnumerable(klass) {
  const proto = klass.prototype;
  for (const key of Object.getOwnPropertyNames(proto)){
    const value = proto[key];
    if (typeof value === "function") {
      const desc = Reflect.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        desc.enumerable = true;
        Object.defineProperty(proto, key, desc);
      }
    }
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjEzMi4wL25vZGUvX3V0aWxzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDE4LTIwMjIgdGhlIERlbm8gYXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG5pbXBvcnQgeyBkZWZlcnJlZCB9IGZyb20gXCIuLi9hc3luYy9tb2QudHNcIjtcbmltcG9ydCB7IGFzc2VydCwgYXNzZXJ0U3RyaW5nSW5jbHVkZXMsIGZhaWwgfSBmcm9tIFwiLi4vdGVzdGluZy9hc3NlcnRzLnRzXCI7XG5pbXBvcnQgeyByZWFkQWxsIH0gZnJvbSBcIi4uL3N0cmVhbXMvY29udmVyc2lvbi50c1wiO1xuXG5leHBvcnQgdHlwZSBCaW5hcnlFbmNvZGluZ3MgPSBcImJpbmFyeVwiO1xuXG5leHBvcnQgdHlwZSBUZXh0RW5jb2RpbmdzID1cbiAgfCBcImFzY2lpXCJcbiAgfCBcInV0ZjhcIlxuICB8IFwidXRmLThcIlxuICB8IFwidXRmMTZsZVwiXG4gIHwgXCJ1Y3MyXCJcbiAgfCBcInVjcy0yXCJcbiAgfCBcImJhc2U2NFwiXG4gIHwgXCJsYXRpbjFcIlxuICB8IFwiaGV4XCI7XG5cbmV4cG9ydCB0eXBlIEVuY29kaW5ncyA9IEJpbmFyeUVuY29kaW5ncyB8IFRleHRFbmNvZGluZ3M7XG5cbmV4cG9ydCBmdW5jdGlvbiBub3RJbXBsZW1lbnRlZChtc2c/OiBzdHJpbmcpOiBuZXZlciB7XG4gIGNvbnN0IG1lc3NhZ2UgPSBtc2cgPyBgTm90IGltcGxlbWVudGVkOiAke21zZ31gIDogXCJOb3QgaW1wbGVtZW50ZWRcIjtcbiAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2Fybk5vdEltcGxlbWVudGVkKG1zZz86IHN0cmluZyk6IHZvaWQge1xuICBjb25zdCBtZXNzYWdlID0gbXNnID8gYE5vdCBpbXBsZW1lbnRlZDogJHttc2d9YCA6IFwiTm90IGltcGxlbWVudGVkXCI7XG4gIGNvbnNvbGUud2FybihtZXNzYWdlKTtcbn1cblxuZXhwb3J0IHR5cGUgX1RleHREZWNvZGVyID0gdHlwZW9mIFRleHREZWNvZGVyLnByb3RvdHlwZTtcbmV4cG9ydCBjb25zdCBfVGV4dERlY29kZXIgPSBUZXh0RGVjb2RlcjtcblxuZXhwb3J0IHR5cGUgX1RleHRFbmNvZGVyID0gdHlwZW9mIFRleHRFbmNvZGVyLnByb3RvdHlwZTtcbmV4cG9ydCBjb25zdCBfVGV4dEVuY29kZXIgPSBUZXh0RW5jb2RlcjtcblxuLy8gQVBJIGhlbHBlcnNcblxuZXhwb3J0IHR5cGUgTWF5YmVOdWxsPFQ+ID0gVCB8IG51bGw7XG5leHBvcnQgdHlwZSBNYXliZURlZmluZWQ8VD4gPSBUIHwgdW5kZWZpbmVkO1xuZXhwb3J0IHR5cGUgTWF5YmVFbXB0eTxUPiA9IFQgfCBudWxsIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgZnVuY3Rpb24gaW50b0NhbGxiYWNrQVBJPFQ+KFxuICAvLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuICBmdW5jOiAoLi4uYXJnczogYW55W10pID0+IFByb21pc2U8VD4sXG4gIGNiOiBNYXliZUVtcHR5PChlcnI6IE1heWJlTnVsbDxFcnJvcj4sIHZhbHVlPzogTWF5YmVFbXB0eTxUPikgPT4gdm9pZD4sXG4gIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG4gIC4uLmFyZ3M6IGFueVtdXG4pOiB2b2lkIHtcbiAgZnVuYyguLi5hcmdzKS50aGVuKFxuICAgICh2YWx1ZSkgPT4gY2IgJiYgY2IobnVsbCwgdmFsdWUpLFxuICAgIChlcnIpID0+IGNiICYmIGNiKGVyciksXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnRvQ2FsbGJhY2tBUElXaXRoSW50ZXJjZXB0PFQxLCBUMj4oXG4gIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG4gIGZ1bmM6ICguLi5hcmdzOiBhbnlbXSkgPT4gUHJvbWlzZTxUMT4sXG4gIGludGVyY2VwdG9yOiAodjogVDEpID0+IFQyLFxuICBjYjogTWF5YmVFbXB0eTwoZXJyOiBNYXliZU51bGw8RXJyb3I+LCB2YWx1ZT86IE1heWJlRW1wdHk8VDI+KSA9PiB2b2lkPixcbiAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgLi4uYXJnczogYW55W11cbik6IHZvaWQge1xuICBmdW5jKC4uLmFyZ3MpLnRoZW4oXG4gICAgKHZhbHVlKSA9PiBjYiAmJiBjYihudWxsLCBpbnRlcmNlcHRvcih2YWx1ZSkpLFxuICAgIChlcnIpID0+IGNiICYmIGNiKGVyciksXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGxpY2VPbmUobGlzdDogc3RyaW5nW10sIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgZm9yICg7IGluZGV4ICsgMSA8IGxpc3QubGVuZ3RoOyBpbmRleCsrKSBsaXN0W2luZGV4XSA9IGxpc3RbaW5kZXggKyAxXTtcbiAgbGlzdC5wb3AoKTtcbn1cblxuLy8gVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL2Jsb2IvYmE2ODQ4MDViNmMwZWRlZDc2ZTVjZDg5ZWUwMDMyOGFjN2E1OTM2NS9saWIvaW50ZXJuYWwvdXRpbC5qcyNMMTI1XG4vLyBSZXR1cm4gdW5kZWZpbmVkIGlmIHRoZXJlIGlzIG5vIG1hdGNoLlxuLy8gTW92ZSB0aGUgXCJzbG93IGNhc2VzXCIgdG8gYSBzZXBhcmF0ZSBmdW5jdGlvbiB0byBtYWtlIHN1cmUgdGhpcyBmdW5jdGlvbiBnZXRzXG4vLyBpbmxpbmVkIHByb3Blcmx5LiBUaGF0IHByaW9yaXRpemVzIHRoZSBjb21tb24gY2FzZS5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVFbmNvZGluZyhcbiAgZW5jOiBzdHJpbmcgfCBudWxsLFxuKTogVGV4dEVuY29kaW5ncyB8IHVuZGVmaW5lZCB7XG4gIGlmIChlbmMgPT0gbnVsbCB8fCBlbmMgPT09IFwidXRmOFwiIHx8IGVuYyA9PT0gXCJ1dGYtOFwiKSByZXR1cm4gXCJ1dGY4XCI7XG4gIHJldHVybiBzbG93Q2FzZXMoZW5jKTtcbn1cblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL2Jsb2IvYmE2ODQ4MDViNmMwZWRlZDc2ZTVjZDg5ZWUwMDMyOGFjN2E1OTM2NS9saWIvaW50ZXJuYWwvdXRpbC5qcyNMMTMwXG5mdW5jdGlvbiBzbG93Q2FzZXMoZW5jOiBzdHJpbmcpOiBUZXh0RW5jb2RpbmdzIHwgdW5kZWZpbmVkIHtcbiAgc3dpdGNoIChlbmMubGVuZ3RoKSB7XG4gICAgY2FzZSA0OlxuICAgICAgaWYgKGVuYyA9PT0gXCJVVEY4XCIpIHJldHVybiBcInV0ZjhcIjtcbiAgICAgIGlmIChlbmMgPT09IFwidWNzMlwiIHx8IGVuYyA9PT0gXCJVQ1MyXCIpIHJldHVybiBcInV0ZjE2bGVcIjtcbiAgICAgIGVuYyA9IGAke2VuY31gLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoZW5jID09PSBcInV0ZjhcIikgcmV0dXJuIFwidXRmOFwiO1xuICAgICAgaWYgKGVuYyA9PT0gXCJ1Y3MyXCIpIHJldHVybiBcInV0ZjE2bGVcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMzpcbiAgICAgIGlmIChlbmMgPT09IFwiaGV4XCIgfHwgZW5jID09PSBcIkhFWFwiIHx8IGAke2VuY31gLnRvTG93ZXJDYXNlKCkgPT09IFwiaGV4XCIpIHtcbiAgICAgICAgcmV0dXJuIFwiaGV4XCI7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIDU6XG4gICAgICBpZiAoZW5jID09PSBcImFzY2lpXCIpIHJldHVybiBcImFzY2lpXCI7XG4gICAgICBpZiAoZW5jID09PSBcInVjcy0yXCIpIHJldHVybiBcInV0ZjE2bGVcIjtcbiAgICAgIGlmIChlbmMgPT09IFwiVVRGLThcIikgcmV0dXJuIFwidXRmOFwiO1xuICAgICAgaWYgKGVuYyA9PT0gXCJBU0NJSVwiKSByZXR1cm4gXCJhc2NpaVwiO1xuICAgICAgaWYgKGVuYyA9PT0gXCJVQ1MtMlwiKSByZXR1cm4gXCJ1dGYxNmxlXCI7XG4gICAgICBlbmMgPSBgJHtlbmN9YC50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKGVuYyA9PT0gXCJ1dGYtOFwiKSByZXR1cm4gXCJ1dGY4XCI7XG4gICAgICBpZiAoZW5jID09PSBcImFzY2lpXCIpIHJldHVybiBcImFzY2lpXCI7XG4gICAgICBpZiAoZW5jID09PSBcInVjcy0yXCIpIHJldHVybiBcInV0ZjE2bGVcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgNjpcbiAgICAgIGlmIChlbmMgPT09IFwiYmFzZTY0XCIpIHJldHVybiBcImJhc2U2NFwiO1xuICAgICAgaWYgKGVuYyA9PT0gXCJsYXRpbjFcIiB8fCBlbmMgPT09IFwiYmluYXJ5XCIpIHJldHVybiBcImxhdGluMVwiO1xuICAgICAgaWYgKGVuYyA9PT0gXCJCQVNFNjRcIikgcmV0dXJuIFwiYmFzZTY0XCI7XG4gICAgICBpZiAoZW5jID09PSBcIkxBVElOMVwiIHx8IGVuYyA9PT0gXCJCSU5BUllcIikgcmV0dXJuIFwibGF0aW4xXCI7XG4gICAgICBlbmMgPSBgJHtlbmN9YC50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKGVuYyA9PT0gXCJiYXNlNjRcIikgcmV0dXJuIFwiYmFzZTY0XCI7XG4gICAgICBpZiAoZW5jID09PSBcImxhdGluMVwiIHx8IGVuYyA9PT0gXCJiaW5hcnlcIikgcmV0dXJuIFwibGF0aW4xXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDc6XG4gICAgICBpZiAoXG4gICAgICAgIGVuYyA9PT0gXCJ1dGYxNmxlXCIgfHxcbiAgICAgICAgZW5jID09PSBcIlVURjE2TEVcIiB8fFxuICAgICAgICBgJHtlbmN9YC50b0xvd2VyQ2FzZSgpID09PSBcInV0ZjE2bGVcIlxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBcInV0ZjE2bGVcIjtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgODpcbiAgICAgIGlmIChcbiAgICAgICAgZW5jID09PSBcInV0Zi0xNmxlXCIgfHxcbiAgICAgICAgZW5jID09PSBcIlVURi0xNkxFXCIgfHxcbiAgICAgICAgYCR7ZW5jfWAudG9Mb3dlckNhc2UoKSA9PT0gXCJ1dGYtMTZsZVwiXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIFwidXRmMTZsZVwiO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChlbmMgPT09IFwiXCIpIHJldHVybiBcInV0ZjhcIjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVJbnRlZ2VyUmFuZ2UoXG4gIHZhbHVlOiBudW1iZXIsXG4gIG5hbWU6IHN0cmluZyxcbiAgbWluID0gLTIxNDc0ODM2NDgsXG4gIG1heCA9IDIxNDc0ODM2NDcsXG4pOiB2b2lkIHtcbiAgLy8gVGhlIGRlZmF1bHRzIGZvciBtaW4gYW5kIG1heCBjb3JyZXNwb25kIHRvIHRoZSBsaW1pdHMgb2YgMzItYml0IGludGVnZXJzLlxuICBpZiAoIU51bWJlci5pc0ludGVnZXIodmFsdWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke25hbWV9IG11c3QgYmUgJ2FuIGludGVnZXInIGJ1dCB3YXMgJHt2YWx1ZX1gKTtcbiAgfVxuXG4gIGlmICh2YWx1ZSA8IG1pbiB8fCB2YWx1ZSA+IG1heCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGAke25hbWV9IG11c3QgYmUgPj0gJHttaW59ICYmIDw9ICR7bWF4fS4gVmFsdWUgd2FzICR7dmFsdWV9YCxcbiAgICApO1xuICB9XG59XG5cbnR5cGUgT3B0aW9uYWxTcHJlYWQ8VD4gPSBUIGV4dGVuZHMgdW5kZWZpbmVkID8gW11cbiAgOiBbVF07XG5cbmV4cG9ydCBmdW5jdGlvbiBvbmNlPFQgPSB1bmRlZmluZWQ+KFxuICBjYWxsYmFjazogKC4uLmFyZ3M6IE9wdGlvbmFsU3ByZWFkPFQ+KSA9PiB2b2lkLFxuKSB7XG4gIGxldCBjYWxsZWQgPSBmYWxzZTtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGlzOiB1bmtub3duLCAuLi5hcmdzOiBPcHRpb25hbFNwcmVhZDxUPikge1xuICAgIGlmIChjYWxsZWQpIHJldHVybjtcbiAgICBjYWxsZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZXhwZWN0ZWRFeGVjdXRpb25zID0gMV1cbiAqIEBwYXJhbSB7bnVtYmVyfSBbdGltZW91dCA9IDEwMDBdIE1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSB0aGUgcHJvbWlzZSBpcyBmb3JjZWZ1bGx5IGV4aXRlZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG11c3RDYWxsPFQgZXh0ZW5kcyB1bmtub3duW10+KFxuICBmbjogKCguLi5hcmdzOiBUKSA9PiB2b2lkKSA9ICgpID0+IHt9LFxuICBleHBlY3RlZEV4ZWN1dGlvbnMgPSAxLFxuICB0aW1lb3V0ID0gMTAwMCxcbik6IFtQcm9taXNlPHZvaWQ+LCAoLi4uYXJnczogVCkgPT4gdm9pZF0ge1xuICBpZiAoZXhwZWN0ZWRFeGVjdXRpb25zIDwgMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIGV4ZWN1dGlvbnMgY2FuJ3QgYmUgbG93ZXIgdGhhbiAxXCIpO1xuICB9XG4gIGxldCB0aW1lc0V4ZWN1dGVkID0gMDtcbiAgY29uc3QgY29tcGxldGVkID0gZGVmZXJyZWQoKTtcblxuICBjb25zdCBhYm9ydCA9IHNldFRpbWVvdXQoKCkgPT4gY29tcGxldGVkLnJlamVjdCgpLCB0aW1lb3V0KTtcblxuICBmdW5jdGlvbiBjYWxsYmFjayh0aGlzOiB1bmtub3duLCAuLi5hcmdzOiBUKSB7XG4gICAgdGltZXNFeGVjdXRlZCsrO1xuICAgIGlmICh0aW1lc0V4ZWN1dGVkID09PSBleHBlY3RlZEV4ZWN1dGlvbnMpIHtcbiAgICAgIGNvbXBsZXRlZC5yZXNvbHZlKCk7XG4gICAgfVxuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0ID0gY29tcGxldGVkXG4gICAgLnRoZW4oKCkgPT4gY2xlYXJUaW1lb3V0KGFib3J0KSlcbiAgICAuY2F0Y2goKCkgPT5cbiAgICAgIGZhaWwoXG4gICAgICAgIGBBc3luYyBvcGVyYXRpb24gbm90IGNvbXBsZXRlZDogRXhwZWN0ZWQgJHtleHBlY3RlZEV4ZWN1dGlvbnN9LCBleGVjdXRlZCAke3RpbWVzRXhlY3V0ZWR9YCxcbiAgICAgIClcbiAgICApO1xuXG4gIHJldHVybiBbXG4gICAgcmVzdWx0LFxuICAgIGNhbGxiYWNrLFxuICBdO1xufVxuLyoqIEFzc2VydHMgdGhhdCBhbiBlcnJvciB0aHJvd24gaW4gYSBjYWxsYmFjayB3aWxsIG5vdCBiZSB3cm9uZ2x5IGNhdWdodC4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhc3NlcnRDYWxsYmFja0Vycm9yVW5jYXVnaHQoXG4gIHsgcHJlbHVkZSwgaW52b2NhdGlvbiwgY2xlYW51cCB9OiB7XG4gICAgLyoqIEFueSBjb2RlIHdoaWNoIG5lZWRzIHRvIHJ1biBiZWZvcmUgdGhlIGFjdHVhbCBpbnZvY2F0aW9uIChub3RhYmx5LCBhbnkgaW1wb3J0IHN0YXRlbWVudHMpLiAqL1xuICAgIHByZWx1ZGU/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogVGhlIHN0YXJ0IG9mIHRoZSBpbnZvY2F0aW9uIG9mIHRoZSBmdW5jdGlvbiwgZS5nLiBgb3BlbihcImZvby50eHRcIiwgYC5cbiAgICAgKiBUaGUgY2FsbGJhY2sgd2lsbCBiZSBhZGRlZCBhZnRlciBpdC5cbiAgICAgKi9cbiAgICBpbnZvY2F0aW9uOiBzdHJpbmc7XG4gICAgLyoqIENhbGxlZCBhZnRlciB0aGUgc3VicHJvY2VzcyBpcyBmaW5pc2hlZCBidXQgYmVmb3JlIHJ1bm5pbmcgdGhlIGFzc2VydGlvbnMsIGUuZy4gdG8gY2xlYW4gdXAgY3JlYXRlZCBmaWxlcy4gKi9cbiAgICBjbGVhbnVwPzogKCkgPT4gUHJvbWlzZTx2b2lkPiB8IHZvaWQ7XG4gIH0sXG4pIHtcbiAgLy8gU2luY2UgdGhlIGVycm9yIGhhcyB0byBiZSB1bmNhdWdodCwgYW5kIHRoYXQgd2lsbCBraWxsIHRoZSBEZW5vIHByb2Nlc3MsXG4gIC8vIHRoZSBvbmx5IHdheSB0byB0ZXN0IHRoaXMgaXMgdG8gc3Bhd24gYSBzdWJwcm9jZXNzLlxuICBjb25zdCBwID0gRGVuby5ydW4oe1xuICAgIGNtZDogW1xuICAgICAgRGVuby5leGVjUGF0aCgpLFxuICAgICAgXCJldmFsXCIsXG4gICAgICBcIi0tbm8tY2hlY2tcIiwgLy8gUnVubmluZyBUU0MgZm9yIGV2ZXJ5IG9uZSBvZiB0aGVzZSB0ZXN0cyB3b3VsZCB0YWtlIHdheSB0b28gbG9uZ1xuICAgICAgXCItLXVuc3RhYmxlXCIsXG4gICAgICBgJHtwcmVsdWRlID8/IFwiXCJ9XG5cbiAgICAgICR7aW52b2NhdGlvbn0oZXJyKSA9PiB7XG4gICAgICAgIC8vIElmIHRoZSBidWcgaXMgcHJlc2VudCBhbmQgdGhlIGNhbGxiYWNrIGlzIGNhbGxlZCBhZ2FpbiB3aXRoIGFuIGVycm9yLFxuICAgICAgICAvLyBkb24ndCB0aHJvdyBhbm90aGVyIGVycm9yLCBzbyBpZiB0aGUgc3VicHJvY2VzcyBmYWlscyB3ZSBrbm93IGl0IGhhZCB0aGUgY29ycmVjdCBiZWhhdmlvdXIuXG4gICAgICAgIGlmICghZXJyKSB0aHJvdyBuZXcgRXJyb3IoXCJzdWNjZXNzXCIpO1xuICAgICAgfSk7YCxcbiAgICBdLFxuICAgIHN0ZGVycjogXCJwaXBlZFwiLFxuICB9KTtcbiAgY29uc3Qgc3RhdHVzID0gYXdhaXQgcC5zdGF0dXMoKTtcbiAgY29uc3Qgc3RkZXJyID0gbmV3IFRleHREZWNvZGVyKCkuZGVjb2RlKGF3YWl0IHJlYWRBbGwocC5zdGRlcnIpKTtcbiAgcC5jbG9zZSgpO1xuICBwLnN0ZGVyci5jbG9zZSgpO1xuICBhd2FpdCBjbGVhbnVwPy4oKTtcbiAgYXNzZXJ0KCFzdGF0dXMuc3VjY2Vzcyk7XG4gIGFzc2VydFN0cmluZ0luY2x1ZGVzKHN0ZGVyciwgXCJFcnJvcjogc3VjY2Vzc1wiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VNZXRob2RzRW51bWVyYWJsZShrbGFzczogeyBuZXcgKCk6IHVua25vd24gfSk6IHZvaWQge1xuICBjb25zdCBwcm90byA9IGtsYXNzLnByb3RvdHlwZTtcbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocHJvdG8pKSB7XG4gICAgY29uc3QgdmFsdWUgPSBwcm90b1trZXldO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgY29uc3QgZGVzYyA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBrZXkpO1xuICAgICAgaWYgKGRlc2MpIHtcbiAgICAgICAgZGVzYy5lbnVtZXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBrZXksIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDBFQUEwRTtBQUMxRSxTQUFTLFFBQVEsUUFBUSxrQkFBa0I7QUFDM0MsU0FBUyxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxRQUFRLHdCQUF3QjtBQUMzRSxTQUFTLE9BQU8sUUFBUSwyQkFBMkI7QUFpQm5ELE9BQU8sU0FBUyxlQUFlLEdBQVk7RUFDekMsTUFBTSxVQUFVLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsR0FBRztFQUNsRCxNQUFNLElBQUksTUFBTTtBQUNsQjtBQUVBLE9BQU8sU0FBUyxtQkFBbUIsR0FBWTtFQUM3QyxNQUFNLFVBQVUsTUFBTSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxHQUFHO0VBQ2xELFFBQVEsSUFBSSxDQUFDO0FBQ2Y7QUFHQSxPQUFPLE1BQU0sZUFBZSxZQUFZO0FBR3hDLE9BQU8sTUFBTSxlQUFlLFlBQVk7QUFReEMsT0FBTyxTQUFTLGdCQUNkLG1DQUFtQztBQUNuQyxJQUFvQyxFQUNwQyxFQUFzRSxF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