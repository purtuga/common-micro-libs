import { GLOBAL } from "./getGlobal"
import { FakeIterator } from "./Iterator";

//============================================================
const UNIQUE = Math.random().toString(36).substring(7);
let COUNTER = 1;
const SYMBOL_PROTOTYPE = {
    toString() {
        return `Symbol(${this.description}).${this._id}`;
    },
    valueOf() {
        return this.toString();
    }
};


export const Symbol = GLOBAL.Symbol || FakeSymbol;
export default Symbol;

export function FakeSymbol(description) {
    if (this instanceof FakeSymbol) {
        throw new TypeError("FakeSymbol is not a constructor");
    }
    return Object.create(SYMBOL_PROTOTYPE, {
        description: {
            value: arguments.length ? description : ""
        },
        _id: {
            value: `${UNIQUE}.${COUNTER++}`
        }
    });
}

FakeIterator.iterator = FakeIterator;
