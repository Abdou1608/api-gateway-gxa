export class BasActionLogEntry {

    private _EntryType: string;
    public get EntryType(): string {
        return this._EntryType;
    }
    private _Message: string;
    public get Message(): string {
        return this._Message;
    }
    private _State: number;
    public set State(value: number) {
        this._State = value;
    }

    constructor(entryType: string, message: string, state: number) {
        this._EntryType = entryType;
        this._Message = message;
        this._State = state;
    }
}