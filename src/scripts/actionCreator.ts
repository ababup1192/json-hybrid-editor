import * as Bacon from "baconjs";
import {Dispatcher} from "./dispatcher";
import {Constant} from "./constant";
import {JValue, JNumber, JString, JBool, JNull, JArray, JField, JObject, JsonAst} from "./jsonAst";
import {Utils} from "./utils";

interface IUpdateObject {
    id: string;
    newValue: any;
}
export interface AppEventObject {
    ast: JValue;
    isTextChange: boolean;
    isVisualChange: boolean;
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

    public createProperty(initialValue: string): Bacon.Property<JValue, AppEventObject> {
        const json: any = Utils.forceEval<String, JValue>(JSON.parse, initialValue);
        const appEventObject: AppEventObject = {
            ast: JsonAst.toAst(json),
            isTextChange: true,
            isVisualChange: true,
        }
        return Bacon.update<JValue, string, IUpdateObject, any>(JsonAst.toAst(json),
            [this.d.stream(Constant.CHANGE_TEXT)], this._changeText,
            [this.d.stream(Constant.UPDATE_AST)], this._updateAst
        );
    }

    private _changeText(ast: JValue, json: string): AppEventObject {
        try {
            return {
                ast: JsonAst.toAst(JSON.parse(json)),
                isTextChange: false,
                isVisualChange: true,
            };
        } catch (e) {
            return { ast: ast, isTextChange: false, isVisualChange: false };
        }
    }

    private _updateAst(appEventObject: AppEventObject, updateObject: IUpdateObject): AppEventObject {
        const {id, newValue}: IUpdateObject = updateObject;
        return {
            ast: appEventObject.ast.update(id, newValue),
            isTextChange: true,
            isVisualChange: false,
        };
    }
}
