import { useReducer } from 'react';
import './App.css';
import { reducer } from './reducer';
import { getDataTree } from './getDataTree';
import EditableNode from '../EditableNode/Node';

const initialData = [
  [],
  1,
  { a: 123, b: [1, 2, 3], c: '$foo', d: {} },
  '123',
  ['$$foo <- not var'],
];

function App() {
  const [state, dispatch] = useReducer(reducer, getDataTree(initialData));

  return (
    <div className="App">
      <header className="App-header">visual map</header>
      <main>
        <EditableNode data={state} nodeId={state?.root} dispatch={dispatch} />
        <pre>{JSON.stringify(state, undefined, 2)}</pre>
      </main>
    </div>
  );
}

export default App;
