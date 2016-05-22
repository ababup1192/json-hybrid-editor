import {JValue, JNumber, JString, JBool, JNull, JArray, JField, JObject, JsonAst} from "../src/scripts/jsonAst";

describe("Json", () => {
    describe("TextToAST", () => {
        describe("JNumber", () => {
            it("should return `JNumber`", () => {
                const actual: JNumber = JsonAst.toAst(JSON.parse(JSON.stringify(123))) as JNumber;
                chai.assert.strictEqual(actual.value, new JNumber(123).value);
            });
        });
        describe("JString", () => {
            it("should return `JString`", () => {
                const actual: JString = JsonAst.toAst(JSON.parse(JSON.stringify("abc"))) as JString;
                chai.assert.strictEqual(actual.value, new JString("abc").value);
            });
        });
        describe("JBool", () => {
            it("should return `JBool`", () => {
                const actual: JBool = JsonAst.toAst(JSON.parse(JSON.stringify(true))) as JBool;
                chai.assert.strictEqual(actual.value, new JBool(true).value);
            });
        });
        describe("JNull", () => {
            it("should return `JNull`", () => {
                const actual: JNull = JsonAst.toAst(JSON.parse(JSON.stringify(null))) as JNull;
                chai.assert.strictEqual(actual instanceof JNull, true);
            });
        });
        describe("JArray", () => {
            it("should return `JArray`", () => {
                const jArray: JArray = JsonAst.toAst(
                    JSON.parse(JSON.stringify([1, 2, 3, 4, 5]))
                ) as JArray;
                const actual: number[] = jArray.arr.map((v: JValue) => (v as JNumber).value);
                chai.assert.strictEqual(JSON.stringify(actual), JSON.stringify([1, 2, 3, 4, 5]));
            });
        });
        describe("JObject", () => {
            it("should return `JObject`", () => {
                const jObject: JObject = JsonAst.toAst(
                    JSON.parse(JSON.stringify({ a: 123, b: 456, c: 789 }))) as JObject;
                const actual: { key: string, value: number }[] = jObject.obj.map((v: JField) => {
                    return { key: v.key, value: (v.value as JNumber).value };
                });

                chai.assert.strictEqual(JSON.stringify(actual), JSON.stringify([
                    { key: "a", value: 123 },
                    { key: "b", value: 456 },
                    { key: "c", value: 789 }
                ]));
            });
        });
        describe("Complex JObject", () => {
            it("should return `JObject`", () => {
                const jObject: JObject = JsonAst.toAst(
                    JSON.parse(JSON.stringify({ a: "start", b: { x: [1], y: [true], z: [null] }, c: "end" }))
                ) as JObject;
                const toObject: (jValue: JValue) => { key: string, value: any } = (jValue: JValue) => {
                    if (jValue instanceof JNumber) {
                        return { key: "", value: (jValue as JNumber).value };
                    } else if (jValue instanceof JString) {
                        return { key: "", value: (jValue as JString).value };
                    } else if (jValue instanceof JBool) {
                        return { key: "", value: (jValue as JBool).value };
                    } else if (jValue instanceof JNull) {
                        return { key: "", value: null };
                    } else if (jValue instanceof JArray) {
                        return { key: "", value: (jValue as JArray).arr.map((value: JValue) => toObject(value)) };
                    } else {
                        return {
                            key: "", value: (jValue as JObject).obj.map((field: JField) => {
                                return { key: field.key, value: toObject(field.value) };
                            })
                        };
                    }
                };

                chai.assert.strictEqual(JSON.stringify(toObject(jObject)), JSON.stringify(
                    {
                        key: "", value: [
                            { key: "a", value: { key: "", value: "start" } },
                            {
                                key: "b", value: {
                                    key: "",
                                    value: [
                                        { key: "x", value: { key: "", value: [{ key: "", value: 1 }] } },
                                        { key: "y", value: { key: "", value: [{ key: "", value: true }] } },
                                        { key: "z", value: { key: "", value: [{ key: "", value: null }] } }
                                    ],
                                },
                            },
                            { key: "c", value: { key: "", value: "end" } }
                        ],
                    }
                ));
            });
        });
    });
    describe("ASTToText", () => {
        describe("JNumber", () => {
            it("should return `number` text", () => {
                const actual: string = new JNumber(123).toString();
                chai.assert.strictEqual(actual, JSON.stringify(123));
            });
        });
        describe("JString", () => {
            it("should return `string` text", () => {
                const actual: string = new JString("abc").toString();
                chai.assert.strictEqual(actual, JSON.stringify("abc"));
            });
        });
        describe("JBool", () => {
            it("should return `bool` text", () => {
                const actual: string = new JBool(true).toString();
                chai.assert.strictEqual(actual, JSON.stringify(true));
            });
        });
        describe("JNull", () => {
            it("should return `null` text", () => {
                const actual: string = new JNull().toString();
                chai.assert.strictEqual(actual, JSON.stringify(null));
            });
        });
        describe("JArray", () => {
            it("should return `array` text", () => {
                const actual: string = new JArray([new JNumber(1),
                    new JNumber(2), new JNumber(3)]).toString();
                chai.assert.strictEqual(actual, JSON.stringify([1, 2, 3]));
            });
        });
        describe("JObject", () => {
            it("should return `object` text", () => {
                const actual: string = new JObject([
                    new JField("a", new JNumber(123)),
                    new JField("b", new JNumber(456)),
                    new JField("c", new JNumber(789)),
                ]).toString();
                chai.assert.strictEqual(actual, JSON.stringify({ a: 123, b: 456, c: 789 }));
            });
        });
        describe("Complex JObject", () => {
            it("should return `object` text", () => {
                const actual: string = new JObject([
                    new JField("a", new JString("start")),
                    new JField("b", new JObject([
                        new JField("x", new JArray([new JNumber(1)])),
                        new JField("y", new JArray([new JBool(true)])),
                        new JField("z", new JArray([new JNull()])),
                    ])),
                    new JField("c", new JString("end")),
                ]).toString();
                chai.assert.strictEqual(actual, JSON.stringify({ a: "start", b: { x: [1], y: [true], z: [null] }, c: "end" }));
            });
        });
    });
    describe("JsonAst Update", () => {
        describe("JNumber", () => {
            it("should return new `JNumber`", () => {
                const actual: JNumber = new JNumber(1, "1").update("1", 100);
                chai.assert.strictEqual(actual.value, new JNumber(100).value);
            });
        });
        describe("JString", () => {
            it("should return new `JString`", () => {
                const actual: JString = new JString("abc", "1").update("1", "def");
                chai.assert.strictEqual(actual.value, new JString("def").value);
            });
        });
        describe("JBool", () => {
            it("should return new `JBool`", () => {
                const actual: JBool = new JBool(true, "1").update("1", false);
                chai.assert.strictEqual(actual.value, new JBool(false).value);
            });
        });
        describe("JNull", () => {
            it("should return new `JNumber`", () => {
                const actual: JValue = new JNull("1").update("1", new JNumber(1));
                chai.assert.strictEqual((actual as JNumber).value, new JNumber(1).value);
            });
        });
        describe("JArray", () => {
            it("should return new `JArray`", () => {
                const actual: JArray = new JArray([new JNumber(1, "2"), new JNumber(2, "3"),
                    new JNumber(3, "4")]).update("3", 100);
                chai.assert.strictEqual(
                    actual.toString(),
                    JSON.stringify([1, 100, 3]));
            });
        });
        describe("JField", () => {
            it("should return new `JField`", () => {
                const actual: JField = new JField("abc", new JNumber(1, "2"), "1")
                    .update("1", "def").update("2", 2) as JField;
                chai.assert.strictEqual(
                    actual.toString(),
                    JSON.stringify({ def: 2 }));
            });
        });
        describe("JObject", () => {
            it("should return new `JObject`", () => {
                const actual: JObject = new JObject([
                    new JField("a", new JNumber(1, "1a"), "1"),
                    new JField("b", new JNumber(2, "2a"), "2"),
                    new JField("c", new JNumber(3, "3a"), "3"),
                    new JField("d", new JNumber(4, "4a"), "4"),
                ]).update("3a", 100);
                chai.assert.strictEqual(
                    actual.toString(),
                    JSON.stringify({ a: 1, b: 2, c: 100, d: 4 }));
            });
        });
    });
});
