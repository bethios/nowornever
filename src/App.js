import React, { Component } from 'react';
import './App.css';
import fire from './fire'
import TiInputCheckedOutline from 'react-icons/lib/ti/input-checked-outline'

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
      let now = Date.now();
      let due = now + (1000 * 60 * 60 * 24 * 7);
      fire.database().ref('todos').push({
          task: this.inputEl.value,
          due: due,
          complete: false,
          priority: Number(this.priority.value)
      });
      this.inputEl.value = "";
  }

  due(dueDate){
      return Math.round((dueDate - Date.now())/(1000 * 60 * 60 * 24 ));
  }

  markComplete(todoID){
      console.log(todoID);
      fire.database().ref().child('/todos/' + todoID)
          .update( {complete: true });
      window.location.reload();
  }

  inactiveTasks(){
      function handleClick(e){
          e.preventDefault();
          console.log('The Link was clicked')
      }

      return(
          <a href="#/inactiveTasks" onClick={handleClick}>
              Inactive Tasks
          </a>
      )
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
                    this.state.todos.filter(todo => this.due(todo.text.due) >= 0 && todo.text.complete !== true)
                        .map(todo => <li key={todo.id}>{todo.text.task}, Time Remaining: { this.due(todo.text.due) } days
                            <TiInputCheckedOutline className='complete' onClick={() => this.markComplete(todo.id)} /></li> )
                }
              </ul>
          </form>
            <h2 className="tasks-header">Completed Tasks</h2>
            <ul className="completed-tasks">
              {
                  this.state.todos.filter(todo => this.due(todo.text.due) <= 0 || todo.text.complete === true)
                      .map(todo => <li key={todo.id}>{todo.text.task}</li> )
              }
            </ul>

      </div>
      );
  }
}

export default App;
