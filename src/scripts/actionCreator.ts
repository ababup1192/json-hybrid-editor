import * as Bacon from "baconjs";
import {Dispatcher} from "./dispatcher";
import {Constant} from "./constant";

export class ActionCreator {
    private d: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.d = dispatcher;
    }

    public changeText(text: string): void {
        this.d.push(Constant.CHANGE, text);
    }

    public createProperty(initialValue: string): Bacon.Property<any, any> {
        return this.d.stream(Constant.CHANGE).
            scan<string>(initialValue, (_: string, next: string) => next);
    }
}
