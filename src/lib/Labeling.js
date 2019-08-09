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

  hSelection (selections) {
    const _sel = JSON.parse(JSON.stringify(selections));
    if(!_sel.length){
      return [];
    }
    /* const root = {
      startOffset: 0,
      endOffset: _sel[_sel.length-1].endOffset
    }; */
    const sorted = _sel.sort((a, b) => {
      return (a.endOffset - a.startOffset) - (b.endOffset - b.startOffset);
    })
    for(let i = 0; i < sorted.length;){
      const temp = sorted[i];
      let spliced = false;
      for(let j = 0; j < sorted.length; j++){
        const sel2 = sorted[j];
        if(temp.startOffset >= sel2.startOffset && temp.endOffset <= sel2.endOffset && temp != sel2) {
          sel2.children = sel2.children || []
          sel2.children.push(temp);
          sorted.splice(i, 1);
          spliced = true
          break;
        }
      }
      if(!spliced) {
        i++;
      }
    }
    return sorted.sort((a, b) => {
      return a.startOffset - b.startOffset;
    });
  }

  getContent () {
    const { text, selections } = this.props;
    const hSelection = this.hSelection(selections);
    let nodes = [];
    const addComp = (sel, i, lastIndex, text) => {
      const tempNode = [];
      let child = null;
      if(sel.children){
        let clastIndex = sel.startOffset;
        const cNodes =  []
        sel.children.map((sel2, i2) => {
          const cText = text.slice(clastIndex, sel2.startOffset);
          cNodes.push(cText);
          const cComp = addComp(sel2, i+'.'+i2, clastIndex, text);
          clastIndex = sel2.endOffset;
          cNodes.push(cComp);
          return cComp
        });
        cNodes.push(text.slice(clastIndex, sel.endOffset));
        tempNode.push(this.getLabelComp(sel, i, cNodes));
      } else {
        child = text.slice(sel.startOffset, sel.endOffset);
        tempNode.push(this.getLabelComp(sel, i, child));
      }
      return tempNode;
    }
    let lastIndex = 0;
    hSelection.map((sel, i) => {
      nodes.push(text.slice(lastIndex, sel.startOffset))
      const comp = addComp(sel, i, lastIndex, text)
      lastIndex = sel.endOffset;
      nodes.push(comp);
    });
    nodes.push(text.slice(lastIndex, text.length));
    return nodes;
  }

  getLabelComp (labelMeta, i, child) {
    const { Label } = this.props;
    return <Label
      key={i}
      labelMeta={labelMeta}
      onRemove={this.handleRemove}
    >{child}</Label>
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
    /* if( e.target !==  this.container) {
      return;
    } */
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
    const getPreviousLength = (el, skipTextLength) => {
      let textLength = 0;
      if(!skipTextLength){
        const dataLength = el.dataset ? el.dataset.length : 0;
        textLength = dataLength ? JSON.parse(dataLength) : el.textContent.length;
      }
      if (el.previousSibling) {
        textLength += getPreviousLength(el.previousSibling);
      }
      if (el.parentElement != this.container) {
        textLength += getPreviousLength(el.parentElement, true);
      }
      return textLength;
    }

    let prevLength = 0;
    if (startContainer.previousSibling) {
      prevLength += getPreviousLength(startContainer.previousSibling);
    }
    if(startContainer.parentElement != this.container){
      prevLength += getPreviousLength(startContainer.parentElement, true);
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
