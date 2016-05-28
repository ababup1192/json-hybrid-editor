import * as React from "react";
import * as ReactDOM from "react-dom";
import {ActionCreator, AppEventObject} from "./actionCreator";
import {JValue, JNumber, JString, JBool, JNull, JArray, JField, JObject, JsonAst} from "./jsonAst";
import { JNumberComponent, JStringComponent, JBoolComponent,
    JNullComponent, JArrayComponent, JObjectComponent } from "./jsonTree.tsx";

interface ITextEditorProps {
    appEvent: Bacon.Property<JValue, AppEventObject>;
    action: ActionCreator;
    initialJsonText: string;
}

export class VisualEditor extends React.Component<ITextEditorProps, { ast: JValue }> {
    constructor(props: ITextEditorProps) {
        super(props);
        this.state = { ast: JsonAst.toAst(JSON.parse(this.props.initialJsonText)) };
    }
    public componentDidMount(): void {
        this.props.appEvent.onValue((value: AppEventObject) => {
            if (value.isVisualChange) {
                this.setState({ ast: value.ast });
            }
        });
    }
    public render(): JSX.Element {
        return this.selectComponent(this.state.ast);
    }
    private selectComponent(jValue: JValue): JSX.Element {
        if (jValue === undefined) {
            return undefined;
        } else if (jValue instanceof JNumber) {
            return <JNumberComponent key={jValue.id} jNumber={ jValue as JNumber } onUpdateAst={ this.onUpdateAst.bind(this) } />;
        } else if (jValue instanceof JString) {
            return <JStringComponent key={jValue.id} jString={ jValue as JString } onUpdateAst={ this.onUpdateAst.bind(this) } />;
        } else if (jValue instanceof JBool) {
            return <JBoolComponent key={jValue.id} jBool={ jValue as JBool } onUpdateAst={ this.onUpdateAst.bind(this) } />;
        } else if (jValue instanceof JNull) {
            return <JNullComponent key={jValue.id} jNull={ jValue as JNull } />;
        } else if (jValue instanceof JArray) {
            return <JArrayComponent key={jValue.id} jArray={ jValue as JArray } onUpdateAst={ this.onUpdateAst.bind(this) } />;
        } else {
            return <JObjectComponent key={jValue.id} jObject={ jValue as JObject } onUpdateAst={ this.onUpdateAst.bind(this) } />;
        }
    }
    private onUpdateAst(id: string, value: any): void {
        this.props.action.updateAst({ id: id, newValue: value });
    }
}
