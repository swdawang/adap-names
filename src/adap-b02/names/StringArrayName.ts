import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        this.components = source;
        if (delimiter) {
            this.delimiter = delimiter;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    public asDataString(): string {
        return this.components.map(x => x.replace(this.delimiter, ESCAPE_CHARACTER + this.delimiter)).join(this.delimiter)
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0; 
    }

    public getNoComponents(): number {
        return this.components.length;
        
    }

    public getComponent(i: number): string {
        if(i < 0 || i >= this.components.length) {
            throw new Error("Index: " + i + " out of bounds for length " + this.components.length);
        }
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if(i < 0 || i >= this.components.length) {
            throw new Error("Index: " + i + " out of bounds for length " + this.components.length);
        }
        this.components[i]=c;
    }

    public insert(i: number, c: string): void {
        if(i < 0 || i > this.components.length) {
            throw new Error("Index: " + i + " out of bounds for length " + this.components.length);
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
         this.components.push(c);
    }

    public remove(i: number): void {
        if(i < 0 || i >= this.components.length) {
            throw new Error("Index: " + i + " out of bounds for length " + this.components.length);
        }
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        if(this.delimiter !== other.getDelimiterCharacter()) {
            throw new Error("Can't concatenate names with different delimiters");
        }
        for (let i=0; i< other.getNoComponents(); i++){
            this.components.push(other.getComponent(i));
        }

    }
}