import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);

        if (!Array.isArray(source)) {
            throw new Error("source must be an array of strings");
        }
        this.components = source.slice();
    }

    public clone(): Name {
        return new StringArrayName(this.components.slice(), this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
    }

    public asDataString(): string {
        return super.asDataString();
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return super.isEmpty();
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (!Number.isInteger(i) || i < 0 || i >= this.components.length) {
            throw new Error("component index out of range");
        }
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        if (!Number.isInteger(i) || i < 0 || i >= this.components.length) {
            throw new Error("component index out of range");
        }

        let escaped = false;
        for (let k = 0; k < c.length; k++) {
            const ch = c[k];

            if (escaped) {
                escaped = false;
                continue;
            }
            if (ch === ESCAPE_CHARACTER) {
                escaped = true;
                continue;
            }
            if (ch === this.delimiter) {
                throw new Error("component is not properly masked");
            }
        }
        if (escaped) {
            throw new Error("component is not properly masked");
        }

        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        if (!Number.isInteger(i) || i < 0 || i > this.components.length) {
            throw new Error("component index out of range");
        }

        let escaped = false;
        for (let k = 0; k < c.length; k++) {
            const ch = c[k];

            if (escaped) {
                escaped = false;
                continue;
            }
            if (ch === ESCAPE_CHARACTER) {
                escaped = true;
                continue;
            }
            if (ch === this.delimiter) {
                throw new Error("component is not properly masked");
            }
        }
        if (escaped) {
            throw new Error("component is not properly masked");
        }

        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        let escaped = false;
        for (let k = 0; k < c.length; k++) {
            const ch = c[k];

            if (escaped) {
                escaped = false;
                continue;
            }
            if (ch === ESCAPE_CHARACTER) {
                escaped = true;
                continue;
            }
            if (ch === this.delimiter) {
                throw new Error("component is not properly masked");
            }
        }
        if (escaped) {
            throw new Error("component is not properly masked");
        }

        this.components.push(c);
    }

    public remove(i: number) {
        if (!Number.isInteger(i) || i < 0 || i >= this.components.length) {
            throw new Error("component index out of range");
        }
        this.components.splice(i, 1);
    }    
    public concat(other: Name): void {
        const n = other.getNoComponents();
        for (let i = 0; i < n; i++) {
            this.append(other.getComponent(i));
        }
    }
}