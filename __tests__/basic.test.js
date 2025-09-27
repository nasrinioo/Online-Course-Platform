describe("Basic Tests", () => {
  it("should pass a simple test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle strings", () => {
    expect("hello").toBe("hello");
  });

  it("should handle arrays", () => {
    expect([1, 2, 3]).toHaveLength(3);
  });

  it("should handle objects", () => {
    const obj = { name: "test", value: 123 };
    expect(obj).toHaveProperty("name");
    expect(obj).toHaveProperty("value");
  });

  it("should handle async operations", async () => {
    const result = await Promise.resolve("async result");
    expect(result).toBe("async result");
  });
});
