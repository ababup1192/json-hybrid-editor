import * as React from "react";
import * as ReactDOM from "react-dom";
import {ActionCreator} from "./actionCreator";
import {Dispatcher} from "./dispatcher";
import {JValue} from "./jsonAst";
import {TextEditor} from "./textEditor.tsx";
import {VisualEditor} from "./visualEditor.tsx";
import {AppEventObject} from "./actionCreator";

interface IAppState {
  ast: JValue;
}

export class App extends React.Component<any, any> {
  private dispatcher: Dispatcher;
  private action: ActionCreator;
  private appEvent: Bacon.Property<JValue, AppEventObject>;
  private INITAL_JSON_TEXT: string = "123";

  constructor() {
    super();
    this.state = { ast: undefined };
    this.dispatcher = new Dispatcher();
    this.action = new ActionCreator(this.dispatcher);
    this.appEvent = this.action.createProperty(this.INITAL_JSON_TEXT);
  }
  public render(): JSX.Element {
    return <div className="container">
      <div className="row">
        <div className="col-md-6">
          <TextEditor action={this.action} appEvent={this.appEvent} initialJsonText={this.INITAL_JSON_TEXT}/>
        </div>
        <div className="col-md-6 visual-editor">
          <VisualEditor action={this.action} appEvent={this.appEvent} initialJsonText={this.INITAL_JSON_TEXT}/>
        </div>
      </div>
    </div>;
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("content")
);

