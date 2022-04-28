import React, { ChangeEvent, FC, useRef, useState } from 'react';
import './Todo.css';
import TextField from '@mui/material/TextField';
import { Button, ButtonGroup } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

interface ToDoObject {
  id: string;
  chore: string;
  done?: boolean;
  edited: boolean;
}

const Todo: FC = () => {

  //
  const [focusedToDo, setFocusedToDo] = useState<string>('');
  const [toDos, setToDos] = useState<Array<ToDoObject>>([]);
  const [editingIndex, setEditingIndex] = useState<number>();

  const mainForm = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (focusedToDo) {
      if (typeof editingIndex === 'number') {
        const copyOfToDos = [...toDos];
        // copyOfToDos[editingIndex] = {...copyOfToDos[editingIndex], chore: focusedToDo};
        Object.assign(copyOfToDos[editingIndex] , { chore: focusedToDo, edited: true });
        setToDos(copyOfToDos);
      } else {
        setToDos([{ id: uuidv4(), chore: focusedToDo, edited: false, done: false }, ...toDos]);
      }
      resetForm();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFocusedToDo(event.target.value);
  };

  const handleDelete = (id: string) => {
    setToDos(toDos.filter((toDoObject) => toDoObject.id !== id));
    resetForm();
  };

  const handleEdit = (indexOfElement: number) => {
    const chore = toDos[indexOfElement].chore;
    setFocusedToDo(chore);
    setEditingIndex(indexOfElement);
  };

  const handleChecked = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const copy = [...toDos];
    copy[index].done = event.target.checked;
    setToDos(copy);
  };

  const resetForm = () => {
    if (mainForm.current !== null) {
      setFocusedToDo('');
      setEditingIndex(undefined);
      mainForm.current.reset();
    }
  };

  const deleteCheckedElements = () => {
    setToDos(toDos.filter(toDo => !toDo.done));
  }

  const isEditing = () => {
    return typeof editingIndex === 'number';
  }

  return (
    <div className="toDo" data-testid="Todo">
      <h1>To do</h1>
      <form ref={mainForm} id="toDoForm" className={'border'} onSubmit={(e: React.SyntheticEvent) => handleSubmit(e)}>
        <TextField disabled={isEditing()}  id="main-input-field" name="toDoInputField" onChange={handleChange} label="To do"
                   variant="standard"/>
        <Button disabled={focusedToDo === '' || isEditing()} type="submit" variant="outlined">Add</Button>
      </form>
      {
        toDos.length !== 0 &&
        (<ul id={'toDos'}>
            {
              toDos.map((toDo: ToDoObject, i) => {
                return (
                  <li key={toDo.id} className="toDoItem border">
                    <div>
                      {editingIndex === i ?
                        <form id="toDoEditForm"
                              onSubmit={handleSubmit}>
                          <TextField id="edit-input-field" name="toDoEditField" onChange={handleChange} label="To do"
                                     variant="standard" value={focusedToDo}/>
                          <Button type="submit" variant="outlined">Save</Button>
                        </form>
                        :
                        toDo?.chore
                      }
                      <input style={{ float:'right' }} type="checkbox" onChange={(e: ChangeEvent<HTMLInputElement>) => handleChecked(e, i)}
                             defaultChecked={toDo?.done}/>
                    </div>
                    <ButtonGroup id="btnGroup" variant="text" aria-label="group of buttons">
                      <Button onClick={() => handleEdit(i)}>Edit</Button>
                      <Button onClick={() => handleDelete(toDo.id)}>Delete</Button>
                    </ButtonGroup>
                  </li>
                );
              })
            }
          </ul>
        )
      }

      {
        toDos.some((toDo) => toDo.done) && <Button onClick={() => deleteCheckedElements()}>Delete all</Button>
      }
    </div>
  );
};

export default Todo;
