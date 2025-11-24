import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        const n = this.getNoComponents();
        if (n === 0) {
            return "";
        }
        const parts: string[] = [];
        for (let i = 0; i < n; i++) {
            parts.push(this.getComponent(i));
        }
        return parts.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const n = this.getNoComponents();
        if (n === 0) {
            return "";
        }

        const delim = DEFAULT_DELIMITER;
        const esc = ESCAPE_CHARACTER;
        const escEscaped = esc.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        const delimEscaped = delim.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

        const escapedComponents: string[] = [];
        for (let i = 0; i < n; i++) {
            let c = this.getComponent(i);
            c = c.replace(new RegExp(escEscaped, "g"), esc + esc);
            c = c.replace(new RegExp(delimEscaped, "g"), esc + delim);
            escapedComponents.push(c);
        }

        return escapedComponents.join(delim);
    }

    public isEqual(other: Name): boolean {
        return this.asDataString() === other.asDataString();
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i: number = 0; i < s.length; i++) {
            let c: number = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
    }
    return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        const n = other.getNoComponents();
        for (let i = 0; i < n; i++) {
            this.append(other.getComponent(i));
        }
    }

}