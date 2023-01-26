"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cutAfterJS = exports.between = void 0;
const between = (haystack, left, right) => {
    let pos;
    if (left instanceof RegExp) {
        const match = haystack.match(left);
        if (!match || !match.index)
            return "";
        pos = match.index + match[0].length;
    }
    else {
        pos = haystack.indexOf(left);
        if (pos === -1) {
            return "";
        }
        pos += left.length;
    }
    haystack = haystack.slice(pos);
    pos = haystack.indexOf(right);
    if (pos === -1) {
        return "";
    }
    haystack = haystack.slice(0, pos);
    return haystack;
};
exports.between = between;
const ESCAPING_SEQUENZES = [
    // Strings
    { start: '"', end: '"' },
    { start: "'", end: "'" },
    { start: "`", end: "`" },
    // RegeEx
    { start: "/", end: "/", startPrefix: /(^|[[{:;,])\s?$/ },
];
const cutAfterJS = (mixedJson) => {
    // Define the general open and closing tag
    let open, close;
    if (mixedJson[0] === "[") {
        open = "[";
        close = "]";
    }
    else if (mixedJson[0] === "{") {
        open = "{";
        close = "}";
    }
    if (!open) {
        throw new Error(`Can't cut unsupported JSON (need to begin with [ or { ) but got: ${mixedJson[0]}`);
    }
    // States if the loop is currently inside an escaped js object
    let isEscapedObject = null;
    // States if the current character is treated as escaped or not
    let isEscaped = false;
    // Current open brackets to be closed
    let counter = 0;
    let i;
    // Go through all characters from the start
    for (i = 0; i < mixedJson.length; i++) {
        // End of current escaped object
        if (!isEscaped &&
            isEscapedObject !== null &&
            mixedJson[i] === isEscapedObject.end) {
            isEscapedObject = null;
            continue;
            // Might be the start of a new escaped object
        }
        else if (!isEscaped && isEscapedObject === null) {
            for (const escaped of ESCAPING_SEQUENZES) {
                if (mixedJson[i] !== escaped.start)
                    continue;
                // Test startPrefix against last 10 characters
                if (!escaped.startPrefix ||
                    mixedJson.substring(i - 10, i).match(escaped.startPrefix)) {
                    isEscapedObject = escaped;
                    break;
                }
            }
            // Continue if we found a new escaped object
            if (isEscapedObject !== null) {
                continue;
            }
        }
        // Toggle the isEscaped boolean for every backslash
        // Reset for every regular character
        isEscaped = mixedJson[i] === "\\" && !isEscaped;
        if (isEscapedObject !== null)
            continue;
        if (mixedJson[i] === open) {
            counter++;
        }
        else if (mixedJson[i] === close) {
            counter--;
        }
        // All brackets have been closed, thus end of JSON is reached
        if (counter === 0) {
            // Return the cut JSON
            return mixedJson.substring(0, i + 1);
        }
    }
    // We ran through the whole string and ended up with an unclosed bracket
    throw Error("Can't cut unsupported JSON (no matching closing bracket found)");
};
exports.cutAfterJS = cutAfterJS;
