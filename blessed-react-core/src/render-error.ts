type ErrorEntry = {
  name: string;
  stackEntry: string;
};

export class RenderError extends Error {
  components: ErrorEntry[] = [];

  constructor(source: RenderError, componentName: string);
  constructor(source: unknown, componentName: string);
  constructor(source: unknown, componentName: string) {
    super();
    if (source instanceof RenderError) {
      this.message = source.message;
      this.components = [...source.components];
      this.components.push({
        name: componentName ?? "",
        stackEntry: getStackEntry(source.stack),
      });
    } else if (source instanceof Error) {
      this.message = source.message;
      this.components.push({
        name: componentName ?? "",
        stackEntry: getStackEntry(source.stack),
      });
    } else {
      this.message = source + "";
    }
  }

  toString(): string {
    return (
      `Error while rendering UI: ${this.message}\n` +
      this.components.map((c) => `  in ${c.name} [${c.stackEntry}]\n`).join("")
    );
  }
}

function getStackEntry(stack: string | undefined): string {
  const line = stack?.split("\n")[1] ?? "";
  const parensOpen = line.indexOf("(") + 1;
  const parensClose = line.indexOf(")", parensOpen);
  if (parensOpen >= 0 && parensClose >= 0) {
    return line.substring(parensOpen, parensClose);
  }
  return line.substring(line.indexOf(" at ") + 4);
}
