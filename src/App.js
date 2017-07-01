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
      fire.database().ref('todos').push( this.inputEl.value );
      this.inputEl.value = "";
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
                this.state.todos.map(todo => <li key={todo.id} >{todo.text}</li> )
            }
        </ul>
      </form>
      );
  };
}

export default App;
