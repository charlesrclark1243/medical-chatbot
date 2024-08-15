// avatar from https://commons.wikimedia.org/wiki/File:Noun-doctor-2909354-00449F.svg

import React from 'react'
import './styles/BotMessage.css'
import avatar from '../assets/doctor-clipart.png'

class BotMessage extends React.Component {
    constructor(props, responseText) {
        super(props);

        this.state = {
            avatar: avatar,
            responseText: responseText
        };
    }

    setResponseText(responseText) {
        this.setState({ responseText: responseText });
    }

    render() {
        return (
            <div>
                <img src={this.state.avatar} alt='Bot avatar' />
                <p>{this.state.responseText}</p>
            </div>
        );
    }
}

export default BotMessage;