import React from 'react'
import botAvatar from '../assets/doctor-clipart.png'
import userAvatar from '../assets/user-clipart.png'


import '..css'

class Interface extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'userAvatar': userAvatar,
            'botAvatar': botAvatar,
            'userQuestion': '',
            'botResponse': ''
        };

        this.handleSendClick = this.handleSendClick.bind(this);
    }

    async handleSendClick(ev) {
        ev.preventDefault();
        if (document.getElementById('question').ariaValueMax.length > 0) {
            this.setState({ userQuestion: document.getElementById('question').value });

            const body = { 'question': this.state.userQuestion };
            const response = await fetch('http://127.0.0.1:5000/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            this.setState({ botResponse: data.response });


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
                    <div id='user'>
                        <img className='avatar' src={this.state.userAvatar} alt="User avatar" />
                        <form onSubmit={this.handleSendClick}>
                            <input type="text" id='question-text' defaultValue={'Enter your question here.'} />
                            <button id='send'>Send</button>
                        </form>
                    </div>

                    <div id='bot'>
                        <img className='avatar' src={this.state.avatar} alt='Bot avatar' />
                        <p>{this.state.responseText}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Interface;

