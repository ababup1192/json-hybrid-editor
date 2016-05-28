import {JValue, JNumber, JString, JBool, JNull, JArray, JField, JObject, JsonAst} from "../src/scripts/jsonAst";
import {ActionCreator, AppEventObject} from "../src/scripts/actionCreator";
import {Dispatcher} from "../src/scripts/dispatcher";

describe("ActioCreator", () => {
    describe("Parse Text", () => {
        it("should return JsonAst", () => {
            const dispatcher: Dispatcher = new Dispatcher();
            const action: ActionCreator = new ActionCreator(dispatcher);
            let actual: JValue = undefined;
            action.createProperty(`{"a": 123}`).onValue((value: AppEventObject) => {
                actual = value.ast;
            });
            chai.assert.strictEqual(actual.toString(), new JObject([new JField("a", new JNumber(123))]).toString());
        });
    });
    describe("changeText", () => {
        it("should return new JsonAst", () => {
            const dispatcher: Dispatcher = new Dispatcher();
            const action: ActionCreator = new ActionCreator(dispatcher);
            let actual: JValue = undefined;
            action.createProperty(`{"a": 123}`).onValue((value: AppEventObject) => {
                actual = value.ast;
            });
            action.changeText(`{"b": 456}`);
            chai.assert.strictEqual(actual.toString(), new JObject([new JField("b", new JNumber(456))]).toString());
        });
    });
    describe("updateJsonAst", () => {
        it("should return new JsonAst", () => {
            const dispatcher: Dispatcher = new Dispatcher();
            const action: ActionCreator = new ActionCreator(dispatcher);
            let id: string = "";
            let actual: JValue = undefined;
            action.createProperty(`{"a": 123}`).onValue((value: AppEventObject) => {
                id = ((value.ast as JObject).obj[0].value as JNumber).id;
                actual = value.ast;
            });
            action.updateAst({id: id, newValue: 456});
            chai.assert.strictEqual(actual.toString(), new JObject([new JField("a", new JNumber(456))]).toString());
        });
    });
});
