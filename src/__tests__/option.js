// @flow

import { Some, None, _, unwrap, unwrapOr, match, type Option } from "..";

function someOrNone(value: number): Option<string> {
  if (value > 20) {
    return "string";
  }
}

function anotherOptional(str: string): Option<string> {
  if (str.startsWith("a")) {
    return "Alice";
  }
  if (str.startsWith("b")) {
    return "Bob";
  }
  if (str.startsWith("z")) {
    return "Zulu";
  }
}

function div(x, y): Option<number> {
  if (y !== 0) {
    return x / y;
  }
}

function someAsyncAction(): Promise<Option<string>> {
  return Promise.resolve("some");
}

describe("match", () => {
  test("should match none", () => {
    const result = match(someOrNone(5))(Some(() => "some"), None(() => "none"));

    expect(result).toBe("none");
  });

  test("should match some", () => {
    const result = match(someOrNone(50))(
      Some(x => "some"),
      None(() => "string")
    );

    expect(result).toBe("some");
  });

  test("should match the wildcard if it is first in the list", () => {
    const result = match(someOrNone(5))(
      _(() => "wildcard"),
      Some(() => "some"),
      None(() => "none")
    );

    expect(result).toBe("wildcard");
  });

  test("should match the wildcard if there are no other elements", () => {
    const result = match(someOrNone(5))(_(() => "wildcard"));

    expect(result).toBe("wildcard");
  });

  test("should throw if there are no handlers for that specific pattern", () => {
    const throwable = () => match(someOrNone(5))(Some(() => "some"));

    expect(throwable).toThrow();
  });

  test("some should unwrap the returned value", () => {
    const result = match(anotherOptional("blake"))(
      Some(x => x),
      None(() => "Gary")
    );

    expect(result).toBe("Bob");
  });

  test("none should not unwrap any values into args", () => {
    const result = match(anotherOptional("chia"))(Some(x => x), None(x => x));

    expect(result).toBeUndefined();
  });

  test("Cusom optionals should work as expected", () => {
    const result = match(anotherOptional("zia"))(Some(x => x), None(x => x));

    expect(result).toBe("Zulu");
  });

  test("promises should also work good", () => {
    const result = someAsyncAction();

    const r = unwrap(result);
  });
});

describe("unwrap", () => {
  test("should return the value if it is Some", () => {
    const val = div(5, 2);

    expect(val).toBe(2.5);
  });

  test("should throw when attempting to unwrap a value that is a None", () => {
    const val = div(5, 0);

    expect(() => unwrap(val) / 3).toThrow();
  });
});

describe("unwrapOr", () => {
  test("should use the default value when attempting to unwrap a value that is a None", () => {
    const val = unwrapOr(div(5, 0), 0);

    expect(val).toBe(0);
  });
});
