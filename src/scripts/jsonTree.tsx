import * as React from "react";
import * as ReactDOM from "react-dom";
import {JValue, JNumber, JString, JBool, JNull, JArray, JField, JObject} from "./jsonAst";

export namespace JsonTree {
    export function view(): void {
        $(".tree li:has(ul)").addClass("parent_li").find(" > span").attr("title", "Collapse this branch");
        $(".tree li.parent_li > span").on("click", function (e) {
            const children: JQuery = $(this).parent("li.parent_li").find(" > ul > li");
            if (children.is(":visible")) {
                children.hide("fast");
                $(this).attr("title", "Expand this branch").find(" > i").addClass("icon-plus-sign").removeClass("icon-minus-sign");
            } else {
                children.show("fast");
                $(this).attr("title", "Collapse this branch").find(" > i").addClass("icon-minus-sign").removeClass("icon-plus-sign");
            }
            e.stopPropagation();
        });
    }
}

interface IJNumberProps {
    jNumber: JNumber;
    onUpdateAst: (id: string, num: number) => void;
}

class JNumberComponent extends React.Component<IJNumberProps, any> {
    constructor(props: IJNumberProps) {
        super(props);
    }
    public render(): JSX.Element {
        return <div className="input-group">
            <span className="input-group-addon">
                <span className="glyphicon glyphicon-sort-by-order"></span>
            </span>
            <input type="number" className="form-control"
                value={ this.props.jNumber.value } onChange={ this.onChange.bind(this) } />
        </div>;
    }
    private onChange(e): void {
        const num: number = Number(e.target.value);
        if (this.props.onUpdateAst) {
            this.props.onUpdateAst(this.props.jNumber.id, num);
        }
    }
}

interface IJStringProps {
    jString: JString;
    onUpdateAst: (id: string, text: string) => void;
}

class JStringComponent extends React.Component<IJStringProps, any> {
    constructor(props: IJStringProps) {
        super(props);
    }
    public render(): JSX.Element {
        return <div className="input-group">
            <span className="input-group-addon">
                <span className="glyphicon glyphicon-text-background"></span>
            </span>
            <input type="text" className="form-control"
                value={ this.props.jString.value } onChange={ this.onChange.bind(this) } />
        </div>;
    }
    private onChange(text: string): void {
        if (this.props.onUpdateAst) {
            this.props.onUpdateAst(this.props.jString.id, text);
        }
    }
}

interface IJBoolProps {
    jBool: JBool;
    onUpdateAst: (id: string, value: boolean) => void;
}

class JBoolComponent extends React.Component<IJBoolProps, any> {
    constructor(props: IJBoolProps) {
        super(props);
    }
    public render(): JSX.Element {
        return <div className="input-group">
            <span className="input-group-addon">
                <span className="glyphicon glyphicon-text-background"></span>
            </span>
            <input type="text" className="form-control"
                value={ this.props.jBool.value } onClick={ this.onChange.bind(this) } />
        </div>;
    }
    private onChange(value: boolean): void {
        if (this.props.onUpdateAst) {
            this.props.onUpdateAst(this.props.jBool.id, value);
        }
    }
}

interface IJNullProps {
    jNull: JNull;
}

class JNullComponent extends React.Component<IJNullProps, any> {
    constructor(props: IJNullProps) {
        super(props);
    }
    public render(): JSX.Element {
        return <button type="button"
            className="btn btn-default">null</button>;
    }
}

interface IArrayFieldProps {
    index: number;
    jValue: JValue;
    onUpdateAst: (id: string, value: any) => void;
}

class JArrayFieldComponent extends React.Component<IArrayFieldProps, any> {
    constructor(props: IArrayFieldProps) {
        super(props);
    }
    public render(): JSX.Element {
        return <div className="input-group json-field" key={ this.props.jValue.id }>
            <span className="input-group-addon key"><span className="index-text">{ this.props.index }</span></span>
            <div className="input-group">
                { this.selectComponent(this.props.jValue) }
            </div>
        </div>;
    }
    private selectComponent(jValue: JValue): JSX.Element {
        if (jValue instanceof JNumber) {
            return <JNumberComponent jNumber={ (jValue as JNumber) } onUpdateAst={ this.props.onUpdateAst } />;
        } else if (jValue instanceof JString) {
            return <JStringComponent jString={ (jValue as JString) } onUpdateAst={ this.props.onUpdateAst } />;
        } else if (jValue instanceof JBool) {
            return <JBoolComponent jBool={ (jValue as JBool) } onUpdateAst={ this.props.onUpdateAst } />;
        } else if (jValue instanceof JNull) {
            return <JNullComponent jNull={jValue as JNull }  />;
        } else if (jValue instanceof JArray) {
            return <JArrayComponent jArray={ jValue as JArray }  onUpdateAst={ this.props.onUpdateAst } />;
        } else {
            return <JObjectComponent jObject={ jValue as JObject } onUpdateAst={ this.props.onUpdateAst } />;
        }
    }
}

interface IArrayProps {
    jArray: JArray;
    onUpdateAst: (id: string, value: any) => void;
}

class JArrayComponent extends React.Component<IArrayProps, any> {
    constructor(props: IArrayProps) {
        super(props);
    }
    public render(): JSX.Element {
        return <div className="tree well">
            <ul>
                <li>
                    <span className="label"><i className="icon-folder-open"></i>Array[]</span>
                    <ul>
                        { this.toJArrayFieldComponent(this.props.jArray.arr) }
                    </ul>
                </li>
            </ul>
        </div>;
    }
    private toJArrayFieldComponent(arr: JValue[]): JSX.Element[] {
        return arr.map((value: JValue, index: number) => <li>
            <JArrayFieldComponent index={index} jValue={value} onUpdateAst={ this.props.onUpdateAst } />
        </li>);
    }
}

interface IObjectFieldProps {
    jField: JField;
    onUpdateAst: (id: string, value: any) => void;
}

class JObjectFieldComponent extends React.Component<IObjectFieldProps, any> {
    constructor(props: IObjectFieldProps) {
        super(props);
    }
    public render(): JSX.Element {
        return <div className="input-group json-field" key={ this.props.jField.id }>
            <span className="input-group-addon key"><span className="key-text">{ this.props.jField.key }</span></span>
            <div className="input-group">
                { this.selectComponent(this.props.jField.value) }
            </div>
        </div>;
    }
    private selectComponent(jValue: JValue): JSX.Element {
        if (jValue instanceof JNumber) {
            return <JNumberComponent jNumber={ (jValue as JNumber) } onUpdateAst={ this.props.onUpdateAst } />;
        } else if (jValue instanceof JString) {
            return <JStringComponent jString={ (jValue as JString) } onUpdateAst={ this.props.onUpdateAst } />;
        } else if (jValue instanceof JBool) {
            return <JBoolComponent jBool={ (jValue as JBool) } onUpdateAst={ this.props.onUpdateAst } />;
        } else if (jValue instanceof JNull) {
            return <JNullComponent jNull={jValue as JNull }  />;
        } else if (jValue instanceof JArray) {
            return <JArrayComponent jArray={ jValue as JArray }  onUpdateAst={ this.props.onUpdateAst } />;
        } else {
            return <JObjectComponent jObject={ jValue as JObject } onUpdateAst={ this.props.onUpdateAst } />;
        }
    }
}

interface IObjectProps {
    jObject: JObject;
    onUpdateAst: (id: string, value: any) => void;
}

class JObjectComponent extends React.Component<IObjectProps, any> {
    constructor(props: IObjectProps) {
        super(props);
    }
    public render(): JSX.Element {
        return <div className="tree well">
            <ul>
                <li>
                    <span className="label"><i className="icon-folder-open"></i>Object {  }</span>
                    <ul>
                        { this.toJObjectFieldComponent(this.props.jObject.obj) }
                    </ul>
                </li>
            </ul>
        </div>;
    }
    private toJObjectFieldComponent(obj: JField[]): JSX.Element[] {
        return obj.map((field: JField) => <li>
            <JObjectFieldComponent jField={ field } onUpdateAst={ this.props.onUpdateAst } />
        </li>);
    }
}

export { JNumberComponent, JStringComponent, JBoolComponent, JNullComponent, JArrayComponent, JObjectComponent }
