import React, { Component } from "react";
import { Labeling } from './lib'

const text = `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
  when an unknown printer took a galley of type and scrambled it to make a type specimen book.
  It has survived not only five centuries, but also the leap into electronic typesetting,
  remaining essentially unchanged.
  It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
  and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

export default class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selections: this.fetchSelection()
    }
  }
  fetchSelection () {
    const selections = localStorage.getItem('selections');
    if (selections) {
      return JSON.parse(selections);
    }
    return [];
  }
  saveSelection (selections) {
    localStorage.setItem('selections', JSON.stringify(selections));
  }
  handleLabeling = (selections) => {
    this.saveSelection(selections);
    this.setState({selections});
  }
  render () {
    const { selections } = this.state;

    return <Labeling
      text={text}
      selections={selections}
      onChange={this.handleLabeling}
    />;
  }
}