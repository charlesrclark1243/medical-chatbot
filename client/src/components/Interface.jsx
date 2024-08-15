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
            'userQuestion': '',
            'botResponse': 'Temp'
        };

        this.handleSendClick = this.handleSendClick.bind(this);
    }

    handleSendClick(ev) {
        ev.preventDefault();
        if (document.getElementById('question-text').value.length > 0) {
            this.setState({ userQuestion: document.getElementById('question-text').value });

            const body = { 'question': this.state.userQuestion };
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
                    <p id='disclaimer'>{'Medi-Bot 3.1-8B is powered by a large language model, and as such, it can make mistakes: please research all answers on your own as well. For important medical questions, please consult a human healthcare provider.'}</p>
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

