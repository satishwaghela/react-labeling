"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Label = require("./Label");

var _Label2 = _interopRequireDefault(_Label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Labeling = function (_Component) {
  _inherits(Labeling, _Component);

  function Labeling() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Labeling);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Labeling.__proto__ || Object.getPrototypeOf(Labeling)).call.apply(_ref, [this].concat(args))), _this), _this.handleRemove = function (labelMeta) {
      var _this$props = _this.props,
          selections = _this$props.selections,
          onChange = _this$props.onChange;

      var index = selections.findIndex(function (sel) {
        return sel === labelMeta;
      });
      if (index > -1) {
        var updatedSelection = [].concat(_toConsumableArray(selections));
        updatedSelection.splice(index, 1);
        onChange(updatedSelection);
      }
    }, _this.handlMouseUp = function (e) {
      if (e.target !== _this.container) {
        return;
      }
      var selectedRange = _this.getSelectedRange();
      if (_this.shouldTriggerSelection(selectedRange)) {
        _this.triggerSelection(selectedRange);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Labeling, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        "div",
        {
          onMouseUp: this.handlMouseUp,
          ref: function ref(_ref2) {
            return _this2.container = _ref2;
          }
        },
        this.getContent()
      );
    }
  }, {
    key: "getContent",
    value: function getContent() {
      var _this3 = this;

      var _props = this.props,
          text = _props.text,
          selections = _props.selections;

      var nodes = [];
      var lastIndex = 0;
      selections.forEach(function (sel, i) {
        nodes.push(text.slice(lastIndex, sel.startOffset));
        nodes.push(_this3.getLabelComp(sel, i));
        lastIndex = sel.endOffset;
      });
      nodes.push(text.slice(lastIndex, text.length));
      return nodes;
    }
  }, {
    key: "getLabelComp",
    value: function getLabelComp(labelMeta, i) {
      var Label = this.props.Label;

      return _react2.default.createElement(Label, {
        key: i,
        labelMeta: labelMeta,
        onRemove: this.handleRemove
      });
    }
  }, {
    key: "getSelectedRange",
    value: function getSelectedRange() {
      var selectedRange = void 0;
      if (window.getSelection) {
        selectedRange = window.getSelection().getRangeAt(0);
      } else {
        selectedRange = document.getSelection().getRangeAt(0);
      }
      return selectedRange;
    }
  }, {
    key: "shouldTriggerSelection",
    value: function shouldTriggerSelection(selectedRange) {
      return selectedRange.startOffset !== selectedRange.endOffset;
    }
  }, {
    key: "triggerSelection",
    value: function triggerSelection(selectedRange) {
      var _props2 = this.props,
          selections = _props2.selections,
          onChange = _props2.onChange;

      var offset = this.getAbsoluteOffset(selectedRange);
      var meta = _extends({}, offset, {
        text: selectedRange.toString()
      });
      var newSelections = [].concat(_toConsumableArray(selections), [meta]).sort(function (a, b) {
        return a.startOffset - b.startOffset;
      });
      onChange(newSelections);
    }
  }, {
    key: "getAbsoluteOffset",
    value: function getAbsoluteOffset(selectedRange) {
      var startContainer = selectedRange.startContainer;
      var startOffset = selectedRange.startOffset;
      var endOffset = selectedRange.endOffset;
      var getPreviousLength = function getPreviousLength(el) {
        var dataLength = el.dataset ? el.dataset.length : 0;
        var textLength = dataLength ? JSON.parse(dataLength) : el.textContent.length;
        if (el.previousSibling) {
          textLength += getPreviousLength(el.previousSibling);
        }
        return textLength;
      };

      var prevLength = 0;
      if (startContainer.previousSibling) {
        prevLength = getPreviousLength(startContainer.previousSibling);
      }

      startOffset += prevLength;
      endOffset += prevLength;
      return {
        startOffset: startOffset,
        endOffset: endOffset
      };
    }
  }]);

  return Labeling;
}(_react.Component);

Labeling.defaultProps = {
  Label: _Label2.default
};

exports.default = Labeling;