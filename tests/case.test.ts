import { describe, expect, it } from "vitest";
import {
  splitWords,
  toCamel,
  toConstant,
  toKebab,
  toPascal,
  toSentence,
  toSnake,
  toTitle,
} from "@/lib/case";

describe("case", () => {
  it("splits a snake_case string", () => {
    expect(splitWords("hello_world_foo")).toEqual(["hello", "world", "foo"]);
  });

  it("splits a kebab and dotted path", () => {
    expect(splitWords("foo-bar.baz")).toEqual(["foo", "bar", "baz"]);
  });

  it("splits camel and pascal case", () => {
    expect(splitWords("helloWorld")).toEqual(["hello", "World"]);
    expect(splitWords("HTTPServer")).toEqual(["HTTP", "Server"]);
  });

  const words = ["convert", "this", "string"];

  it("converts to common forms", () => {
    expect(toCamel(words)).toBe("convertThisString");
    expect(toPascal(words)).toBe("ConvertThisString");
    expect(toSnake(words)).toBe("convert_this_string");
    expect(toKebab(words)).toBe("convert-this-string");
    expect(toConstant(words)).toBe("CONVERT_THIS_STRING");
    expect(toTitle(words)).toBe("Convert This String");
    expect(toSentence(words)).toBe("Convert this string");
  });

  it("handles empty input", () => {
    expect(toCamel([])).toBe("");
    expect(toSentence([])).toBe("");
  });
});
