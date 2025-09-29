"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.problem = problem;
exports.toProblem = toProblem;
function problem(status, title, detail, ext) {
    const base = { status };
    if (title)
        base.title = title;
    if (detail)
        base.detail = detail;
    return Object.assign(base, ext || {});
}
function toProblem(status, title, detail, ext) {
    return problem(status, title, detail, ext);
}
