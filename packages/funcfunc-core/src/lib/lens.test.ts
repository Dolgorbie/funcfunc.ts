import { expect, suite, test, vi, type Mock } from "vitest";
import { getIdLens, lensI, } from "./lens";

const obj = {
  a: 1,
  b: {
    ba: "BA",
    bb: {
      bba: 100,
      bbb: "BBB",
      bbc: 200n,
    },
    bc: [false, true],
  },
  c: true
};

suite("lens", () => {
  test("prop", () => {
    const lensA = getIdLens<typeof obj>().prop("a");
    expect(lensA(obj)).toEqual(1);
    expect(lensA(obj, 3)).toEqual({ ...obj, a: 3 })

    const lensB = getIdLens<typeof obj>().prop("b");
    expect(lensB(obj)).toEqual(obj.b);
    const newB = { ba: "new BA", bb: { bba: 200, bbb: "new BBB", bbc: 300n }, bc: [true] };
    expect(lensB(obj, newB)).toEqual({ ...obj, b: newB });
  });

  test("prop chain", () => {
    const lensB_BA = getIdLens<typeof obj>().prop("b").prop("ba");
    expect(lensB_BA(obj)).toEqual(obj.b.ba);
    expect(lensB_BA(obj, "new BA")).toEqual({ ...obj, b: { ...obj.b, ba: "new BA" } });

    const propBImpl = getIdLens<typeof obj>().prop("b")
    const propB = lensI(lensI(vi.fn(propBImpl) as never as typeof propBImpl));
    const lensB_BB_BBC = propB.prop("bb").prop("bbc");
    expect(lensB_BB_BBC(obj)).toEqual(obj.b.bb.bbc);
    expect(propB).toBeCalledTimes(1);
    (propB as never as Mock).mockClear();
    expect(lensB_BB_BBC(obj, 300n)).toEqual({ ...obj, b: { ...obj.b, bb: { ...obj.b.bb, bbc: 300n } } });
    expect(propB).toBeCalledTimes(3);
  });

  test("mut", () => {
    const obj = {
      a: 1,
      b: {
        ba: "BA",
        bb: {
          bba: 100,
          bbb: "BBB",
          bbc: 200n,
        },
        bc: [false, true],
      },
      c: true
    };

    const lns = getIdLens<typeof obj>().mut("b").mut("bb").mut("bbb");
    expect(lns(obj)).toEqual(obj.b.bb.bbb);
    expect(lns(obj, "new bbb")).toEqual(obj);
    expect(lns(obj)).toEqual(obj.b.bb.bbb);
    expect(lns(obj)).toEqual("new bbb");
  });


});
