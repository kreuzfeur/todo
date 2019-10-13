import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {
  maxId = 100;

  createTodoItem = (label) => {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++
    }
  }
  state = {
    todoData: [
      this.createTodoItem("Drink Coffee"),
      this.createTodoItem("Make Awesome App"),
      this.createTodoItem("Have a lunch"),
    ],
    term: '',
    filter: 'active'
  }
  deleteItem = (id) => {
    this.setState(({ todoData }) => {
      const newTodoData = todoData.filter((elt) => elt.id !== id);
      return {
        todoData: newTodoData
      }
    })
  }
  addItem = (text) => {
    this.setState(({ todoData }) => {
      const newTodoData = Object.assign([], this.state.todoData);
      newTodoData.push(this.createTodoItem(text));
      return {
        todoData: newTodoData
      }
    })
  }
  onToggleDone = (id) => {
    this.setState(({ todoData }) => {
      const newTodoData = todoData.map((elt) => {
        if (elt.id === id) {
          elt.done = !elt.done
        } return elt
      })
      return {
        todoData: newTodoData
      }
    })
  }
  onToggleImportant = (id) => {
    this.setState(({ todoData }) => {
      const newTodoData = [];
      todoData.forEach(elt => {
        if (elt.id === id) {
          newTodoData.push({ id: elt.id, important: !elt.important, done: elt.done, label: elt.label })
        } else {
          newTodoData.push(elt)
        }
      });
      return {
        todoData: newTodoData
      }
    })
  }
  search = (items, term) => {
    if (term.length === 0) return items;
    return items.filter((item) => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
    })
  }
  onSearchChange = (term) => {
    this.setState({
      term
    })
  }
  filter = (items, filter) => {
    switch (filter) {
      case 'all':
        return items;
      case 'active':
        return items.filter((item) => !item.done)
      case 'done':
        return items.filter((item) => item.done)
      default:
        return items
    }
  }
  onFilterChange = (filter) => {
    this.setState({
      filter
    })
  }
  render() {
    const { todoData, term, filter } = this.state;
    const visibleItems = this.filter(this.search(todoData, term), filter);
    const doneCount = todoData.filter((el) => el.done).length;
    const todoCount = todoData.length - doneCount;
    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel onSearchChange={this.onSearchChange} />
          <ItemStatusFilter filter={filter} 
          onFilterChange={this.onFilterChange}/>
        </div>
        <TodoList todos={visibleItems}
          onDeleted={this.deleteItem}
          onToggleDone={this.onToggleDone}
          onToggleImportant={this.onToggleImportant} />
        <ItemAddForm addItem={this.addItem} />
      </div>
    );
  };
}
