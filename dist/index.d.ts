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
export declare function getContent(data: any): any[];
export declare function parseInfo(content: any[]): {
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
export declare function youtube_playlist_parser(url: string): string | false;
export declare function MergeUrl(id: string): string;
declare const _default: (url: string) => Promise<ReturnedData | null>;
export default _default;
