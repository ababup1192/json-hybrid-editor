import * as React from "react";
import * as ReactDOM from "react-dom";
import {ActionCreator} from "./actionCreator";
import {Dispatcher} from "./dispatcher";
import {AceEditor} from "./reactAce.tsx";
import {JValue, JNumber, JString, JBool, JNull, JArray, JField, JObject, JsonAst} from "./jsonAst";
import { JNumberComponent, JStringComponent, JBoolComponent,
  JNullComponent, JArrayComponent, JObjectComponent } from "./jsonTree.tsx";

interface IAppState {
  ast: JValue;
}

export class App extends React.Component<any, IAppState> {
  private dispatcher: Dispatcher;
  private action: ActionCreator;

  constructor() {
    super();
    this.state = { ast: undefined };
    this.dispatcher = new Dispatcher();
    this.action = new ActionCreator(this.dispatcher);
  }
  public componentDidMount(): void {
    this.action.createProperty(`{"a": 123}`).onValue((value: JValue) => {
      this.setState({ ast: value });
    });
  }
  public render(): JSX.Element {
    return <div className="container">
      <div className="row">
        <div className="col-md-6">
          <AceEditor
            name="editor"
            mode="javascript"
            theme="monokai"
            text={ this.state.ast === undefined ? "" : this.state.ast.toString(true) }
            onChange={ this.onChangeText.bind(this) }
            />
        </div>
        <div className="col-md-6 visual-editor">
          { this.selectComponent(this.state.ast) }
        </div>
      </div>
    </div>;
  }
  private selectComponent(jValue: JValue): JSX.Element {
    if (jValue === undefined) {
      return undefined;
    } else if (jValue instanceof JNumber) {
      return <JNumberComponent jNumber={ jValue as JNumber } onUpdateAst={ this.onUpdateAst.bind(this) } />;
    } else if (jValue instanceof JString) {
      return <JStringComponent jString={ jValue as JString } onUpdateAst={ this.onUpdateAst.bind(this) } />;
    } else if (jValue instanceof JBool) {
      return <JBoolComponent jBool={ jValue as JBool } onUpdateAst={ this.onUpdateAst.bind(this) } />;
    } else if (jValue instanceof JNull) {
      return <JNullComponent jNull={ jValue as JNull } />;
    } else if (jValue instanceof JArray) {
      return <JArrayComponent jArray={ jValue as JArray } onUpdateAst={ this.onUpdateAst.bind(this) } />;
    } else {
      return <JObjectComponent jObject={ jValue as JObject } onUpdateAst={ this.onUpdateAst.bind(this) } />;
    }
  }
  private onChangeText(text: string): void {
    try {
      JSON.parse(text);
      this.action.changeText(text);
    } catch (e) { ; }
  }

  private onUpdateAst(id: string, value: any): void {
    this.action.updateAst({ id: id, newValue: value });
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("content")
);

