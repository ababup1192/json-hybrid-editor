import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Bacon from "baconjs";

const ace: any = require("brace");

interface IAceEditorProps {
    name?: string;
    mode?: string;
    width?: string;
    height?: string;
    theme?: string;
    text?: string;
    onChange?: (text: string) => void;
}

export class AceEditor extends React.Component<IAceEditorProps, { text: string }> {
    private editor: AceAjax.Editor;
    static defaultProps: IAceEditorProps = {
        mode: "javascript",
        width: "500px",
        height: "500px",
        theme: "github",
        text: "",
        onChange: null,
    };

    constructor(props: IAceEditorProps) {
        super(props);
        this.state = { text: this.props.text };
    }

    public componentDidMount(): void {
        const {name, theme, mode, text}: IAceEditorProps = this.props;
        this.editor = ace.edit(name);
        this.editor.setTheme(`ace/theme/${theme}`);
        this.editor.getSession().setMode(`ace/mode/${mode}`);
        this.editor.getSession().setValue(text);
        Bacon.fromEvent(document.getElementById(name), "keyup").debounce(300)
            .map(() => this.editor.getSession().getValue())
            .onValue(this.onChange.bind(this));
    }

    public componentWillReceiveProps(nextProps: IAceEditorProps): void {
        if (this.state.text !== nextProps.text) {
            this.editor.getSession().setValue(nextProps.text);
        }
    }

    public render(): JSX.Element {
        const { name, width, height }: IAceEditorProps = this.props;
        const divStyle: {} = { width, height };
        return (
            <div
                id={name}
                className={name}
                style={divStyle}
                >
            </div>
        );
    }

    private onChange(text: string): void {
        this.setState({ text: text });

        if (this.props.onChange) {
            this.props.onChange(text);
        }
    }
}
