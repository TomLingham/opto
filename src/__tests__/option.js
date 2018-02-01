// @flow

import { Some, None, match, option, type Option } from "..";

function someOrNone(value: number): Option<number> {
  if (value > 20) {
    return Some("some");
  }

  return None();
}

describe("match", () => {
  test("should match Some", () => {
    const result = match(someOrNone(25))(
      Some(x => x),
      None(() => "none")
    );

    expect(result).toBe("some");
  });
  test("should match None", () => {
    const result = match(someOrNone(15))(
      Some(x => x),
      None(() => "none")
    );

    expect(result).toBe("none");
  });
});
