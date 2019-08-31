import React, { Component } from 'react';

import './styles.css';

const URL = "ws://cortexws32:8082/ws";

export default class Execution extends Component {
    constructor() {
        super();

        this.state = {
            executions: [],
        };
        
        this.ws = new WebSocket(URL);

        this.ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected')
        }
    
        this.ws.onmessage = evt => {
            // on receiving a message, add it to the list of messages
            const message = JSON.parse(evt.data)
            this.addMessage(message)
        }
    
        this.ws.onclose = () => {
            console.log('disconnected')
            // automatically try to reconnect on connection loss
            this.ws = new WebSocket(URL);
        }
    }

    addMessage = (message) => {
        console.log("Mensagem recebida de execution ", message.executionId);
        
        let { executions } = this.state;

        this.setState({ executions: executions.concat(message) });
    }

    render() {
        const { executions } = this.state;
        return (
            <div className="content">
                <div className="execution-list">
                    {executions.length === 0 ? <h1>No Executions!</h1> : executions.map(execution => (
                        <article key={`${execution.executionId}-${execution.eventName}`}>
                            <strong>Execution: {execution.executionId}</strong>
                            <p>Status: {execution.eventName}</p>
                            {execution.fileId == undefined ? <br /> : <p>File: {execution.fileId}</p>}
                        </article>
                    ))}
                </div>
            </div>
        );
    }
};