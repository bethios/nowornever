import React, { Component } from 'react';
import './App.css';
import fire from './fire'

class oldTasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = { todos: [] };
    }

    componentWillMount(){
        let todosRef = fire.database().ref('todos').orderByChild('priority').limitToLast(100);
        todosRef.on('child_added', snapshot=> {
            let todo = {text: snapshot.val(), id: snapshot.key};
            this.setState({todos: [todo].concat(this.state.todos) })
        })
    }

    render(){
        return(
            <div className="list">
                    <h2>old tasks</h2>
                    <ul>
                        {
                            this.state.todos.filter(todo => this.due(todo.text.due) <= 0 || todo.text.complete === true)
                                .map(todo => <li key={todo.id} >{todo.text.task}, Time Remaining: { this.due(todo.text.due) } days </li> )
                        }
                    </ul>
            </div>
        );
    }
}

