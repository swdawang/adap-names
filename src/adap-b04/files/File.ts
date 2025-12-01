import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        // do something
        IllegalArgumentException.assert(
            this.state === FileState.CLOSED,
            "file must be CLOSED to open it"
        );

        this.state = FileState.OPEN;
    }

    public read(noBytes: number): Int8Array {
        // read something
        IllegalArgumentException.assert(
            this.state === FileState.OPEN,
            "file must be OPEN to read it"
        );
    
        IllegalArgumentException.assert(
            noBytes >= 0,
            "number of bytes must be non-negative"
        );

        return new Int8Array(noBytes);
    }

    public close(): void {
        // do something
        IllegalArgumentException.assert(
            this.state === FileState.OPEN,
            "file must be OPEN to close it"
        );
        this.state = FileState.CLOSED
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}