// @flow

import { Some, None, _, match, createOption, type Option } from "..";

const Foo = createOption("Foo");

function someOrNone(value: number): Option<string> {
  if (value > 20) {
    return Some("string");
  }

  return None();
}

function anotherOptional(str: string): Option<string> {
  if (str.startsWith("a")) {
    return Some("Alice")
  }
  if (str.startsWith("b")) {
    return Some("Bob")
  }
  if (str.startsWith("z")) {
    return Foo("Zulu")
  }

  return None();
}

describe("match", () => {
  test("should match none", () => {
    const son = someOrNone(5);
    const result = match(son)(
      Some(() => "some"),
      None(() => "none"),
    );

    expect(result).toBe("none");
  });

  test("should match some", () => {
    const result = match(someOrNone(50))(
      Some(x => true),
      None(() => "string"),
    );

    expect(result).toBe("some");
  });

  test("should match the wildcard if it is first in the list", () => {
    const result = match(someOrNone(5))(
      _(() => "wildcard"),
      Some(() => "some"),
      None(() => "none"),
    );

    expect(result).toBe("wildcard");
  });

  test("should match the wildcard if there are no other elements", () => {
    const result = match(someOrNone(5))(
      _(() => "wildcard"),
    );

    expect(result).toBe("wildcard");
  });

  test("should throw if there are no handlers for that specific pattern", () => {
    const throwable = () => match(someOrNone(5))(
      Some(() => "some"),
    );

    expect(throwable).toThrow();
  });

  test("some should unwrap the returned value", () => {
    const result = match(anotherOptional('blake'))(
      Some(x => x),
      None(() => "Gary"),
    );

    expect(result).toBe("Bob");
  });

  test("none should not unwrap any values into args", () => {
    const result = match(anotherOptional('chia'))(
      Some(x => x),
      None(x => x),
    );

    expect(result).toBeUndefined();
  });

  test("Cusom optionals should work as expected", () => {
    const result = match(anotherOptional('zia'))(
      Some(x => x),
      None(x => x),
      Foo(x => x),
    );

    expect(result).toBe("Zulu");
  });
});
