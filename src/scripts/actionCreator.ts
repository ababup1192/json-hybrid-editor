import * as Bacon from "baconjs";
import {Dispatcher} from "./dispatcher";
import {Constant} from "./constant";
import {JValue, JNumber, JString, JBool, JNull, JArray, JField, JObject, JsonAst} from "./jsonAst";
import {Utils} from "./utils";

interface IUpdateObject {
    id: string;
    newValue: any;
}

export class ActionCreator {
    private d: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.d = dispatcher;
    }

    public changeText(text: string): void {
        this.d.push(Constant.CHANGE_TEXT, text);
    }

    public updateAst(updateObject: IUpdateObject): void {
        this.d.push(Constant.UPDATE_AST, updateObject);
    }

    public createProperty(initialValue: string): Bacon.Property<JValue, JValue> {
        const json: any = Utils.forceEval<String, JValue>(JSON.parse, initialValue);
        return Bacon.update<JValue, string, IUpdateObject, JValue>(JsonAst.toAst(json),
            [this.d.stream(Constant.CHANGE_TEXT)], this._changeText,
            [this.d.stream(Constant.UPDATE_AST)], this._updateAst
        );
    }

    private _changeText(ast: JValue, json: string): JValue {
        try {
            return JsonAst.toAst(JSON.parse(json));
        } catch (e) {
            return ast;
        }
    }

    private _updateAst(ast: JValue, updateObject: IUpdateObject): JValue {
        const {id, newValue}: IUpdateObject = updateObject;
        return ast.update(id, newValue);
    }
}
