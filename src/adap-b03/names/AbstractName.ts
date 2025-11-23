import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public clone(): Name {
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        return new (require("./Name").Name)(components, this.delimiter);
    }

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
        const n1 = this.getNoComponents();
        const n2 = other.getNoComponents();
        if (n1 !== n2) {
            return false;
        }
        for (let i = 0; i < n1; i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        let hash = 17;
        const n = this.getNoComponents();

        for (let i = 0; i < n; i++) {
            const comp = this.getComponent(i);
            for (let j = 0; j < comp.length; j++) {
                hash = (31 * hash + comp.charCodeAt(j)) | 0; // 保持在 32 位整数
            }
            if (i < n - 1 && this.delimiter.length > 0) {
                hash = (31 * hash + this.delimiter.charCodeAt(0)) | 0;
            }
        }

        return hash;
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