import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";


export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);

        IllegalArgumentException.assert(
            source != null,
            "source cannot be null or undefined"
        );

        this.name = source;

        const components = this.splitComponents(this.name);
        for (const c of components) {
            IllegalArgumentException.assert(c != null, "component cannot be null");
            this.assertIsProperlyMasked(c);
            this.assertClassInvariants();
        }

        this.noComponents = components.length;
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
        return super.isEmpty();
    }

    public getDelimiterCharacter(): string {
        return super.getDelimiterCharacter();
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i);
        const components = this.splitComponents(this.name);
        return components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertValidIndex(i);
        IllegalArgumentException.assert(c != null, "component cannot be null");

        this.assertIsProperlyMasked(c);

        const components = this.splitComponents(this.name);
        components[i] = c;
        this.rebuildFromComponents(components);
    }

    public insert(i: number, c: string) {
        this.assertValidIndexForInsert(i);
        IllegalArgumentException.assert(c != null, "component cannot be null");

        this.assertIsProperlyMasked(c);

        const components = this.splitComponents(this.name);
        components.splice(i, 0, c);
        this.rebuildFromComponents(components);
    }

    public append(c: string) {
        this.insert(this.noComponents, c);
    }

    public remove(i: number) {
        this.assertValidIndex(i);

        const components = this.splitComponents(this.name);
        components.splice(i, 1);
        this.rebuildFromComponents(components);
    }

    public concat(other: Name): void {
        super.concat(other);
    }

    private splitComponents(data: string): string[] {
        if (data.length === 0) {
            return [];
        }

        const result: string[] = [];
        let current = "";
        let escaped = false;

        for (let i = 0; i < data.length; i++) {
            const ch = data[i];

            if (escaped) {
                current += ESCAPE_CHARACTER;
                current += ch;
                escaped = false;
            } else if (ch === ESCAPE_CHARACTER) {
                escaped = true;
            } else if (ch === this.delimiter) {
                result.push(current);
                current = "";
            } else {
                current += ch;
            }
        }

        IllegalArgumentException.assert(
            !escaped,
            "name string ends with unmasked escape character"
        );

        result.push(current);
        return result;
    }

    private rebuildFromComponents(components: string[]): void {
        for (const c of components) {
            IllegalArgumentException.assert(c != null, "component cannot be null");
            this.assertIsProperlyMasked(c);
        }

        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
        this.assertClassInvariants();
    }

    private assertValidIndex(i: number): void {
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.noComponents,
            "index out of range"
        );
    }

    private assertValidIndexForInsert(i: number): void {
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i <= this.noComponents,
            "index out of range for insert"
        );
    }

}