import './Node.css';

function buttons(dispatch, parentId, length) {
  return (
    <>
      <button
        onClick={() =>
          dispatch({
            type: 'add',
            data: { type: 'array', parentId, length },
          })
        }
      >
        {'[]'}
      </button>
      <button
        onClick={() =>
          dispatch({
            type: 'add',
            data: { type: 'object', parentId, length },
          })
        }
      >
        {'{}'}
      </button>
    </>
  );
}

function getContents(data, nodeId, level, dispatch) {
  let contents = null;

  if (level === 0) {
    contents = (
      <>
        <div>{'<root>'}</div>
        {data && nodeId ? (
          <Node
            data={data}
            nodeId={nodeId}
            level={level + 1}
            dispatch={dispatch}
          />
        ) : (
          buttons(dispatch, undefined)
        )}
      </>
    );
  } else if (data[nodeId]?.type === 'array') {
    const node = data[nodeId];
    contents = (
      <>
        <div>{'['}</div>
        {node.items.map((item, index) => (
          <Node
            key={`node_${level}_${index}`}
            data={data}
            nodeId={data[item.id].valueId}
            level={level + 1}
            dispatch={dispatch}
          />
        ))}
        {buttons(dispatch, node.id, node.items.length)}
        <div>{']'}</div>
      </>
    );
  } else if (data[nodeId]?.type === 'object') {
    const node = data[nodeId];
    contents = (
      <>
        <div>{'{'}</div>
        {node.items.map((item, index) => (
          <div className={`object-key-node`} key={`node_${level}_${index}`}>
            {`"${data[item.id].key}": `}
            <Node
              data={data}
              nodeId={data[item.id].valueId}
              level={level + 1}
              dispatch={dispatch}
            />
          </div>
        ))}
        <div>{'}'}</div>
      </>
    );
  } else if (data[nodeId]?.type === 'var') {
    contents = <div>{`VAR<${data[nodeId].value}>`}</div>;
  } else if (data[nodeId]?.type === 'value') {
    contents = <div>{data[nodeId].value}</div>;
  } else {
    throw new Error(
      `Unknown node: ${JSON.stringify(
        data[nodeId]
      )} (${nodeId} => ${JSON.stringify(data)})`
    );
  }

  return contents;
}

export default function Node({ data, nodeId, level = 0, dispatch }) {
  return (
    <div className={`data-node level__${level}`}>
      {getContents(data, nodeId, level, dispatch)}
      {level !== 0 && nodeId ? (
        <button onClick={() => dispatch({ type: 'remove', data: nodeId })}>
          {'remove'}
        </button>
      ) : null}
    </div>
  );
}
