import * as React from "react";
import * as ReactDOM from "react-dom";
import {Component} from "./component.tsx";

ReactDOM.render(
  <Component text="var x = 10;"/>,
  document.getElementById("content")
);

