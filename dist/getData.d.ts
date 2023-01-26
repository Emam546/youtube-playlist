export default function (url: string): Promise<{
    res: import("axios").AxiosResponse<any, any>;
    data: any;
}>;
