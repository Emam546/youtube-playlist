export type searchEle = string | RegExp;
export declare const between: (haystack: string, left: searchEle, right: string) => string;
export declare const cutAfterJS: (mixedJson: string) => string;
