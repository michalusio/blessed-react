import { RopeEntry } from "./hooks/hook-base";

export class RenderError extends Error {
  private componentStack: string = "";

  constructor(source: unknown, rope?: RopeEntry[]) {
    super();
    if (source instanceof RenderError) {
      throw source;
    } else if (source instanceof Error) {
      this.message = source.message;
      this.componentStack = source.stack?.split("\n")?.[1] ?? "";
      if (this.componentStack.length > 0) this.componentStack += "\n";
    } else {
      this.message = source + "";
    }
    if (rope) {
      this.componentStack += [...rope]
        .reverse()
        .map(({ stackEntry }) => stackEntry)
        .join("\n");
    } else this.componentStack = this.stack ?? "";
  }

  toString(): string {
    return `Error while rendering UI: ${this.message}\n${this.componentStack}`;
  }
}
