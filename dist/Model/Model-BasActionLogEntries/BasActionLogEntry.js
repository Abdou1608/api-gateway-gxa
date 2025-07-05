"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasActionLogEntry = void 0;
class BasActionLogEntry {
    get EntryType() {
        return this._EntryType;
    }
    get Message() {
        return this._Message;
    }
    set State(value) {
        this._State = value;
    }
    constructor(entryType, message, state) {
        this._EntryType = entryType;
        this._Message = message;
        this._State = state;
    }
}
exports.BasActionLogEntry = BasActionLogEntry;
