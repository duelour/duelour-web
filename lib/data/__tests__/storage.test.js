import { clear, set, get } from "../storage";

describe("clear", () => {
  it("should clear the duelour key in local storage", () => {
    window.localStorage.setItem("duelour", "test");
    clear();
    expect(window.localStorage.getItem("duelour")).toEqual("{}");
  });
});

describe("set", () => {
  it("should set the value in local storage", () => {
    const path = "this.is.a.path";
    const value = "mockValue";

    set(path, value);

    expect(JSON.parse(window.localStorage.getItem("duelour"))).toEqual({
      this: {
        is: {
          a: {
            path: "mockValue"
          }
        }
      }
    });
  });
});

describe("get", () => {
  it("should get the item in local storage", () => {
    window.localStorage.setItem(
      "duelour",
      JSON.stringify({ a: { path: "value" } })
    );
    const value = get("a.path");
    expect(value).toBe("value");
  });
});
