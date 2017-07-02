import React, { Component } from 'react';
import './App.css';
import fire from './fire'

class App extends Component {
  constructor(props) {
      super(props);
      this.state = { todos: [] };
  }

  componentWillMount(){
      let todosRef = fire.database().ref('todos').orderByKey().limitToLast(100);
      todosRef.on('child_added', snapshot=> {
          let todo = {text: snapshot.val(), id: snapshot.key};
          this.setState({todos: [todo].concat(this.state.todos) })
      })
  }

  addTodo(e){
      e.preventDefault();
      let t = Date.now();
      let d = t + (1000 * 60 * 60 * 24 * 7);
      fire.database().ref('todos').push({
          task: this.inputEl.value,
          due: d,
          complete: false
      });
      this.inputEl.value = "";
  }

  due(dueDate){
      const days = Math.round((dueDate - Date.now())/(1000 * 60 * 60 * 24 ));
      return days
  }

  render(){
      return(
      <form onSubmit={this.addTodo.bind(this)}>
          <h1>Add New To-Do</h1>
          <input type="text" ref={ el => this.inputEl = el }/>
          <input type="submit"/>

          <h2 className="tasks-header">Current Tasks</h2>
          <ul>
            {
                this.state.todos.filter(todo => this.due(todo.text.due) >= 0)
                    .filter(todo => todo.text.complete !== true)
                    .map(todo => <li key={todo.id} >{todo.text.task}, Time Remaining: { this.due(todo.text.due) } days </li> )
            }
        </ul>
      </form>
      );
  }
}

export default App;
