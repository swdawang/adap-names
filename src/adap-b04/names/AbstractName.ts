import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

     constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(delimiter != null, "delimiter cannot be null or undefined");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be exactly one character");
        IllegalArgumentException.assert(delimiter !== ESCAPE_CHARACTER, "delimiter must not be the escape character");

        this.delimiter = delimiter;
    }

    abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(delimiter != null, "delimiter cannot be null or undefined");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be exactly one character");
    
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        const unmasked = components.map(c => this.unmask(c));
        return unmasked.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        return components.join(this.delimiter);
    }

    public isEqual(other: Name): boolean {
        IllegalArgumentException.assert(other != null, "other cannot be null or undefined");
    
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
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
        IllegalArgumentException.assert(other != null, "other cannot be null or undefined");
        
        const oldLength = this.getNoComponents();
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
        
        MethodFailedException.assert(this.getNoComponents() === oldLength + other.getNoComponents(), "concat did not increase length correctly");
        this.assertClassInvariants();
    }

    protected unmask(component: string): string {
        let result = '';
        let i = 0;

        while (i < component.length) {
            if (component[i] === ESCAPE_CHARACTER && i + 1 < component.length) {
                // Found escape char + next char exists: take next char, skip both
                result += component[i + 1];
                i += 2;
            } else {
                // Normal char or escape at end: take current char, move forward
                result += component[i];
                i++;
            }
        }
        return result;
    }

    protected mask(component: string, delimiter: string): string {
        let result = '';
        for (let i = 0; i < component.length; i++) {
            const char = component[i];
            // escape the delimiter and the escape character
            if (char === delimiter || char === ESCAPE_CHARACTER) {
                result += ESCAPE_CHARACTER;
            }
            result += char;
        }
        return result;
    }

    protected assertIsProperlyMasked(component: string): void {
        for (let i = 0; i < component.length; i++) {
            if (component[i] === this.delimiter) {
                let escapes = 0;
                let pos = i - 1;
                while (pos >= 0 && component[pos] === ESCAPE_CHARACTER) {
                    escapes++;
                    pos--;
                }
                if (escapes % 2 === 0) {
                    IllegalArgumentException.assert(false, "component contains unmasked delimiter");
                }
            }
        }

        // Check: Component must not end with an odd number of escape characters (dangling escape)
        let escapes = 0;
        for (let i = component.length - 1; i >= 0; i--) {
            if (component[i] === ESCAPE_CHARACTER) {
                escapes++;
            } else {
                break;
            }
        }
        if (escapes % 2 !== 0) {
            IllegalArgumentException.assert(false, "component ends with unmasked escape character");
        }
    }

    protected assertClassInvariants(): void {
        InvalidStateException.assert(this.delimiter != null, "delimiter cannot be null or undefined");
        InvalidStateException.assert(this.delimiter.length === 1, "delimiter must be exactly one character");
        InvalidStateException.assert(this.delimiter !== ESCAPE_CHARACTER, "delimiter must not be the escape character");
    }
    
}