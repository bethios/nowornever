import React, { Component } from 'react';
import './App.css';
import fire from './fire'
import TiInputCheckedOutline from 'react-icons/lib/ti/input-checked-outline'

class App extends Component {
  constructor(props) {
      super(props);
      this.state = { todos: [] };
      this.default = todo => this.due(todo.text.due) >= 0 && todo.text.status === 'active';
      this.current = 'Active ToDos'
  }

  changeCondition(condition){
      if(condition === 'active'){
          this.default = todo => this.due(todo.text.due) >= 0 && todo.text.status === 'active';
          this.current = "Active ToDos";
      }else{
          this.default =  todo => this.due(todo.text.due) < 0 || todo.text.status !== 'active';
          this.current = 'ToDos History';
      }
      this.forceUpdate()
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
          status: 'active',
          priority: Number(this.priority.value)
      });
      this.inputEl.value = "";
  }

  due(dueDate){
      return Math.round((dueDate - Date.now())/(1000 * 60 * 60 * 24 ));
  }

  dueMessage(dueDate){
      let days = this.due(dueDate);

      if(days === 0){
          return "Due Today"
      }else if(days === 1) {
          return "Due Tomorrow"
      }else if(days < 0){
          return "Past Due"
      }else{
          return days + " days left"
      }
  }

  markComplete(todoID){
      fire.database().ref().child('/todos/' + todoID)
          .update( {status: 'complete' });
      window.location.reload();
  }

  render(){
      return(
      <div className="list">
          <a href='#' className="activeLink"  onClick={() => this.changeCondition('active')}>Active ToDos</a>
          <a href='#' className="historyLink" onClick={() => this.changeCondition('inactive')}>ToDos History</a>
          <form onSubmit={this.addTodo.bind(this)}>
              <h1 className="tasks-header">{this.current}</h1>
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
                    this.state.todos.filter(this.default)
                        .map(todo => <li className={todo.text.status +" " + 'daysLeft' + this.due(todo.text.due)} key={todo.id}>
                            <p className="taskDesc">{todo.text.task}</p> <span>{ this.dueMessage(todo.text.due) }</span>
                            <TiInputCheckedOutline className='checkbox' onClick={() => this.markComplete(todo.id)} /></li> )
                }
              </ul>
          </form>
      </div>
      );
  }
}

export default App;
