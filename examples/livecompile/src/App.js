import React, { Component } from 'react'
import brace from 'brace'
import AceEditor from 'react-ace'
import 'brace/mode/c_cpp'
import 'brace/mode/python'
import 'brace/theme/github'
import 'brace/theme/dracula'
import {Grid, Row, Col,DropdownButton,MenuItem,Button} from 'react-bootstrap'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      language : 'python',
      code: 'Best of luck on your interview.',
      username:'undefined'
    }
  }

  onSelection = () =>{
    const selectedText = this.refs.aceEditor.editor.getSelectedText()
    console.log(selectedText)
  }
  

  render() {
    return (
      <Grid fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
      <Row className="show-grid">
        <DropdownButton
            title = "Change language"
            style ={{marginBottom:10,marginTop: 10}}
        >
         <MenuItem eventKey="1" onClick = {()=>{
           this.setState({
             language:'python'
           })
         }}>Python3</MenuItem>
         <MenuItem eventKey="2" onClick = {()=>{
           this.setState({
             language:'c_cpp'
           })
         }}>C++ 11</MenuItem>
         <MenuItem eventKey="3" onClick = {()=>{
           this.setState({
             language:'c_cpp'
           })
         }}>C</MenuItem>
        </DropdownButton>
        <Button bsStyle="success"
          onClick = {()=>{
            console.log(this.state.code)
          }}
        >Run</Button>
        <AceEditor
            reference = 'ref'
            mode= {this.state.language}
            theme="dracula"
            name="blah2"
            onLoad={this.onLoad}
            onChange={value =>{
              this.setState({
                code : value
              })
            }}
            onSelection={this.onSelection}
            fontSize={14}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            value={``}
            setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
            }}
            width = '1000'
            />
        </Row>
      </Grid>
    );
  }
}

export default App;