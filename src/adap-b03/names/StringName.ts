import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);

        if (typeof source !== "string") {
            throw new Error("source must be a string");
        }

        this.name = source;
        
        const s = this.name;
        if (s.length === 0) {
            this.noComponents = 0;
        } else {
            let count = 1;
            let escaped = false;
            for (let i = 0; i < s.length; i++) {
                const ch = s[i];

                if (escaped) {
                    escaped = false;
                    continue;
                }
                if (ch === ESCAPE_CHARACTER) {
                    escaped = true;
                    continue;
                }
                if (ch === this.delimiter) {
                    count++;
                }
            }
            this.noComponents = count;
        }
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
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
        return this.noComponents === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        const s = this.name;
        const components: string[] = [];
        let current = "";
        let escaped = false;
        for (let idx = 0; idx < s.length; idx++) {
            const ch = s[idx];

            if (escaped) {
                current += ch;
                escaped = false;
                continue;
            }

            if (ch === ESCAPE_CHARACTER) {
                current += ch;
                escaped = true;
                continue;
            }

            if (ch === this.delimiter) {
                components.push(current);
                current = "";
                continue;
            }

            current += ch;
        }
        if (s.length > 0 || components.length === 0) {
            components.push(current);
        }

        if (!Number.isInteger(i) || i < 0 || i >= components.length) {
            throw new Error("component index out of range");
        }

        return components[i];
    }

    public setComponent(i: number, c: string) {
        const s = this.name;

        const components: string[] = [];
        let current = "";
        let escaped = false;

        for (let idx = 0; idx < s.length; idx++) {
            const ch = s[idx];

            if (escaped) {
                current += ch;
                escaped = false;
                continue;
            }

            if (ch === ESCAPE_CHARACTER) {
                current += ch;
                escaped = true;
                continue;
            }

            if (ch === this.delimiter) {
                components.push(current);
                current = "";
                continue;
            }

            current += ch;
        }
        if (s.length > 0 || components.length === 0) {
            components.push(current);
        }

        if (!Number.isInteger(i) || i < 0 || i >= components.length) {
            throw new Error("component index out of range");
        }
        if (typeof c !== "string") {
            throw new Error("component must be a string");
        }

        escaped = false;
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

        components[i] = c;

        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    public insert(i: number, c: string) {
        const s = this.name;

        const components: string[] = [];
        let current = "";
        let escaped = false;

        for (let idx = 0; idx < s.length; idx++) {
            const ch = s[idx];

            if (escaped) {
                current += ch;
                escaped = false;
                continue;
            }

            if (ch === ESCAPE_CHARACTER) {
                current += ch;
                escaped = true;
                continue;
            }

            if (ch === this.delimiter) {
                components.push(current);
                current = "";
                continue;
            }

            current += ch;
        }
        if (s.length > 0 || components.length === 0) {
            components.push(current);
        }

        if (!Number.isInteger(i) || i < 0 || i > components.length) {
            throw new Error("component index out of range");
        }
        if (typeof c !== "string") {
            throw new Error("component must be a string");
        }

        escaped = false;
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

        components.splice(i, 0, c);

        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    public append(c: string) {
        const s = this.name;

        const components: string[] = [];
        let current = "";
        let escaped = false;

        for (let idx = 0; idx < s.length; idx++) {
            const ch = s[idx];

            if (escaped) {
                current += ch;
                escaped = false;
                continue;
            }

            if (ch === ESCAPE_CHARACTER) {
                current += ch;
                escaped = true;
                continue;
            }

            if (ch === this.delimiter) {
                components.push(current);
                current = "";
                continue;
            }

            current += ch;
        }
        if (s.length > 0 || components.length === 0) {
            components.push(current);
        }

        if (typeof c !== "string") {
            throw new Error("component must be a string");
        }

        escaped = false;
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

        components.push(c);

        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    public remove(i: number) {
        const s = this.name;

        const components: string[] = [];
        let current = "";
        let escaped = false;

        for (let idx = 0; idx < s.length; idx++) {
            const ch = s[idx];

            if (escaped) {
                current += ch;
                escaped = false;
                continue;
            }

            if (ch === ESCAPE_CHARACTER) {
                current += ch;
                escaped = true;
                continue;
            }

            if (ch === this.delimiter) {
                components.push(current);
                current = "";
                continue;
            }

            current += ch;
        }
        if (s.length > 0 || components.length === 0) {
            components.push(current);
        }

        if (!Number.isInteger(i) || i < 0 || i >= components.length) {
            throw new Error("component index out of range");
        }

        components.splice(i, 1);

        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    public concat(other: Name): void {
        super.concat(other);
    }

}