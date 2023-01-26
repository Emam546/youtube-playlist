import getData from "./getData";

export type ReturnedData={
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
}
export function getContent(data: any): any[] {
    return data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer
        .content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0]
        .playlistVideoListRenderer.contents;
}
export function parseInfo(content: any[]) {
    return content.filter((data)=>data.playlistVideoRenderer).map((data) => {
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
export default async (url: string):Promise<ReturnedData> => {
    const {res,data}=await getData(url)
    const header:string = data.metadata.playlistMetadataRenderer.title;
    const contents = getContent(data);
    console.log(contents);
    return {
        header,
        videos: parseInfo(contents),
    };
};
