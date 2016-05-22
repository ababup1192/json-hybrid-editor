import * as Bacon from "baconjs";
import {Dispatcher} from "./dispatcher";
import {Constant} from "./constant";
import {JValue, JNumber, JString, JBool, JNull, JArray, JField, JObject, JsonAst} from "./jsonAst";
import {Utils} from "./utils"

export class ActionCreator {
    private d: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.d = dispatcher;
    }

    public changeText(text: string): void {
        this.d.push(Constant.CHANGE_TEXT, text);
    }

    public createProperty(initialValue: string): Bacon.Property<JValue, JValue> {
        const json: any = Utils.forceEval<String, JValue>(JSON.parse, initialValue);
        return Bacon.update<any, any, JValue>(JsonAst.toAst(json),
            [this.d.stream(Constant.CHANGE_TEXT)], this._changeText
        );
    }

    private _changeText(ast: JValue, json: string): JValue {
        try {
            return JsonAst.toAst(JSON.parse(json));
        } catch (e) {
            return ast;
        }
    }
}
