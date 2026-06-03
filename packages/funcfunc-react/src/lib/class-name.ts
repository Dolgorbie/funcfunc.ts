type Name = string | undefined | null | false | Record<string, boolean> | Name[];

export function className(...names: Name[]) {
  const acc: string[] = [];

  const loop = (names: Name): void => {
    if (!names) {
      return;
    }
    if (typeof names === "object") {
      if (Array.isArray(names)) {
        names.forEach(loop);
        return;
      }
      for (const [name, enabled] of Object.entries(names)) {
        if (enabled) {
          acc.push("" + name);
        }
      }
      return;
    }
    acc.push("" + names);
  }

  names.forEach(loop);
  return acc.join(" ");
}
