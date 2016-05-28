import {AceEditor} from "./reactAce.tsx";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {ActionCreator, AppEventObject} from "./actionCreator";
import {JValue, JsonAst} from "./jsonAst";

interface ITextEditorProps {
    appEvent: Bacon.Property<JValue, AppEventObject>;
    action: ActionCreator;
    initialJsonText: string;
}

export class TextEditor extends React.Component<ITextEditorProps, { jsonText: string }> {
    constructor(props: ITextEditorProps) {
        super(props);
        this.state = { jsonText: this.props.initialJsonText };
    }
    public componentDidMount(): void {
        this.props.appEvent.onValue((value: AppEventObject) => {
            if (value.isTextChange) {
                this.setState({ jsonText: value.ast.toString(true) });
            }
        });
    }
    public render(): JSX.Element {
        return <AceEditor
            name="editor"
            mode="javascript"
            theme="monokai"
            text={ this.state.jsonText }
            onChange={ this.onChangeText.bind(this) }
            />;
    }
    private onChangeText(text: string): void {
        try {
            JSON.parse(text);
            this.props.action.changeText(text);
        } catch (e) { ; }
    }
}
