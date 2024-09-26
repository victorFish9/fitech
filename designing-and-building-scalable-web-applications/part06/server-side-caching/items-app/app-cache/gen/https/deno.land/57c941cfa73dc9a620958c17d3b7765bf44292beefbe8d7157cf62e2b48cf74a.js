// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/** Returns the index of the first occurrence of the pattern array in the source
 * array, or -1 if it is not present. */ export function indexOf(source, pattern, fromIndex = 0) {
  if (fromIndex >= source.length) {
    return -1;
  }
  if (fromIndex < 0) {
    fromIndex = Math.max(0, source.length + fromIndex);
  }
  const s = pattern[0];
  for(let i = fromIndex; i < source.length; i++){
    if (source[i] !== s) continue;
    const pin = i;
    let matched = 1;
    let j = i;
    while(matched < pattern.length){
      j++;
      if (source[j] !== pattern[j - pin]) {
        break;
      }
      matched++;
    }
    if (matched === pattern.length) {
      return pin;
    }
  }
  return -1;
}
/** Find last index of binary pattern from source. If not found, then return -1.
 * @param source source array
 * @param pat pattern to find in source array
 * @param start the index to start looking in the source
 */ export function lastIndexOf(source, pat, start = source.length - 1) {
  if (start < 0) {
    return -1;
  }
  if (start >= source.length) {
    start = source.length - 1;
  }
  const e = pat[pat.length - 1];
  for(let i = start; i >= 0; i--){
    if (source[i] !== e) continue;
    const pin = i;
    let matched = 1;
    let j = i;
    while(matched < pat.length){
      j--;
      if (source[j] !== pat[pat.length - 1 - (pin - j)]) {
        break;
      }
      matched++;
    }
    if (matched === pat.length) {
      return pin - pat.length + 1;
    }
  }
  return -1;
}
/** Check whether binary array starts with prefix.
 * @param source source array
 * @param prefix prefix array to check in source
 */ export function startsWith(source, prefix) {
  for(let i = 0, max = prefix.length; i < max; i++){
    if (source[i] !== prefix[i]) return false;
  }
  return true;
}
/** Check whether binary array ends with suffix.
 * @param source source array
 * @param suffix suffix array to check in source
 */ export function endsWith(source, suffix) {
  for(let srci = source.length - 1, sfxi = suffix.length - 1; sfxi >= 0; srci--, sfxi--){
    if (source[srci] !== suffix[sfxi]) return false;
  }
  return true;
}
/** Repeat bytes. returns a new byte slice consisting of `count` copies of `b`.
 * @param origin The origin bytes
 * @param count The count you want to repeat.
 * @throws `RangeError` When count is negative
 */ export function repeat(origin, count) {
  if (count === 0) {
    return new Uint8Array();
  }
  if (count < 0) {
    throw new RangeError("bytes: negative repeat count");
  } else if (origin.length * count / count !== origin.length) {
    throw new Error("bytes: repeat count causes overflow");
  }
  const int = Math.floor(count);
  if (int !== count) {
    throw new Error("bytes: repeat count must be an integer");
  }
  const nb = new Uint8Array(origin.length * count);
  let bp = copy(origin, nb);
  for(; bp < nb.length; bp *= 2){
    copy(nb.slice(0, bp), nb, bp);
  }
  return nb;
}
/** Concatenate multiple binary arrays and return new one.
 * @param buf binary arrays to concatenate
 */ export function concat(...buf) {
  let length = 0;
  for (const b of buf){
    length += b.length;
  }
  const output = new Uint8Array(length);
  let index = 0;
  for (const b of buf){
    output.set(b, index);
    index += b.length;
  }
  return output;
}
/** Determines whether the source array includes the pattern array. */ export function includes(source, pattern, fromIndex = 0) {
  return indexOf(source, pattern, fromIndex) !== -1;
}
/**
 * Copy bytes from one Uint8Array to another.  Bytes from `src` which don't fit
 * into `dst` will not be copied.
 *
 * @param src Source byte array
 * @param dst Destination byte array
 * @param off Offset into `dst` at which to begin writing values from `src`.
 * @return number of bytes copied
 */ export function copy(src, dst, off = 0) {
  off = Math.max(0, Math.min(off, dst.byteLength));
  const dstBytesAvailable = dst.byteLength - off;
  if (src.byteLength > dstBytesAvailable) {
    src = src.subarray(0, dstBytesAvailable);
  }
  dst.set(src, off);
  return src.byteLength;
}
/** @deprecated */ export { includes as contains };
export { equals } from "./equals.ts";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjEzMi4wL2J5dGVzL21vZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIyIHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gVGhpcyBtb2R1bGUgaXMgYnJvd3NlciBjb21wYXRpYmxlLlxuXG4vKiogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgdGhlIHBhdHRlcm4gYXJyYXkgaW4gdGhlIHNvdXJjZVxuICogYXJyYXksIG9yIC0xIGlmIGl0IGlzIG5vdCBwcmVzZW50LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluZGV4T2YoXG4gIHNvdXJjZTogVWludDhBcnJheSxcbiAgcGF0dGVybjogVWludDhBcnJheSxcbiAgZnJvbUluZGV4ID0gMCxcbik6IG51bWJlciB7XG4gIGlmIChmcm9tSW5kZXggPj0gc291cmNlLmxlbmd0aCkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoZnJvbUluZGV4IDwgMCkge1xuICAgIGZyb21JbmRleCA9IE1hdGgubWF4KDAsIHNvdXJjZS5sZW5ndGggKyBmcm9tSW5kZXgpO1xuICB9XG4gIGNvbnN0IHMgPSBwYXR0ZXJuWzBdO1xuICBmb3IgKGxldCBpID0gZnJvbUluZGV4OyBpIDwgc291cmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHNvdXJjZVtpXSAhPT0gcykgY29udGludWU7XG4gICAgY29uc3QgcGluID0gaTtcbiAgICBsZXQgbWF0Y2hlZCA9IDE7XG4gICAgbGV0IGogPSBpO1xuICAgIHdoaWxlIChtYXRjaGVkIDwgcGF0dGVybi5sZW5ndGgpIHtcbiAgICAgIGorKztcbiAgICAgIGlmIChzb3VyY2Vbal0gIT09IHBhdHRlcm5baiAtIHBpbl0pIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBtYXRjaGVkKys7XG4gICAgfVxuICAgIGlmIChtYXRjaGVkID09PSBwYXR0ZXJuLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHBpbjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKiogRmluZCBsYXN0IGluZGV4IG9mIGJpbmFyeSBwYXR0ZXJuIGZyb20gc291cmNlLiBJZiBub3QgZm91bmQsIHRoZW4gcmV0dXJuIC0xLlxuICogQHBhcmFtIHNvdXJjZSBzb3VyY2UgYXJyYXlcbiAqIEBwYXJhbSBwYXQgcGF0dGVybiB0byBmaW5kIGluIHNvdXJjZSBhcnJheVxuICogQHBhcmFtIHN0YXJ0IHRoZSBpbmRleCB0byBzdGFydCBsb29raW5nIGluIHRoZSBzb3VyY2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxhc3RJbmRleE9mKFxuICBzb3VyY2U6IFVpbnQ4QXJyYXksXG4gIHBhdDogVWludDhBcnJheSxcbiAgc3RhcnQgPSBzb3VyY2UubGVuZ3RoIC0gMSxcbik6IG51bWJlciB7XG4gIGlmIChzdGFydCA8IDApIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgaWYgKHN0YXJ0ID49IHNvdXJjZS5sZW5ndGgpIHtcbiAgICBzdGFydCA9IHNvdXJjZS5sZW5ndGggLSAxO1xuICB9XG4gIGNvbnN0IGUgPSBwYXRbcGF0Lmxlbmd0aCAtIDFdO1xuICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKHNvdXJjZVtpXSAhPT0gZSkgY29udGludWU7XG4gICAgY29uc3QgcGluID0gaTtcbiAgICBsZXQgbWF0Y2hlZCA9IDE7XG4gICAgbGV0IGogPSBpO1xuICAgIHdoaWxlIChtYXRjaGVkIDwgcGF0Lmxlbmd0aCkge1xuICAgICAgai0tO1xuICAgICAgaWYgKHNvdXJjZVtqXSAhPT0gcGF0W3BhdC5sZW5ndGggLSAxIC0gKHBpbiAtIGopXSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG1hdGNoZWQrKztcbiAgICB9XG4gICAgaWYgKG1hdGNoZWQgPT09IHBhdC5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBwaW4gLSBwYXQubGVuZ3RoICsgMTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKiogQ2hlY2sgd2hldGhlciBiaW5hcnkgYXJyYXkgc3RhcnRzIHdpdGggcHJlZml4LlxuICogQHBhcmFtIHNvdXJjZSBzb3VyY2UgYXJyYXlcbiAqIEBwYXJhbSBwcmVmaXggcHJlZml4IGFycmF5IHRvIGNoZWNrIGluIHNvdXJjZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRzV2l0aChzb3VyY2U6IFVpbnQ4QXJyYXksIHByZWZpeDogVWludDhBcnJheSk6IGJvb2xlYW4ge1xuICBmb3IgKGxldCBpID0gMCwgbWF4ID0gcHJlZml4Lmxlbmd0aDsgaSA8IG1heDsgaSsrKSB7XG4gICAgaWYgKHNvdXJjZVtpXSAhPT0gcHJlZml4W2ldKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKiBDaGVjayB3aGV0aGVyIGJpbmFyeSBhcnJheSBlbmRzIHdpdGggc3VmZml4LlxuICogQHBhcmFtIHNvdXJjZSBzb3VyY2UgYXJyYXlcbiAqIEBwYXJhbSBzdWZmaXggc3VmZml4IGFycmF5IHRvIGNoZWNrIGluIHNvdXJjZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5kc1dpdGgoc291cmNlOiBVaW50OEFycmF5LCBzdWZmaXg6IFVpbnQ4QXJyYXkpOiBib29sZWFuIHtcbiAgZm9yIChcbiAgICBsZXQgc3JjaSA9IHNvdXJjZS5sZW5ndGggLSAxLCBzZnhpID0gc3VmZml4Lmxlbmd0aCAtIDE7XG4gICAgc2Z4aSA+PSAwO1xuICAgIHNyY2ktLSwgc2Z4aS0tXG4gICkge1xuICAgIGlmIChzb3VyY2Vbc3JjaV0gIT09IHN1ZmZpeFtzZnhpXSkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKiogUmVwZWF0IGJ5dGVzLiByZXR1cm5zIGEgbmV3IGJ5dGUgc2xpY2UgY29uc2lzdGluZyBvZiBgY291bnRgIGNvcGllcyBvZiBgYmAuXG4gKiBAcGFyYW0gb3JpZ2luIFRoZSBvcmlnaW4gYnl0ZXNcbiAqIEBwYXJhbSBjb3VudCBUaGUgY291bnQgeW91IHdhbnQgdG8gcmVwZWF0LlxuICogQHRocm93cyBgUmFuZ2VFcnJvcmAgV2hlbiBjb3VudCBpcyBuZWdhdGl2ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVwZWF0KG9yaWdpbjogVWludDhBcnJheSwgY291bnQ6IG51bWJlcik6IFVpbnQ4QXJyYXkge1xuICBpZiAoY291bnQgPT09IDApIHtcbiAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoKTtcbiAgfVxuXG4gIGlmIChjb3VudCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcImJ5dGVzOiBuZWdhdGl2ZSByZXBlYXQgY291bnRcIik7XG4gIH0gZWxzZSBpZiAoKG9yaWdpbi5sZW5ndGggKiBjb3VudCkgLyBjb3VudCAhPT0gb3JpZ2luLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcImJ5dGVzOiByZXBlYXQgY291bnQgY2F1c2VzIG92ZXJmbG93XCIpO1xuICB9XG5cbiAgY29uc3QgaW50ID0gTWF0aC5mbG9vcihjb3VudCk7XG5cbiAgaWYgKGludCAhPT0gY291bnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJieXRlczogcmVwZWF0IGNvdW50IG11c3QgYmUgYW4gaW50ZWdlclwiKTtcbiAgfVxuXG4gIGNvbnN0IG5iID0gbmV3IFVpbnQ4QXJyYXkob3JpZ2luLmxlbmd0aCAqIGNvdW50KTtcblxuICBsZXQgYnAgPSBjb3B5KG9yaWdpbiwgbmIpO1xuXG4gIGZvciAoOyBicCA8IG5iLmxlbmd0aDsgYnAgKj0gMikge1xuICAgIGNvcHkobmIuc2xpY2UoMCwgYnApLCBuYiwgYnApO1xuICB9XG5cbiAgcmV0dXJuIG5iO1xufVxuXG4vKiogQ29uY2F0ZW5hdGUgbXVsdGlwbGUgYmluYXJ5IGFycmF5cyBhbmQgcmV0dXJuIG5ldyBvbmUuXG4gKiBAcGFyYW0gYnVmIGJpbmFyeSBhcnJheXMgdG8gY29uY2F0ZW5hdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdCguLi5idWY6IFVpbnQ4QXJyYXlbXSk6IFVpbnQ4QXJyYXkge1xuICBsZXQgbGVuZ3RoID0gMDtcbiAgZm9yIChjb25zdCBiIG9mIGJ1Zikge1xuICAgIGxlbmd0aCArPSBiLmxlbmd0aDtcbiAgfVxuXG4gIGNvbnN0IG91dHB1dCA9IG5ldyBVaW50OEFycmF5KGxlbmd0aCk7XG4gIGxldCBpbmRleCA9IDA7XG4gIGZvciAoY29uc3QgYiBvZiBidWYpIHtcbiAgICBvdXRwdXQuc2V0KGIsIGluZGV4KTtcbiAgICBpbmRleCArPSBiLmxlbmd0aDtcbiAgfVxuXG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbi8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNvdXJjZSBhcnJheSBpbmNsdWRlcyB0aGUgcGF0dGVybiBhcnJheS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbmNsdWRlcyhcbiAgc291cmNlOiBVaW50OEFycmF5LFxuICBwYXR0ZXJuOiBVaW50OEFycmF5LFxuICBmcm9tSW5kZXggPSAwLFxuKTogYm9vbGVhbiB7XG4gIHJldHVybiBpbmRleE9mKHNvdXJjZSwgcGF0dGVybiwgZnJvbUluZGV4KSAhPT0gLTE7XG59XG5cbi8qKlxuICogQ29weSBieXRlcyBmcm9tIG9uZSBVaW50OEFycmF5IHRvIGFub3RoZXIuICBCeXRlcyBmcm9tIGBzcmNgIHdoaWNoIGRvbid0IGZpdFxuICogaW50byBgZHN0YCB3aWxsIG5vdCBiZSBjb3BpZWQuXG4gKlxuICogQHBhcmFtIHNyYyBTb3VyY2UgYnl0ZSBhcnJheVxuICogQHBhcmFtIGRzdCBEZXN0aW5hdGlvbiBieXRlIGFycmF5XG4gKiBAcGFyYW0gb2ZmIE9mZnNldCBpbnRvIGBkc3RgIGF0IHdoaWNoIHRvIGJlZ2luIHdyaXRpbmcgdmFsdWVzIGZyb20gYHNyY2AuXG4gKiBAcmV0dXJuIG51bWJlciBvZiBieXRlcyBjb3BpZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvcHkoc3JjOiBVaW50OEFycmF5LCBkc3Q6IFVpbnQ4QXJyYXksIG9mZiA9IDApOiBudW1iZXIge1xuICBvZmYgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihvZmYsIGRzdC5ieXRlTGVuZ3RoKSk7XG4gIGNvbnN0IGRzdEJ5dGVzQXZhaWxhYmxlID0gZHN0LmJ5dGVMZW5ndGggLSBvZmY7XG4gIGlmIChzcmMuYnl0ZUxlbmd0aCA+IGRzdEJ5dGVzQXZhaWxhYmxlKSB7XG4gICAgc3JjID0gc3JjLnN1YmFycmF5KDAsIGRzdEJ5dGVzQXZhaWxhYmxlKTtcbiAgfVxuICBkc3Quc2V0KHNyYywgb2ZmKTtcbiAgcmV0dXJuIHNyYy5ieXRlTGVuZ3RoO1xufVxuXG4vKiogQGRlcHJlY2F0ZWQgKi9cbmV4cG9ydCB7IGluY2x1ZGVzIGFzIGNvbnRhaW5zIH07XG5cbmV4cG9ydCB7IGVxdWFscyB9IGZyb20gXCIuL2VxdWFscy50c1wiO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDBFQUEwRTtBQUMxRSxxQ0FBcUM7QUFFckM7c0NBQ3NDLEdBQ3RDLE9BQU8sU0FBUyxRQUNkLE1BQWtCLEVBQ2xCLE9BQW1CLEVBQ25CLFlBQVksQ0FBQztFQUViLElBQUksYUFBYSxPQUFPLE1BQU0sRUFBRTtJQUM5QixPQUFPLENBQUM7RUFDVjtFQUNBLElBQUksWUFBWSxHQUFHO0lBQ2pCLFlBQVksS0FBSyxHQUFHLENBQUMsR0FBRyxPQUFPLE1BQU0sR0FBRztFQUMxQztFQUNBLE1BQU0sSUFBSSxPQUFPLENBQUMsRUFBRTtFQUNwQixJQUFLLElBQUksSUFBSSxXQUFXLElBQUksT0FBTyxNQUFNLEVBQUUsSUFBSztJQUM5QyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEtBQUssR0FBRztJQUNyQixNQUFNLE1BQU07SUFDWixJQUFJLFVBQVU7SUFDZCxJQUFJLElBQUk7SUFDUixNQUFPLFVBQVUsUUFBUSxNQUFNLENBQUU7TUFDL0I7TUFDQSxJQUFJLE1BQU0sQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFO1FBQ2xDO01BQ0Y7TUFD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