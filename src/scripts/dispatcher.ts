import * as Bacon from "baconjs";

interface IHundler {
    [index: string]: Bacon.Bus<any, any>;
}

export class Dispatcher {
    private hundlers: IHundler;

    constructor() {
        this.hundlers = {};
    }

    public stream(name: string): Bacon.Bus<any, any> {
        return this.bus(name);
    }

    public push(name: string, value: any): void {
        this.bus(name).push(value);
    }

    public plug(name: string, value: any): void {
        this.bus(name).plug(value);
    }

    private bus(name: string): Bacon.Bus<any, any> {
        return this.hundlers[name] = this.hundlers[name] || new Bacon.Bus();
    }
} 