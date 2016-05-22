import * as Bacon from "baconjs";
import {Dispatcher} from "./dispatcher";
import {Constant} from "./constant";
import {JValue, JNumber, JString, JBool, JNull, JArray, JField, JObject, JsonAst} from "./jsonAst";

export class ActionCreator {
    private d: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.d = dispatcher;
    }

    public changeText(text: string): void {
        this.d.push(Constant.CHANGE_TEXT, text);
    }

    public createProperty(initialValue: string): Bacon.Property<JValue, JValue> {
        try {
            return Bacon.update<any, any, JValue>(JsonAst.toAst(JSON.parse(initialValue)),
                [this.d.stream(Constant.CHANGE_TEXT)], this._changeText
            );
        } catch (e) {
            return Bacon.update<any, any, JValue>(undefined,
                [this.d.stream(Constant.CHANGE_TEXT)], this._changeText
            );
        }
    }

    private _changeText(ast: JValue, json: string): JValue {
        try {
            return JsonAst.toAst(JSON.parse(json));
        } catch (e) {
            return ast;
        }
    }
}
