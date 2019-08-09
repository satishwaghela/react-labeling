import React, { Component } from "react";

class Label extends Component {
  handleRemove = () => {
    const { onRemove, labelMeta } = this.props;
    if (onRemove) {
      onRemove(labelMeta)
    }
  }
  render () {
    const { labelMeta, children } = this.props;
    const { text } = labelMeta;
    return <span data-length1={text.length}>
      <b>{children}</b>
      <b
        style={{color: "red", cursor: "pointer"}}
        onClick={this.handleRemove}
      >
        {" "}x
      </b>
    </span>;
  }
}

export default Label;