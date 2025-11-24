import { expect, suite, test, vi } from "vitest";
import { delay, delayForce, force } from "./delay";

suite("delay", () => {
  test("memo", () => {
    const value = "this is value"
    const f = vi.fn(() => value);
    const dly = delay(() => f());

    expect(f).toBeCalledTimes(0);
    expect(force(dly)).toBe(value);
    expect(f).toBeCalledTimes(1);
    expect(force(dly)).toBe(value);
    expect(f).toBeCalledTimes(1);
  });

  test("memo", () => {
    const value = 1
    const f = vi.fn(() => value);
    const dly = delay(() => f());

    expect(f).toBeCalledTimes(0);
    expect(force(dly) + force(dly)).toBe(value + value);
    expect(f).toBeCalledTimes(1);
  });

  test("memo", () => {
    const value = "this is value"
    const f = vi.fn(() => value);
    const dly1 = delay(() => f());
    const dly2 = delayForce(() => dly1);
    const dly3 = delayForce(() => dly2);

    expect(f).toBeCalledTimes(0);
    expect(force(dly3)).toBe(value);
    expect(f).toBeCalledTimes(1);
    expect(force(dly1)).toBe(value);
    expect(f).toBeCalledTimes(1);
  });

  test("reentrancy", () => {
    let first = true;
    const dly = delay((): string => {
      if (first) {
        first = false;
        return force(dly);
      }
      return "second";
    });

    expect(force(dly)).toBe("second");
  });

  test("reentrancy", () => {
    let count = 5;

    function getCount() {
      return count;
    }

    const dly = delay(() => {
      if (count <= 0) {
        return count;
      } else {
        count -= 1;
        force(dly);
        count += 2;
        return count;
      }
    });

    expect(getCount()).toBe(5);
    expect(force(dly)).toBe(0);
    expect(getCount()).toBe(10);
  });

});
