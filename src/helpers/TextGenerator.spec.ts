import { generateText } from "./TextGenerator";

describe("TextGenerator", () => {
  it("Should return a string", () => {
    const textLength = 12;
    const randomText = generateText(textLength);
    expect(typeof randomText).toBe("string");
    expect(randomText.length).toBe(textLength);
  });
});
