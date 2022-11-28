let data = [{ "type": "directory", "name": ".", "contents": [{ "type": "directory", "name": "./bin", "contents": [{ "type": "file", "name": "./bin/greet" }] }, { "type": "directory", "name": "./lib", "contents": [{ "type": "file", "name": "./lib/greeting.rb" }] }, { "type": "directory", "name": "./spec", "contents": [{ "type": "file", "name": "./spec/01_greeting_spec.rb" }, { "type": "file", "name": "./spec/02_cli_spec.rb" }, { "type": "file", "name": "./spec/spec_helper.rb" }] }, { "type": "file", "name": "./CONTRIBUTING.md" }, { "type": "file", "name": "./Gemfile" }, { "type": "file", "name": "./Gemfile.lock" }, { "type": "file", "name": "./LICENSE.md" }, { "type": "file", "name": "./README.md" }] }];

// let data = [{"type":"directory",
//   "name": ".",
//   "contents": [
//     {"type":"file","name":"./CONTRIBUTING.md"},
//     {"type":"file","name":"./Gemfile"},
//     {"type":"file","name":"./Gemfile.lock"},
//     {"type":"file","name":"./LICENSE.md"},
//     {"type":"file","name":"./README.md"},
//     {"type":"directory",
//      "name":"./bin",
//      "contents": [
//       {"type":"file","name":"./bin/greet"}
//      ]
//     },
//     {"type":"directory",
//      "name":"./lib",
//      "contents": [
//        {"type":"file","name":"./lib/greeting.rb"},
//        {"type":"directory",
//         "name":"./lib/something",
//         "contents": [
//           {"type":"file","name":"./lib/something/hello.rb"}
//         ]
//     }]
//     },
//     {"type":"directory",
//      "name":"./spec",
//      "contents": [{"type":"file","name":"./spec/01_greeting_spec.rb"},{"type":"file","name":"./spec/02_cli_spec.rb"},{"type":"file","name":"./spec/spec_helper.rb"}]
//     }
//   ]
// }]

const FileIcon = () => {
  return /*#__PURE__*/(
    React.createElement("div", { class: "svg-icon" }, /*#__PURE__*/
    React.createElement("svg", { id: "icon-file-text2", class: "icon", viewBox: "0 0 32 32", fill: "currentColor", width: "1em", height: "1em" }, /*#__PURE__*/
    React.createElement("path", { d: "M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z" }), /*#__PURE__*/
    React.createElement("path", { d: "M23 26h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z" }), /*#__PURE__*/
    React.createElement("path", { d: "M23 22h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z" }), /*#__PURE__*/
    React.createElement("path", { d: "M23 18h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z" }))));



};

const FolderIcon = () => {
  return /*#__PURE__*/(
    React.createElement("div", { class: "svg-icon" }, /*#__PURE__*/
    React.createElement("svg", { id: "icon-folder", class: "icon", viewBox: "0 0 32 32", fill: "currentColor", height: "1em", width: "1em" }, /*#__PURE__*/
    React.createElement("path", { d: "M14 4l4 4h14v22h-32v-26z" }))));



};

const TriangleDown = () => {
  return /*#__PURE__*/(
    React.createElement("div", { class: "svg-icon" }, /*#__PURE__*/
    React.createElement("svg", { id: "svg__icon--triangle-down", viewBox: "0 0 9 4.5", fill: "currentColor", height: "1em", width: "1em" }, /*#__PURE__*/
    React.createElement("path", { d: "M0,0,4.5,4.5,9,0Z" }))));



};

const formatName = name => {
  return name.substr(name.lastIndexOf('/') + 1);
};

class FileTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNode: null };

    this.setActiveNode = this.setActiveNode.bind(this);
  }

  setActiveNode(name) {
    this.setState({ activeNode: name });
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", null, renderTree(this.props.root, this.setActiveNode, this.state.activeNode)));

  }}


class Directory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true };

    this.toggleDirectory = this.toggleDirectory.bind(this);
  }

  toggleDirectory() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    let node = this.props.node;
    return /*#__PURE__*/(
      React.createElement("div", { className: "directory-container" }, /*#__PURE__*/
      React.createElement("div", { className: "directory" }, /*#__PURE__*/
      React.createElement("div", { className: `directory__toggle ${this.state.expanded ? 'expanded' : ''}` }, /*#__PURE__*/
      React.createElement("div", { onClick: this.toggleDirectory }, /*#__PURE__*/React.createElement(TriangleDown, null))), /*#__PURE__*/

      React.createElement("div", { className: "directory__icon" }, /*#__PURE__*/
      React.createElement(FolderIcon, null)), /*#__PURE__*/

      React.createElement("div", { className: "directory__name" }, /*#__PURE__*/
      React.createElement("div", null, formatName(node.name)))),


      this.state.expanded ? node.contents.map(content => renderTree(content, this.props.setActiveNode, this.props.activeNode)) : ''));


  }}


const File = ({ name, setActiveNode, activeNode }) => {
  let isActive = activeNode === name;
  let className = isActive ? 'active' : '';
  return /*#__PURE__*/React.createElement("div", { className: className + ' file', onClick: () => setActiveNode(name) }, /*#__PURE__*/
  React.createElement("div", { className: "file__icon" }, /*#__PURE__*/
  React.createElement(FileIcon, null)), /*#__PURE__*/

  React.createElement("div", { className: "file__name" },
  formatName(name)),

  isActive && /*#__PURE__*/
  React.createElement("div", { className: "file__options" }, "..."));



};

var root = data[0];
var renderTree = (node, setActiveNode, activeNode) => {
  if (node.type === "file") {
    return /*#__PURE__*/React.createElement(File, { name: node.name, setActiveNode: setActiveNode, activeNode: activeNode });
  } else if (node.type === "directory") {
    return /*#__PURE__*/React.createElement(Directory, { node: node, setActiveNode: setActiveNode, activeNode: activeNode });
  } else {
    return null;
  }
};

ReactDOM.render( /*#__PURE__*/React.createElement(FileTree, { root: root }), document.getElementById('container'));



$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });
});