// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
import { fileURLToPath } from "../url.ts";
const searchParams = Symbol("query");
export function toPathIfFileURL(fileURLOrPath) {
  if (!(fileURLOrPath instanceof URL)) {
    return fileURLOrPath;
  }
  return fileURLToPath(fileURLOrPath);
}
// Utility function that converts a URL object into an ordinary
// options object as expected by the http.request and https.request
// APIs.
// deno-lint-ignore no-explicit-any
export function urlToHttpOptions(url) {
  // deno-lint-ignore no-explicit-any
  const options = {
    protocol: url.protocol,
    hostname: typeof url.hostname === "string" && url.hostname.startsWith("[") ? url.hostname.slice(1, -1) : url.hostname,
    hash: url.hash,
    search: url.search,
    pathname: url.pathname,
    path: `${url.pathname || ""}${url.search || ""}`,
    href: url.href
  };
  if (url.port !== "") {
    options.port = Number(url.port);
  }
  if (url.username || url.password) {
    options.auth = `${decodeURIComponent(url.username)}:${decodeURIComponent(url.password)}`;
  }
  return options;
}
export { searchParams as searchParamsSymbol };
export default {
  toPathIfFileURL
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjEzMi4wL25vZGUvaW50ZXJuYWwvdXJsLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDE4LTIwMjIgdGhlIERlbm8gYXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcIi4uL3VybC50c1wiO1xuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcIi4uL2J1ZmZlci50c1wiO1xuXG5jb25zdCBzZWFyY2hQYXJhbXMgPSBTeW1ib2woXCJxdWVyeVwiKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvUGF0aElmRmlsZVVSTChcbiAgZmlsZVVSTE9yUGF0aDogc3RyaW5nIHwgQnVmZmVyIHwgVVJMLFxuKTogc3RyaW5nIHwgQnVmZmVyIHtcbiAgaWYgKCEoZmlsZVVSTE9yUGF0aCBpbnN0YW5jZW9mIFVSTCkpIHtcbiAgICByZXR1cm4gZmlsZVVSTE9yUGF0aDtcbiAgfVxuICByZXR1cm4gZmlsZVVSTFRvUGF0aChmaWxlVVJMT3JQYXRoKTtcbn1cblxuLy8gVXRpbGl0eSBmdW5jdGlvbiB0aGF0IGNvbnZlcnRzIGEgVVJMIG9iamVjdCBpbnRvIGFuIG9yZGluYXJ5XG4vLyBvcHRpb25zIG9iamVjdCBhcyBleHBlY3RlZCBieSB0aGUgaHR0cC5yZXF1ZXN0IGFuZCBodHRwcy5yZXF1ZXN0XG4vLyBBUElzLlxuLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbmV4cG9ydCBmdW5jdGlvbiB1cmxUb0h0dHBPcHRpb25zKHVybDogYW55KTogYW55IHtcbiAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgY29uc3Qgb3B0aW9uczogYW55ID0ge1xuICAgIHByb3RvY29sOiB1cmwucHJvdG9jb2wsXG4gICAgaG9zdG5hbWU6IHR5cGVvZiB1cmwuaG9zdG5hbWUgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgdXJsLmhvc3RuYW1lLnN0YXJ0c1dpdGgoXCJbXCIpXG4gICAgICA/IHVybC5ob3N0bmFtZS5zbGljZSgxLCAtMSlcbiAgICAgIDogdXJsLmhvc3RuYW1lLFxuICAgIGhhc2g6IHVybC5oYXNoLFxuICAgIHNlYXJjaDogdXJsLnNlYXJjaCxcbiAgICBwYXRobmFtZTogdXJsLnBhdGhuYW1lLFxuICAgIHBhdGg6IGAke3VybC5wYXRobmFtZSB8fCBcIlwifSR7dXJsLnNlYXJjaCB8fCBcIlwifWAsXG4gICAgaHJlZjogdXJsLmhyZWYsXG4gIH07XG4gIGlmICh1cmwucG9ydCAhPT0gXCJcIikge1xuICAgIG9wdGlvbnMucG9ydCA9IE51bWJlcih1cmwucG9ydCk7XG4gIH1cbiAgaWYgKHVybC51c2VybmFtZSB8fCB1cmwucGFzc3dvcmQpIHtcbiAgICBvcHRpb25zLmF1dGggPSBgJHtkZWNvZGVVUklDb21wb25lbnQodXJsLnVzZXJuYW1lKX06JHtcbiAgICAgIGRlY29kZVVSSUNvbXBvbmVudCh1cmwucGFzc3dvcmQpXG4gICAgfWA7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbmV4cG9ydCB7IHNlYXJjaFBhcmFtcyBhcyBzZWFyY2hQYXJhbXNTeW1ib2wgfTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICB0b1BhdGhJZkZpbGVVUkwsXG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDBFQUEwRTtBQUMxRSxTQUFTLGFBQWEsUUFBUSxZQUFZO0FBRzFDLE1BQU0sZUFBZSxPQUFPO0FBRTVCLE9BQU8sU0FBUyxnQkFDZCxhQUFvQztFQUVwQyxJQUFJLENBQUMsQ0FBQyx5QkFBeUIsR0FBRyxHQUFHO0lBQ25DLE9BQU87RUFDVDtFQUNBLE9BQU8sY0FBYztBQUN2QjtBQUVBLCtEQUErRDtBQUMvRCxtRUFBbUU7QUFDbkUsUUFBUTtBQUNSLG1DQUFtQztBQUNuQyxPQUFPLFNBQVMsaUJBQWlCLEdBQVE7RUFDdkMsbUNBQW1DO0VBQ25DLE1BQU0sVUFBZTtJQUNuQixVQUFVLElBQUksUUFBUTtJQUN0QixVQUFVLE9BQU8sSUFBSSxRQUFRLEtBQUssWUFDOUIsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQ3hCLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FDdkIsSUFBSSxRQUFRO0lBQ2hCLE1BQU0sSUFBSSxJQUFJO0lBQ2QsUUFBUSxJQUFJLE1BQU07SUFDbEIsVUFBVSxJQUFJLFFBQVE7SUFDdEIsTUFBTSxDQUFDLEVBQUUsSUFBSSxRQUFRLElBQUksR0FBRyxFQUFFLElBQUksTUFBTSxJQUFJLEdBQUcsQ0FBQztJQUNoRCxNQUFNLElBQUksSUFBSTtFQUNoQjtFQUNBLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSTtJQUNuQixRQUFRLElBQUksR0FBRyxPQUFPLElBQUksSUFBSTtFQUNoQztFQUNBLElBQUksSUFBSSxRQUFRLElBQUksSUFBSSxRQUFRLEVBQUU7SUFDaEMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxFQUFFLG1CQUFtQixJQUFJLFFBQVEsRUFBRSxDQUFDLEVBQ2xELG1CQUFtQixJQUFJLFFBQVEsRUFDaEMsQ0FBQztFQUNKO0VBQ0EsT0FBTztBQUNUO0FBRUEsU0FBUyxnQkFBZ0Isa0JBQWtCLEdBQUc7QUFFOUMsZUFBZTtFQUNiO0FBQ0YsRUFBRSJ9