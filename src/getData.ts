import axios from "axios";
import * as utils from "./utils";
import { type searchEle } from "./utils";
const jsonClosingChars = /^[)\]}'\s]+/;
const parseJSON = (source: string, varName: string, json: string) => {
    if (!json || typeof json === "object") {
        return json;
    } else {
        try {
            json = json.replace(jsonClosingChars, "");
            return JSON.parse(json);
        } catch (err) {
            throw Error(
                `Error parsing ${varName} in ${source}: ${
                    (err as Error).message
                }`
            );
        }
    }
};

const findJSON = (
    source: string,
    varName: string,
    body: string,
    left: searchEle,
    right: string,
    prependJSON: string
) => {
    const jsonStr = utils.between(body, left, right);
    if (!jsonStr) {
        throw Error(`Could not find ${varName} in ${source}`);
    }
    return parseJSON(
        source,
        varName,
        utils.cutAfterJS(`${prependJSON}${jsonStr}`)
    );
};
export default async function (url: string) {
    const res = await axios(url);
    return {
        res,
        data: findJSON(
            "watch.html",
            "response",
            res.data,
            /\bytInitialData("\])?\s*=\s*\{/i,
            "</script>",
            "{"
        ),
    };
}
