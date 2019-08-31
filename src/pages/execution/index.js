import React, { Component } from 'react';

import './styles.css';

const URL = "ws://cortexws32:8082/ws";

export default class Execution extends Component {
    constructor() {
        super();

        this.state = {
            executions: {},
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
        console.log(`Mensagem recebida de execution ${message.executionId}`, message);

        let { executions } = this.state;

        let { executionId, eventName } = message;

        if(eventName === 'NEW_EXECUTION') {
            executions[executionId] = {
                id: executionId,
                dataInputId: message.dataInputId,
                status: 'Created',
                total: 0,
                current: 0,
                createDate: message.createDate
            };
        } else {
            let execution = executions[executionId];

            if (eventName === 'FILE_CREATED_EXECUTION') {
                execution.total = execution.total + 1;
            } else if (eventName === 'START_EXECUTION') {
                execution.status = 'Started';
                execution.startDate = message.startDate;
            } else if (eventName === 'FILE_PROCESSED_EXECUTION') {
                execution.current = message.current;
                if(execution.total !== message.total) {
                    execution.total = message.total;
                }
            } else if (eventName === 'EXECUTION_FINISHED') {
                execution.status = 'Finished';
            }
        }

        this.setState({ executions });
    }

    render() {
        const { executions } = this.state;
        return (
            <div className="content">
                <div className="execution-list">
                    {Object.keys(executions).length === 0 ? <h1>No Executions!</h1> : Object.keys(executions).map(k => executions[k]).map(execution => (
                        <article key={`${execution.id}-${execution.status}`}>
                            <strong>Execution: {execution.id}</strong>
                            <p>DataInputId: {execution.dataInputId}</p>
                            <p>Status: {execution.status}</p>
                            <p>Total de arquivos: {execution.total}</p>
                            <p>Arquivos processados: {execution.current}</p>
                        </article>
                    ))}
                </div>
            </div>
        );
    }
};