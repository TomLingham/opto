// @flow

import { Some, None, match, option, type Option } from "..";

function someOrNone(value: number): Option<string> {
  if (value > 20) {
    return Some("string");
  }

  return None();
}

function someOrNoneNumber(value: string): Option<number> {
  if (value.startsWith("b")) {
    None();
  }

  Some(4);
}

describe("match", () => {
  test("should match Some", () => {
    const result = match(someOrNone(25), [
      Some(x => x),
      None(() => "String")
    ]);

    expect(result).toBe("some");
  });
  test("should match None", () => {
    const result = match(someOrNone(15), [
      Some(x => x),
      None(() => 2)
    ]);

    expect(result).toBe("none");
  });
});
