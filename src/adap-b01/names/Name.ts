export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    constructor(other: string[], delimiter?: string) {
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
        if (!Array.isArray(other)) {
            throw new Error("other must be an array of strings");
        }

        this.components = other.map(c => c.trim());
    }
        toString(): string {
            return this.components.join(this.delimiter);
    }
    

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        if (!this.components || this.components.length === 0) {
            return "";
        }
    return this.components.join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    public asDataString(): string {
        if (!this.components || this.components.length === 0) {
            return "";
        }

        const delimiter = DEFAULT_DELIMITER;

        const escapedComponents = this.components.map(c =>c
        .replace(/\\/g, "\\\\") 
        .replace(new RegExp(`\\${delimiter}`, "g"), `\\${delimiter}`) // 再转义分隔符
        );
        return escapedComponents.join(delimiter);
    }

    /** Returns properly masked component string */
    public getComponent(i: number): string {
        if (!Number.isInteger(i) || i < 0 || i >= this.components.length) {
            throw new Error("component index out of range");
        }
    return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    public setComponent(i: number, c: string): void {
        if (!Number.isInteger(i) || i < 0 || i >= this.components.length) {
            throw new Error("component index out of range");
        }
        if (typeof c !== "string") {
            throw new Error("component must be a string");
        }
    }

     /** Returns number of components in Name instance */
     public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    public insert(i: number, c: string): void {
        if (!Number.isInteger(i) || i < 0 || i > this.components.length) {
            throw new Error("component index out of range");
        }
        if (typeof c !== "string") {
            throw new Error("component must be a string");
        }

        let escaped = false;
        for (let k = 0; k < c.length; k++) {
            const ch = c[k];

        if (escaped) {
            escaped = false;
            continue;
        }

        if (ch === "\\") {
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

    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
        if (typeof c !== "string") {
            throw new Error("component must be a string");
        }
        let escaped = false;
        for (let k = 0; k < c.length; k++) {
            const ch = c[k];

            if (escaped) {            // 当前字符被转义
                escaped = false;
                continue;
            }
            if (ch === "\\") {        // 开启转义
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

    public remove(i: number): void {
        if (!Number.isInteger(i) || i < 0 || i >= this.components.length) {
            throw new Error("component index out of range");
        }
        this.components.splice(i, 1);
    }

}
