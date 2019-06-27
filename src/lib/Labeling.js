import React, { Component } from "react";
import DefaultLabel from './Label';

class Labeling extends Component {
  render () {
    return <div
      onMouseUp={this.handlMouseUp}
      ref={ref => this.container = ref}
    >
      {this.getContent()}
    </div>;
  }

  getContent () {
    const { text, selections } = this.props;
    const nodes = [];
    let lastIndex = 0;
    selections.forEach((sel, i) => {
      nodes.push(text.slice(lastIndex, sel.startOffset));
      nodes.push(this.getLabelComp(sel, i));
      lastIndex = sel.endOffset;
    });
    nodes.push(text.slice(lastIndex, text.length));
    return nodes;
  }

  getLabelComp (labelMeta, i) {
    const { Label } = this.props;
    return <Label
      key={i}
      labelMeta={labelMeta}
      onRemove={this.handleRemove}
    />
  }

  handleRemove = (labelMeta) => {
    const { selections, onChange } = this.props;
    const index = selections.findIndex((sel) => {
      return sel === labelMeta;
    })
    if (index > -1) {
      const updatedSelection = [...selections];
      updatedSelection.splice(index, 1)
      onChange(updatedSelection);
    }
  }

  handlMouseUp = (e) => {
    if( e.target !==  this.container) {
      return;
    }
    const selectedRange = this.getSelectedRange();
    if(this.shouldTriggerSelection(selectedRange)){
      this.triggerSelection(selectedRange);
    }
  }

  getSelectedRange () {
    let selectedRange;
    if (window.getSelection) {
      selectedRange = window.getSelection().getRangeAt(0);
    } else {
      selectedRange = document.getSelection().getRangeAt(0);
    }
    return selectedRange;
  }

  shouldTriggerSelection (selectedRange) {
    return selectedRange.startOffset !== selectedRange.endOffset
  }

  triggerSelection (selectedRange) {
    const { selections, onChange } = this.props;
    const offset = this.getAbsoluteOffset(selectedRange);
    const meta = {
      ...offset,
      text: selectedRange.toString()
    }
    const newSelections = [...selections, meta].sort((a, b) => {
      return a.startOffset - b.startOffset;
    });
    onChange(newSelections);
  }

  getAbsoluteOffset (selectedRange) {
    const startContainer = selectedRange.startContainer;
    let startOffset = selectedRange.startOffset;
    let endOffset = selectedRange.endOffset;
    const getPreviousLength = (el) => {
      const dataLength = el.dataset ? el.dataset.length : 0;
      let textLength = dataLength ? JSON.parse(dataLength) : el.textContent.length;
      if (el.previousSibling) {
        textLength += getPreviousLength(el.previousSibling);
      }
      return textLength;
    }

    let prevLength = 0;
    if (startContainer.previousSibling) {
      prevLength = getPreviousLength(startContainer.previousSibling);
    }

    startOffset += prevLength;
    endOffset += prevLength;
    return {
      startOffset,
      endOffset
    }
  }
}

Labeling.defaultProps = {
  Label: DefaultLabel
}

export default Labeling;
