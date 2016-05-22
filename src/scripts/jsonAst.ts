import {Utils} from "./utils";

abstract class JValue {
    public id: string;
    constructor(id: string = Utils.uuid()) {
        this.id = id;
    }
    public abstract toString(): string;
    public abstract update(id: string, newValue: any): JValue;
}

class JNumber extends JValue {
    public value: number;
    constructor(value: number, id?: string) {
        super(id);
        this.value = value;
    }
    public toString(): string {
        return this.value.toString();
    }
    public update(id: string, newValue: any): JNumber {
        if (typeof newValue === "number" && this.id === id) {
            return new JNumber(newValue);
        } else {
            return this;
        }
    }
}

class JString extends JValue {
    public value: string;
    constructor(value: string, id?: string) {
        super(id);
        this.value = value;
    }
    public toString(): string {
        return `"${this.value}"`;
    }
    public update(id: string, newValue: any): JString {
        if (typeof newValue === "string" && this.id === id) {
            return new JString(newValue);
        } else {
            return this;
        }
    }
}

class JBool extends JValue {
    public value: boolean;
    constructor(value: boolean, id?: string) {
        super(id);
        this.value = value;
    }
    public toString(): string {
        return JSON.stringify(this.value);
    }
    public update(id: string, newValue: any): JBool {
        if (typeof newValue === "boolean" && this.id === id) {
            return new JBool(newValue);
        } else {
            return this;
        }
    }
}

class JNull extends JValue {
    constructor(id?: string) {
        super(id);
    }
    public toString(): string {
        return "null";
    }
    public update(id: string, newValue: JValue): JValue {
        if (this.id === id) {
            return newValue;
        } else {
            return this;
        }
    }
}

class JArray extends JValue {
    public arr: JValue[];
    constructor(arr: JValue[], id?: string) {
        super(id);
        this.arr = arr;
    }
    public toString(): string {
        return `[${this.arr.map((value: JValue) => value.toString()).join(", ")}]`;
    }
    public update(id: string, newValue: any): JValue {
        if (newValue instanceof JArray && this.id === id) {
            return newValue;
        } else {
            return new JArray(this.arr.map((v: JValue) => v.update(id, newValue)));
        }
    }
}

class JField extends JValue {
    public name: string;
    public value: JValue;
    constructor(name: string, value: JValue, id?: string) {
        super(id);
        this.name = name;
        this.value = value;
    }
    public toString(): string {
        return `${this.name}: ${this.value.toString()}`;
    }
    public update(id: string, newValue: any): JValue {
        if (newValue instanceof JField && this.id === id) {
            const newField: JField = newValue as JField;
            return new JField(newField.name, newField.value);
        } else {
            return new JField(this.name, this.value.update(id, newValue));
        }
    }
}

class JObject extends JValue {
    public obj: JField[];
    constructor(obj: JField[], id?: string) {
        super(id);
        this.obj = obj;
    }
    public toString(): string {
        return `{${this.obj.map((value: JField) => value.toString()).join(", ")}}`;
    }
    public update(id: string, newValue: any): JValue {
        if (newValue instanceof JObject && this.id === id) {
            return new JObject((newValue as JObject).obj);
        } else {
            return new JObject(this.obj.map((v: JField) => v.update(id, newValue) as JField));
        }
    }
}

namespace JsonAst {
    "use strict";

    export function toAst(json: any): JValue {
        if (typeof json === "number") {
            return new JNumber(json as number);
        } else if (typeof json === "string") {
            return new JString(json as string);
        } else if (typeof json === "boolean") {
            return new JBool(json as boolean);
        } else if (Array.isArray(json)) {
            const arr: JValue[] = (json as any[]).map((v: any) => toAst(v));
            return new JArray(arr);
        } else if (json === null) {
            return new JNull();
        } else {
            const fields: JField[] = Object.keys(json).map((key: string) =>
                new JField(key, toAst(json[key]))
            );
            return new JObject(fields);
        }
    }


    export function toText(value: JValue): string {
        return "";
    }
}

export {JValue, JNumber, JString, JBool, JNull, JArray, JField, JObject, JsonAst}
