"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zQueryJsonObject = exports.zQueryJsonObjectOptional = exports.zQueryBooleanOptional = exports.zQueryBoolean = exports.zQueryNumberOptional = exports.zQueryNumber = exports.zQueryString = exports.zQueryStringOptional = void 0;
const zod_1 = require("zod");
function preprocessEmptyStringToUndefined(value) {
    if (typeof value === 'string' && value.trim() === '')
        return undefined;
    return value;
}
const zQueryStringOptional = () => zod_1.z.preprocess(preprocessEmptyStringToUndefined, zod_1.z.string()).optional();
exports.zQueryStringOptional = zQueryStringOptional;
const zQueryString = () => zod_1.z.preprocess(preprocessEmptyStringToUndefined, zod_1.z.string());
exports.zQueryString = zQueryString;
const zQueryNumber = () => zod_1.z.preprocess(preprocessEmptyStringToUndefined, zod_1.z.coerce.number());
exports.zQueryNumber = zQueryNumber;
const zQueryNumberOptional = () => (0, exports.zQueryNumber)().optional();
exports.zQueryNumberOptional = zQueryNumberOptional;
const zQueryBoolean = () => zod_1.z.preprocess((value) => {
    if (typeof value === 'string') {
        const s = value.trim().toLowerCase();
        if (s === 'true' || s === '1')
            return true;
        if (s === 'false' || s === '0')
            return false;
    }
    return value;
}, zod_1.z.boolean());
exports.zQueryBoolean = zQueryBoolean;
const zQueryBooleanOptional = () => (0, exports.zQueryBoolean)().optional();
exports.zQueryBooleanOptional = zQueryBooleanOptional;
const zQueryJsonObjectOptional = (schema) => zod_1.z
    .preprocess((value) => {
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed)
            return undefined;
        try {
            return JSON.parse(trimmed);
        }
        catch {
            return value;
        }
    }
    return value;
}, schema)
    .optional();
exports.zQueryJsonObjectOptional = zQueryJsonObjectOptional;
const zQueryJsonObject = (schema) => zod_1.z.preprocess((value) => {
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed)
            return value;
        try {
            return JSON.parse(trimmed);
        }
        catch {
            return value;
        }
    }
    return value;
}, schema);
exports.zQueryJsonObject = zQueryJsonObject;
