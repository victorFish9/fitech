// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// This module ports:
// - https://github.com/nodejs/node/blob/master/src/pipe_wrap.cc
// - https://github.com/nodejs/node/blob/master/src/pipe_wrap.h
import { notImplemented } from "../_utils.ts";
import { unreachable } from "../../testing/asserts.ts";
import { ConnectionWrap } from "./connection_wrap.ts";
import { AsyncWrap, providerType } from "./async_wrap.ts";
export var socketType;
(function(socketType) {
  socketType[socketType["SOCKET"] = 0] = "SOCKET";
  socketType[socketType["SERVER"] = 1] = "SERVER";
  socketType[socketType["IPC"] = 2] = "IPC";
})(socketType || (socketType = {}));
export class Pipe extends ConnectionWrap {
  reading = false;
  ipc;
  constructor(type){
    let provider;
    let ipc;
    switch(type){
      case socketType.SOCKET:
        {
          provider = providerType.PIPEWRAP;
          ipc = false;
          break;
        }
      case socketType.SERVER:
        {
          provider = providerType.PIPESERVERWRAP;
          ipc = false;
          break;
        }
      case socketType.IPC:
        {
          provider = providerType.PIPEWRAP;
          ipc = true;
          break;
        }
      default:
        {
          unreachable();
        }
    }
    super(provider);
    this.ipc = ipc;
  }
  bind() {
    notImplemented();
  }
  listen() {
    notImplemented();
  }
  connect(_req, _address, _afterConnect) {
    notImplemented();
  }
  open(_fd) {
    // REF: https://github.com/denoland/deno/issues/6529
    notImplemented();
  }
  // Windows only
  setPendingInstances(_instances) {
    notImplemented();
  }
  fchmod() {
    notImplemented();
  }
}
export class PipeConnectWrap extends AsyncWrap {
  oncomplete;
  address;
  constructor(){
    super(providerType.PIPECONNECTWRAP);
  }
}
export var constants;
(function(constants) {
  constants[constants["SOCKET"] = socketType.SOCKET] = "SOCKET";
  constants[constants["SERVER"] = socketType.SERVER] = "SERVER";
  constants[constants["IPC"] = socketType.IPC] = "IPC";
  constants[constants["UV_READABLE"] = void 0] = "UV_READABLE";
  constants[constants["UV_WRITABLE"] = void 0] = "UV_WRITABLE";
})(constants || (constants = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjEzMi4wL25vZGUvaW50ZXJuYWxfYmluZGluZy9waXBlX3dyYXAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyMiB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyBUaGlzIG1vZHVsZSBwb3J0czpcbi8vIC0gaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL2Jsb2IvbWFzdGVyL3NyYy9waXBlX3dyYXAuY2Ncbi8vIC0gaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL2Jsb2IvbWFzdGVyL3NyYy9waXBlX3dyYXAuaFxuXG5pbXBvcnQgeyBub3RJbXBsZW1lbnRlZCB9IGZyb20gXCIuLi9fdXRpbHMudHNcIjtcbmltcG9ydCB7IHVucmVhY2hhYmxlIH0gZnJvbSBcIi4uLy4uL3Rlc3RpbmcvYXNzZXJ0cy50c1wiO1xuaW1wb3J0IHsgQ29ubmVjdGlvbldyYXAgfSBmcm9tIFwiLi9jb25uZWN0aW9uX3dyYXAudHNcIjtcbmltcG9ydCB7IEFzeW5jV3JhcCwgcHJvdmlkZXJUeXBlIH0gZnJvbSBcIi4vYXN5bmNfd3JhcC50c1wiO1xuXG5leHBvcnQgZW51bSBzb2NrZXRUeXBlIHtcbiAgU09DS0VULFxuICBTRVJWRVIsXG4gIElQQyxcbn1cblxuZXhwb3J0IGNsYXNzIFBpcGUgZXh0ZW5kcyBDb25uZWN0aW9uV3JhcCB7XG4gIG92ZXJyaWRlIHJlYWRpbmcgPSBmYWxzZTtcbiAgaXBjOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHR5cGU6IG51bWJlcikge1xuICAgIGxldCBwcm92aWRlcjogcHJvdmlkZXJUeXBlO1xuICAgIGxldCBpcGM6IGJvb2xlYW47XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2Ugc29ja2V0VHlwZS5TT0NLRVQ6IHtcbiAgICAgICAgcHJvdmlkZXIgPSBwcm92aWRlclR5cGUuUElQRVdSQVA7XG4gICAgICAgIGlwYyA9IGZhbHNlO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBzb2NrZXRUeXBlLlNFUlZFUjoge1xuICAgICAgICBwcm92aWRlciA9IHByb3ZpZGVyVHlwZS5QSVBFU0VSVkVSV1JBUDtcbiAgICAgICAgaXBjID0gZmFsc2U7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIHNvY2tldFR5cGUuSVBDOiB7XG4gICAgICAgIHByb3ZpZGVyID0gcHJvdmlkZXJUeXBlLlBJUEVXUkFQO1xuICAgICAgICBpcGMgPSB0cnVlO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICB1bnJlYWNoYWJsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN1cGVyKHByb3ZpZGVyKTtcbiAgICB0aGlzLmlwYyA9IGlwYztcbiAgfVxuXG4gIGJpbmQoKSB7XG4gICAgbm90SW1wbGVtZW50ZWQoKTtcbiAgfVxuXG4gIGxpc3RlbigpIHtcbiAgICBub3RJbXBsZW1lbnRlZCgpO1xuICB9XG5cbiAgY29ubmVjdChcbiAgICBfcmVxOiBQaXBlQ29ubmVjdFdyYXAsXG4gICAgX2FkZHJlc3M6IHN0cmluZyxcbiAgICBfYWZ0ZXJDb25uZWN0OiAoXG4gICAgICBzdGF0dXM6IG51bWJlcixcbiAgICAgIGhhbmRsZTogUGlwZSxcbiAgICAgIHJlcTogUGlwZUNvbm5lY3RXcmFwLFxuICAgICAgcmVhZGFibGU6IGJvb2xlYW4sXG4gICAgICB3cml0YWJsZTogYm9vbGVhbixcbiAgICApID0+IHZvaWQsXG4gICkge1xuICAgIG5vdEltcGxlbWVudGVkKCk7XG4gIH1cblxuICBvcGVuKF9mZDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAvLyBSRUY6IGh0dHBzOi8vZ2l0aHViLmNvbS9kZW5vbGFuZC9kZW5vL2lzc3Vlcy82NTI5XG4gICAgbm90SW1wbGVtZW50ZWQoKTtcbiAgfVxuXG4gIC8vIFdpbmRvd3Mgb25seVxuICBzZXRQZW5kaW5nSW5zdGFuY2VzKF9pbnN0YW5jZXM6IG51bWJlcikge1xuICAgIG5vdEltcGxlbWVudGVkKCk7XG4gIH1cblxuICBmY2htb2QoKSB7XG4gICAgbm90SW1wbGVtZW50ZWQoKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGlwZUNvbm5lY3RXcmFwIGV4dGVuZHMgQXN5bmNXcmFwIHtcbiAgb25jb21wbGV0ZSE6IChcbiAgICBzdGF0dXM6IG51bWJlcixcbiAgICBoYW5kbGU6IENvbm5lY3Rpb25XcmFwLFxuICAgIHJlcTogUGlwZUNvbm5lY3RXcmFwLFxuICAgIHJlYWRhYmxlOiBib29sZWFuLFxuICAgIHdyaXRlYWJsZTogYm9vbGVhbixcbiAgKSA9PiB2b2lkO1xuICBhZGRyZXNzITogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHByb3ZpZGVyVHlwZS5QSVBFQ09OTkVDVFdSQVApO1xuICB9XG59XG5cbmV4cG9ydCBlbnVtIGNvbnN0YW50cyB7XG4gIFNPQ0tFVCA9IHNvY2tldFR5cGUuU09DS0VULFxuICBTRVJWRVIgPSBzb2NrZXRUeXBlLlNFUlZFUixcbiAgSVBDID0gc29ja2V0VHlwZS5JUEMsXG4gIFVWX1JFQURBQkxFLFxuICBVVl9XUklUQUJMRSxcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUUsc0RBQXNEO0FBQ3RELEVBQUU7QUFDRiwwRUFBMEU7QUFDMUUsZ0VBQWdFO0FBQ2hFLHNFQUFzRTtBQUN0RSxzRUFBc0U7QUFDdEUsNEVBQTRFO0FBQzVFLHFFQUFxRTtBQUNyRSx3QkFBd0I7QUFDeEIsRUFBRTtBQUNGLDBFQUEwRTtBQUMxRSx5REFBeUQ7QUFDekQsRUFBRTtBQUNGLDBFQUEwRTtBQUMxRSw2REFBNkQ7QUFDN0QsNEVBQTRFO0FBQzVFLDJFQUEyRTtBQUMzRSx3RUFBd0U7QUFDeEUsNEVBQTRFO0FBQzVFLHlDQUF5QztBQUV6QyxxQkFBcUI7QUFDckIsZ0VBQWdFO0FBQ2hFLCtEQUErRDtBQUUvRCxTQUFTLGNBQWMsUUFBUSxlQUFlO0FBQzlDLFNBQVMsV0FBVyxRQUFRLDJCQUEyQjtBQUN2RCxTQUFTLGNBQWMsUUFBUSx1QkFBdUI7QUFDdEQsU0FBUyxTQUFTLEVBQUUsWUFBWSxRQUFRLGtCQUFrQjs7VUFFOUM7Ozs7R0FBQSxlQUFBO0FBTVosT0FBTyxNQUFNLGFBQWE7RUFDZixVQUFVLE1BQU07RUFDekIsSUFBYTtFQUViLFlBQVksSUFBWSxDQUFFO0lBQ3hCLElBQUk7SUFDSixJQUFJO0lBRUosT0FBUTtNQUNOLEtBQUssV0FBVyxNQUFNO1FBQUU7VUFDdEIsV0FBVyxhQUFhLFFBQVE7VUFDaEMsTUFBTTtVQUVOO1FBQ0Y7TUFDQSxLQUFLLFdBQVcsTUFBTTtRQUFFO1VBQ3RCLFdBQVcsYUFBYSxjQUFjO1VBQ3RDLE1BQU07VUFFTjtRQUNGO01BQ0EsS0FBSyxXQUFXLEdBQUc7UUFBRTtVQUNuQixXQUFXLGFBQWEsUUFBUTtVQUNoQyxNQUFNO1VBRU47UUFDRjtNQUNBO1FBQVM7VUFDUDtRQUNGO0lBQ0Y7SUFFQSxLQUFLLENBQUM7SUFDTixJQUFJLENBQUMsR0FBRyxHQUFHO0VBQ2I7RUFFQSxPQUFPO0lBQ0w7RUFDRjtFQUVBLFNBQVM7SUFDUDtFQUNGO0VBRUEsUUFDRSxJQUFxQixFQUNyQixRQUFnQixFQUNoQixhQU1TLEVBQ1Q7SUFDQTtFQUNGO0VBRUEsS0FBSyxHQUFXLEVBQVU7SUFDeEIsb0RBQW9EO0lBQ3BEO0VBQ0Y7RUFFQSxlQUFlO0VBQ2Ysb0JBQW9CLFVBQWtCLEVBQUU7SUFDdEM7RUFDRjtFQUVBLFNBQVM7SUFDUDtFQUNGO0FBQ0Y7QUFFQSxPQUFPLE1BQU0sd0JBQXdCO0VBQ25DLFdBTVU7RUFDVixRQUFpQjtFQUVqQixhQUFjO0lBQ1osS0FBSyxDQUFDLGFBQWEsZUFBZTtFQUNwQztBQUNGOztVQUVZO2tDQUNELFdBQVcsTUFBTTtrQ0FDakIsV0FBVyxNQUFNOytCQUNwQixXQUFXLEdBQUc7OztHQUhWLGNBQUEifQ==