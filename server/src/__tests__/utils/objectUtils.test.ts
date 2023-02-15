import { flattenObject, merge } from "@/utils/objectUtils";

describe("flattenObject", () => {
  it("should flatten objects with previous layers prefixed onto flattened properties", () => {
    const object = { a: { c: "1", d: "2" }, b: { e: "3" } };

    const flatObject = flattenObject(object);
    const expectedObject = {
        "a.c": "1",
        "a.d": "2",
        "b.e": "3"
    }

    expect(flatObject).toStrictEqual(expectedObject);

  });
  it("should return the object unchanged if the object is one layer deep", () => {
    const object = { a: "1" };

    const flatObject = flattenObject(object);
    expect(flatObject).toStrictEqual(object);
  });

  it("should preserve empty objects", () => {
    const object = { a: {} };

    const flatObject = flattenObject(object);
    expect(flatObject).toStrictEqual(object);
  });

  it("should preserve empty arrays", () => {
    const object = { a: [] };

    const flatObject = flattenObject(object);
    expect(flatObject).toStrictEqual(object);
  });
});

describe("merge", () => {
  it("should return an object that includes all the properties of the objects in its params", () => {
    const object1 = { a: "1" };
    const object2 = { b: "2" };
    const object3 = { c: "3" };

    const newObject = merge(object1, object2, object3);

    expect(newObject).toStrictEqual({ a: "1", b: "2", c: "3" });
  });
});
