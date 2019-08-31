import React, { Component } from 'react';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

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
                createDate: message.createDate,
                errors: [],
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
            } else if (eventName === 'EXECUTION_ERROR') {
                execution.status = 'Finished with errors';
                execution.errors.concat(message.errors);
            } else if (eventName === 'INTERRUPT_EXECUTION') {
                execution.status = 'Interrupted';
            } else if (eventName === 'INTERRUPT_FILE_EXECUTION') {
                execution.errors.push(`File ${message.fileId} Interrupted`);
            }
        }

        this.setState({ executions });
    }

    resolveStatus({status}) {
        if(status === 'Started') {
            return 'active';
        } else if(status === 'Finished') {
            return 'success';
        } else if(status === 'Finished with errors') {
            return 'error';
        }
        return status;
    }

    percentage({total, current}) {
        if(current === 0 || total === 0) return 0;
        return (current / total) * 100;
    }

    render() {
        const { executions } = this.state;
        return (
            <div className="content">
                <div className="execution-list">
                    {Object.keys(executions).length === 0 ? <h1>No Executions!</h1> : Object.keys(executions).map(k => executions[k]).map(execution => (
                        <article key={`${execution.id}-${execution.status}`}>
                            <div className="execution-progress">
                                <Progress 
                                    type="circle" 
                                    width={60} 
                                    percent={this.percentage(execution)}
                                    status={this.resolveStatus(execution)}
                                />
                            </div>
                            <div className="execution-info">
                                <strong>Execution: {execution.id}</strong>
                                <p>DataInputId: {execution.dataInputId}</p>
                                <p>Status: {execution.status}</p>
                                <p>Total de arquivos: {execution.total}</p>
                                <p>Arquivos processados: {execution.current}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        );
    }
};