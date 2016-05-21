import * as React from "react";
import * as ReactDOM from "react-dom";
import {ActionCreator} from "./actionCreator";
import {Dispatcher} from "./dispatcher";
import {AceEditor} from "./reactAce.tsx";
import {IComponentState} from "./definition";


export class Component extends React.Component<IComponentState, IComponentState> {
    private dispatcher: Dispatcher;
    private action: ActionCreator;

    constructor(props: IComponentState) {
        super(props);

        this.dispatcher = new Dispatcher();
        this.action = new ActionCreator(this.dispatcher);

        this.state = { text: this.props.text };
    }

    public componentDidMount(): void {
        this.action.createProperty("var x = 10;").onValue((state: string) => {
            this.setState({ text: state });
        });
    }

    public render(): JSX.Element {
        return <div>
            <AceEditor
                name="editor"
                mode="javascript"
                theme="monokai"
                text={this.state.text}
                onChange={this.handleEditorChange.bind(this) }
                />
            <input className="input" type="text"
                value={this.state.text} onChange={this.handleInputChange.bind(this) }/>
        </div>;
    }

    private handleInputChange(e: any): void {
        this.action.changeText(e.target.value);
    }

    private handleEditorChange(text: string): void {
        this.action.changeText(text);
    }
}
