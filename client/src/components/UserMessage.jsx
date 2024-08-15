// avatar from https://commons.wikimedia.org/wiki/File:User_%2817238%29_-_The_Noun_Project.svg

import React from 'react'
import './styles/UserMessage.css'
import avatar from '../assets/user-clipart.png'

class UserMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avatar: avatar,
            questionText: ''
        };

        this.handleSendClick = this.handleSendClick.bind(this);
    }

    async handleSendClick(ev) {
        ev.preventDefault();

        answer = '';
        if (document.getElementById('question').ariaValueMax.length > 0) {
            this.setState({ questionText: document.getElementById('question').value });

            const body = { 'question': this.state.questionText };
            const response = fetch('http://127.0.0.1:5000/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            answer = data.response;
        }

        return answer;
    }

    render() {
        return (
            <div>
                <img src={this.state.avatar} alt="User avatar" />
                <form onSubmit={this.handleSendClick}>
                    <input type="text" id='question' defaultValue={'Enter your question here'} />
                    <button id='send'>Send</button>
                </form>
            </div>
        );
    }
}