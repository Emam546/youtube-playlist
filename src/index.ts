import getData from "./getData";

export type ReturnedData = {
    header: string;
    videos: {
        videoId: string;
        thumbnails: {
            url: string;
            width: number;
            height: number;
        }[];
        title: string;
        lengthSeconds: number;
        isPlayable: boolean;
    }[];
};
export function getContent(data: any): any[] {
    return data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer
        .content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0]
        .playlistVideoListRenderer.contents;
}
export function parseInfo(content: any[]) {
    return content
        .filter((data) => data.playlistVideoRenderer)
        .map((data) => {
            data = data.playlistVideoRenderer;
            const videoId: string = data.videoId;
            const thumbnails: {
                url: string;
                width: number;
                height: number;
            }[] = data.thumbnail.thumbnails;
            const title: string = data.title.runs[0].text;
            const lengthSeconds = parseInt(data.lengthSeconds);
            const isPlayable: boolean = data.isPlayable;
            return { videoId, thumbnails, title, lengthSeconds, isPlayable };
        });
}
function youtube_validate(url: string) {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?youtube\.com(?:\S+)?$/;
    const match = url.match(regExp);
    return match && match.length > 0;
}
export function youtube_playlist_parser(url: string) {
    const reg = new RegExp("[&?]list=([a-z0-9_]+)", "i");
    const match = reg.exec(url);

    if (match && match[1].length > 0 && youtube_validate(url)) {
        return match[1];
    } else {
        return false;
    }
}
export function MergeUrl(id: string) {
    return `https://www.youtube.com/playlist?list=${id}`;
}
export default async (url: string):Promise<ReturnedData|null> => {
    const id = youtube_playlist_parser(url);
    if (!id) throw new Error("Get Error");
    const { res, data } = await getData(MergeUrl(id));
    if (res.status != 200) throw new Error("Connection Error");
    if (!data.metadata) return null;
    const header: string = data.metadata.playlistMetadataRenderer.title;
    const contents = getContent(data);
    console.log(contents);
    return {
        header,
        videos: parseInfo(contents),
    };
};
