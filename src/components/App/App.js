import { useReducer } from 'react';
import './App.css';
import {reducer} from './reducer'
import EditableNode from '../EditableNode/Node'

export function getDataTree(data, parent) {
  let result;
  
  if (Array.isArray(data)) {
    result = {
      type: 'array',
      items: [],
      parent
    };
    data.forEach((item, index) => result.items.push({
      type: 'arrayItem',
      index,
      parent: result
    }));
    result.items.forEach((item, index) => item.value = getDataTree(data[index], item))
  }
  else if (typeof data === 'object') {
    result = {
      type: 'object',
      items: [],
      parent
    };
    Object.keys(data).forEach((objectKey, index) => result.items.push({
      type: 'objectItem',
      index,
      key: objectKey,
      parent: result
    }));
    result.items.forEach((item, index) => item.value = getDataTree(data[item.key], item))
  }
  else if (typeof data === 'string' && (/^\$[^$]/).test(data)) {
    result = {
      type: 'var',
      value: `VAR<${data.substring(1)}>`,
      parent
    }
  }
  else {
    result = {
      type: 'value',
      value: JSON.stringify((/^\$\$/).test(data) ? data.substring(1) : data),
      parent
    };
  }
  return result;
}

const initialData = [[], 1, {a: 123, b: [1, 2, 3], c: "$foo", d: {}}, '123', ["$$foo"]];
// const initialData = [1, 2, 3];

// console.log(getDataTree(initialData))

function App() {
  const [state, dispatch] = useReducer(reducer, getDataTree(initialData));

  return (
    <div className="App">
      <header className="App-header">
          visual map
      </header>
      <main>
        <EditableNode data={state} dispatch={dispatch}/>
      </main>
    </div>
  );
}

export default App;
