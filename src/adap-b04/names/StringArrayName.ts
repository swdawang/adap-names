import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);

        IllegalArgumentException.assert(source != null, "source cannot be null");

        this.components = [];
        for (const c of source) {
            IllegalArgumentException.assert(c != null, "component cannot be null");
        
            this.assertIsProperlyMasked(c);
            this.components.push(c);
        }

        this.assertClassInvariants();
    }

    public clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
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
        return super.getDelimiterCharacter();
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertValidIndex(i);
        IllegalArgumentException.assert(c != null, "component cannot be null");

        this.assertIsProperlyMasked(c);
        this.components[i] = c;
        this.assertClassInvariants();
    }

    public insert(i: number, c: string) {
        this.assertValidIndexForInsert(i);
        IllegalArgumentException.assert(c != null, "component cannot be null");

        this.assertIsProperlyMasked(c);
        this.components.splice(i, 0, c);
        this.assertClassInvariants();
    }

    public append(c: string) {
        this.insert(this.components.length, c);
    }

    public remove(i: number) {
        this.assertValidIndex(i);
        this.components.splice(i, 1);
        this.assertClassInvariants();
    }

    public concat(other: Name): void {
        super.concat(other);
    }

    // ===== Helper: index checks =====

    private assertValidIndex(i: number): void {
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.components.length,
            "index out of range"
        );
    }

    private assertValidIndexForInsert(i: number): void {
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i <= this.components.length,
            "index out of range for insert"
        );
    }
}