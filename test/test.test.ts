import m, { ReturnedData, getContent, parseInfo } from "../src";
import findData from "../src/getData";
import fs from "fs";
import path from "path";

describe("init response", () => {
    const url =
        "https://www.youtube.com/playlist?list=PLWKjhJtqVAbnZtkAI3BqcYxKnfWn_C704";
    const mock = {
        playlistName: "Design Patterns - Beau teaches JavaScript",
        ids: ["bgU7FeiWKzc", "3PUVr8jFMGg", "3pXVHRT-amw", "KOVc5o5kURE"],
        names: [
            `Singleton Design Pattern - Beau teaches JavaScript`,
            `Observer Design Pattern - Beau teaches JavaScript`,
            `Module Design Pattern - Beau teaches JavaScript`,
            `Mediator Design Pattern - Beau teaches JavaScript`,
        ],
        durations: [4 * 60 + 51, 3 * 60 + 57, 2 * 60 + 44, 5 * 60 + 9],
    };
    let data: ReturnedData;
    beforeAll(async () => {
        data = await m(url);
        fs.writeFileSync(
            path.join(__dirname, "./res.json"),
            JSON.stringify(data)
        );
    });
    it("getId", async () => {
        expect(data).not.toBeUndefined();
        data.videos.forEach(({ videoId }) => {
            expect(mock.ids).toContain(videoId);
        });
    });
    it("playlist name", async () => {
        expect(data).not.toBeUndefined();
        expect(data.header).toBe(mock.playlistName);
    });
    it("names", async () => {
        expect(data).not.toBeUndefined();
        data.videos.forEach(({ title }) => {
            expect(mock.names).toContain(title);
        });
    });
    it("durations", async () => {
        expect(data).not.toBeUndefined();
        data.videos.forEach(({ lengthSeconds }) => {
            expect(mock.durations).toContain(lengthSeconds);
        });
    });
});
describe("findData", () => {
    test("case 1", async () => {
        const url =
            "https://www.youtube.com/playlist?list=PL1Wxz8hJM8HlUKSD2A1PngkTqI_Ai0B3y";
        const json = await findData(url);
        expect(() => getContent(json.data)).not.toThrow(Error);
        const content = getContent(json.data);
        expect(content).not.toBeUndefined();
        expect(content).toBeInstanceOf(Array);
        expect(() => parseInfo(content)).not.toThrow(Error);
    });
});
