import React, { Component } from 'react';
import './App.css';
import fire from './fire'

class App extends Component {
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

  addTodo(e){
      let t = Date.now();
      let d = t + (1000 * 60 * 60 * 24 * 7);
      fire.database().ref('todos').push({
          task: this.inputEl.value,
          due: d,
          complete: false,
          priority: Number(this.priority.value)
      });
      this.inputEl.value = "";
  }

  due(dueDate){
      const days = Math.round((dueDate - Date.now())/(1000 * 60 * 60 * 24 ));
      return days
  }

  render(){
      return(
      <div className="list">
          <form onSubmit={this.addTodo.bind(this)}>
              <h1 className="tasks-header">Current Tasks</h1>
              <p className="add-task-header describe">Task Description</p>
              <p className="add-task-header priority">Priority</p>
              <input type="text" placeholder="Add New Task" className="add-task add-task-field" ref={ el => this.inputEl = el }/>
              <select name="priority" className="add-task" ref={ el => this.priority = el}>
                  <option value="3">High</option>
                  <option value="2">Medium</option>
                  <option value="1">Low</option>
              </select>
              <input className="add-task add-task-button" type="submit"/>

              <ul>
                {
                    this.state.todos.filter(todo => this.due(todo.text.due) >= 0)
                        .filter(todo => todo.text.complete !== true)
                        .map(todo => <li key={todo.id} >{todo.text.task}, Time Remaining: { this.due(todo.text.due) } days </li> )
                }
            </ul>
          </form>
      </div>
      );
  }
}

export default App;
