import React from 'react'
import botAvatar from '../assets/doctor-clipart.png'
import userAvatar from '../assets/user-clipart.png'

import './Interface.css'

class Interface extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'userAvatar': userAvatar,
            'botAvatar': botAvatar,
            'botResponse': ''
        };

        this.handleSendClick = this.handleSendClick.bind(this);
    }

    handleSendClick(ev) {
        ev.preventDefault();
        if (document.getElementById('question-text').value.length > 0) {
            this.setState({ botResponse: 'Thinking...' })
            const body = { 'question': document.getElementById('question-text').value };
            
            fetch('http://127.0.0.1:5000/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }).then(
                response => response.json()
            ).then(
                body => {
                    this.setState({ botResponse: body.response })
                }
            )
        }
    }
    
    render() {
        return (
            <div>
                <div id='heading'>
                    <h1 id='title'>{'Medi-Bot 3.1-8B'}</h1>
                    <p id='disclaimer'>{'Disclaimer: This chatbot is powered by a large language model (LLM) and is designed to provide general information and support. While it strives to offer accurate and helpful responses, it may occasionally provide incorrect or incomplete information. This chatbot is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for any medical concerns or before making decisions based on the information provided by this chatbot. In case of a medical emergency, please seek immediate help from emergency services.'}</p>
                </div>

                <div id='interface'>
                    <div className='message' id='user'>
                        <img className='avatar' src={this.state.userAvatar} alt="User avatar" />
                        <form onSubmit={this.handleSendClick}>
                            <input type="text" id='question-text' defaultValue={'Enter your question here.'} />
                            <button id='send'>Send</button>
                        </form>
                    </div>

                    <div className='message' id='bot'>
                        <img className='avatar' src={this.state.botAvatar} alt='Bot avatar' />
                        <p>{this.state.botResponse}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Interface;

