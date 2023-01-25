import m, { ReturnedData } from '../src';
import {expect} from "chai"
import * as fs from 'fs';
const url = 'https://www.youtube.com/playlist?list=PLWKjhJtqVAbnZtkAI3BqcYxKnfWn_C704';
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
describe("init response", () => {
    let data:ReturnedData
    before(async ()=>{
        data =await m(url);
        fs.writeFileSync("./res.json",JSON.stringify(data))
    })
    it("getId", async () => {
        expect(data).not.empty
        data.videos.forEach(({videoId})=>{
            expect(mock.ids).includes(videoId)
        })
    });
    it("playlist name", async () => {
        expect(data).not.empty
        expect(data.header).eq(mock.playlistName)
    });
    it("names", async () => {
        expect(data).not.empty
        data.videos.forEach(({title})=>{
            expect(mock.names).includes(title)
        })
    });
    it("durations", async () => {
        expect(data).not.empty
        data.videos.forEach(({lengthSeconds})=>{
            expect(mock.durations).includes(lengthSeconds)
        })
    });
});
