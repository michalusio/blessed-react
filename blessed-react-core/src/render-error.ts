import { RopeEntry } from "./hooks/hook-base";
import { getMode } from "./mode";

export class RenderError extends Error {
  constructor(source: unknown, rope?: RopeEntry[]) {
    if (getMode() !== "development" || source instanceof RenderError) {
      throw source;
    }
    super();
    if (source instanceof Error) {
      this.message = source.message;
      this.stack = source.stack?.split("\n")?.[1] ?? "";
      if (this.stack.length > 0) this.stack += "\n";
    } else {
      this.message = source + "";
    }
    if (rope) {
      this.stack += [...rope]
        .reverse()
        .map(({ stackEntry }) => stackEntry)
        .join("\n");
    }
  }

  toString(): string {
    return `Error while rendering UI: ${this.message}`;
  }
}
