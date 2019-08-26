import React, { Component } from 'react';

import api from '../../services/api';
import './styles.css';

// const URL = "http://localhost:8082/ws"

export default class Main extends Component {
    state = {
        executions: [],
    };

    // ws = new WebSocket(URL);

    componentDidMount() {
        this.loadExecutions();
    }

    loadExecutions = async () => {
        const data = await api.get(`/execution`);

        this.setState({ executions: data });
    };

    render() {
        const { executions } = this.state;
        return (
            <div className="execution-list">
                {executions.length === 0 ? <h1>No Executions!</h1> : executions.map(execution => (
                    <article key={execution.id}>
                        <strong>{execution.id}</strong>
                        <p>{execution.dataInputId}</p>
                    </article>
                ))}
            </div>
        );
    }
};