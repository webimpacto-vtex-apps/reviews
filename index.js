import React, {Component} from 'react'

class HelloWorld extends Component {
    constructor(props){
        super(props)
    }

    componentDidMount(){
        window.postMessage({action:{type: "STOP_LOADING"}},"*")
    }

    render(){
        return (
            <div>
                <h1>Hello ADMIN!</h1>
            </div>
        )
    }
}

export default HelloWorld