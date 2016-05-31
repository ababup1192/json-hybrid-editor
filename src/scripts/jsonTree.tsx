import * as React from "react";
import * as ReactDOM from "react-dom";
import {JValue, JNumber, JString, JBool, JNull, JArray, JField, JObject} from "./jsonAst";

export namespace JsonTree {
    export function view(): void {
        $(".tree li:has(ul)").addClass("parent_li").find(" > span").attr("title", "Collapse this branch");
        $(".tree li.parent_li > span").on("click", function (e: any): void {
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

class JNumberComponent extends React.Component<IJNumberProps, { num: number }> {
    constructor(props: IJNumberProps) {
        super(props);

        this.state = { num: this.props.jNumber.value };
    }

    public render(): JSX.Element {
        return <div className="input-group">
            <span className="input-group-addon">
                <span className="glyphicon glyphicon-sort-by-order"></span>
            </span>
            <input type="number" className="form-control"
                value={ this.state.num } onChange={ this.onChange.bind(this) } />
        </div>;
    }

    private onChange(e: any): void {
        const num: number = Number(e.target.value);
        this.setState({ num: num });
        if (this.props.onUpdateAst) {
            this.props.onUpdateAst(this.props.jNumber.id, num);
        }
    }
}

interface IJStringProps {
    jString: JString;
    onUpdateAst: (id: string, text: string) => void;
}

class JStringComponent extends React.Component<IJStringProps, { text: string }> {
    constructor(props: IJStringProps) {
        super(props);

        this.state = { text: this.props.jString.value };
    }
    public render(): JSX.Element {
        return <div className="input-group">
            <span className="input-group-addon">
                <span className="glyphicon glyphicon-text-background"></span>
            </span>
            <input type="text" className="form-control"
                value={ this.state.text } onChange={ this.onChange.bind(this) } />
        </div>;
    }
    private onChange(e: any): void {
        const text: string = e.target.value;
        this.setState({ text: text });
        if (this.props.onUpdateAst) {
            this.props.onUpdateAst(this.props.jString.id, text);
        }
    }
}

interface IJBoolProps {
    jBool: JBool;
    onUpdateAst: (id: string, value: boolean) => void;
}

class JBoolComponent extends React.Component<IJBoolProps, { value: boolean }> {
    constructor(props: IJBoolProps) {
        super(props);
        this.state = { value: props.jBool.value };
    }
    public render(): JSX.Element {
        return <div className="input-group">
            <input className="tgl tgl-skewed" type="checkbox"
                checked={ this.state.value } onChange={this.onChange.bind(this) } />
            <label className="tgl-btn" data-tg-off="false" data-tg-on="true"
                onClick={ this.onClick.bind(this) } />
        </div>;
    }
    private onClick(e: any): void {
        this.onChange(e);
    }
    private onChange(e: any): void {
        const nowValue: boolean = !this.state.value;
        this.setState({ value: nowValue });
        if (this.props.onUpdateAst) {
            this.props.onUpdateAst(this.props.jBool.id, nowValue);
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
        return <div className="input-group json-field">
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
    public componentDidMount(): void {
        // open-close-child
        JsonTree.view();
    }
    public render(): JSX.Element {
        return <div className="tree">
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
        return arr.map((value: JValue, index: number) => <li key={value.id}>
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
    public shouldComponentUpdate(nextProps: IObjectFieldProps, nextState: any): boolean {
        console.log("object Update");
        return true;
    }
    public render(): JSX.Element {
        return <div className="input-group json-field">
            <span className="input-group-addon key"><span className="key-text">{ this.props.jField.key }</span></span>
            <div className="input-group">
                { this.selectComponent(this.props.jField.value) }
            </div>
        </div>;
    }
    private selectComponent(jValue: JValue): JSX.Element {
        if (jValue instanceof JNumber) {
            return <JNumberComponent key={jValue.id}
                jNumber={ (jValue as JNumber) } onUpdateAst={ this.props.onUpdateAst } />;
        } else if (jValue instanceof JString) {
            return <JStringComponent key={jValue.id} jString={ (jValue as JString) }
                onUpdateAst={ this.props.onUpdateAst } />;
        } else if (jValue instanceof JBool) {
            return <JBoolComponent key={jValue.id} jBool={ (jValue as JBool) }
                onUpdateAst={ this.props.onUpdateAst } />;
        } else if (jValue instanceof JNull) {
            return <JNullComponent jNull={jValue as JNull }  />;
        } else if (jValue instanceof JArray) {
            return <JArrayComponent key={jValue.id} jArray={ jValue as JArray }
                onUpdateAst={ this.props.onUpdateAst } />;
        } else {
            return <JObjectComponent key={jValue.id} jObject={ jValue as JObject }
                onUpdateAst={ this.props.onUpdateAst } />;
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
    public componentDidMount(): void {
        // open-close-tree
        JsonTree.view();
    }
    public render(): JSX.Element {
        return <div className="tree">
            <ul className="well">
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
        return obj.map((field: JField) => <li key={ field.id }>
            <JObjectFieldComponent  jField={ field } onUpdateAst={ this.props.onUpdateAst } />
        </li>);
    }
}

export { JNumberComponent, JStringComponent, JBoolComponent, JNullComponent, JArrayComponent, JObjectComponent }
