"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeUrl = exports.youtube_playlist_parser = exports.youtube_validate = exports.parseInfo = exports.getContent = void 0;
const getData_1 = __importDefault(require("./getData"));
function getContent(data) {
    return data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer
        .content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0]
        .playlistVideoListRenderer.contents;
}
exports.getContent = getContent;
function parseInfo(content) {
    return content
        .filter((data) => data.playlistVideoRenderer)
        .map((data) => {
        data = data.playlistVideoRenderer;
        const videoId = data.videoId;
        const thumbnails = data.thumbnail.thumbnails;
        const title = data.title.runs[0].text;
        const lengthSeconds = parseInt(data.lengthSeconds);
        const isPlayable = data.isPlayable;
        return { videoId, thumbnails, title, lengthSeconds, isPlayable };
    });
}
exports.parseInfo = parseInfo;
function youtube_validate(url) {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?youtube\.com(?:[^ ]+)?$/;
    const match = url.match(regExp);
    return match != null && match.length > 0;
}
exports.youtube_validate = youtube_validate;
function youtube_playlist_parser(url) {
    const reg = new RegExp("[&?]list=([^ ]+)", "i");
    const match = reg.exec(url);
    if (match != null && match[1].length > 0 && youtube_validate(url)) {
        return match[1];
    }
    else {
        return false;
    }
}
exports.youtube_playlist_parser = youtube_playlist_parser;
function MergeUrl(id) {
    return `https://www.youtube.com/playlist?list=${id}`;
}
exports.MergeUrl = MergeUrl;
exports.default = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const id = youtube_playlist_parser(url);
    if (!id)
        return null;
    const { res, data } = yield (0, getData_1.default)(MergeUrl(id));
    if (res.status != 200)
        throw new Error("Connection Error");
    if (data.metadata === undefined)
        return null;
    const header = data.metadata.playlistMetadataRenderer.title;
    const contents = getContent(data);
    return {
        header,
        videos: parseInfo(contents),
    };
});
