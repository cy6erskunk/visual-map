import './App.css';

import Node from '../Node/Node';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          visual map
      </header>
      <main>
        <Node data={[[], 1, {a: 123, b: [], c: "$foo", d: {}}, '123', ["$$foo"]]}/>
      </main>
    </div>
  );
}

export default App;
