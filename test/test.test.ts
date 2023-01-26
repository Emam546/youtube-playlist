import m, { ReturnedData, getContent, parseInfo } from "../src/main";
import getData from "../src/getData";
import findData from "../src/getData";
import fs from "fs";
import path from "path";
function WriteData(data: any) {
    fs.writeFileSync(path.join(__dirname, "res.json"), JSON.stringify(data));
}
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
        const res = await m(url);
        if (!res) return;
        data = res;
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
    test("case 2", async () => {
        const url =
            "https://www.youtube.com/playlist?list=PLy1bC-662HHKXOVHInxvhSRReDz0d4xCI";
        const json = await findData(url);
        expect(() => getContent(json.data)).not.toThrow(Error);
        const content = getContent(json.data);
        expect(content).not.toBeUndefined();
        expect(content).toBeInstanceOf(Array);
        expect(() => parseInfo(content)).not.toThrow(Error);
        const res = await m(url);
        expect(res).not.toBeNull();
    });
    test("test many cases",async()=>{
        const links=[
            "https://www.youtube.com/playlist?list=PLME9drm1zCz9qnG8Jr_IFgyDT17IQHrd0",
            "https://www.youtube.com/playlist?list=PLyORnIW1xT6zC14Z45V6c00JFwRBWdh8P",
            "https://www.youtube.com/playlist?list=PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji",
        ]
        await Promise.all(links.map(async(url)=>{
            const res = await m(url);
            expect(res).not.toBeNull();
        }))
    })
});

