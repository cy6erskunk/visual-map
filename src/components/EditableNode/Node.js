import './Node.css'

function getContents(data, level, dispatch) {
  let contents = null;

  if (level === 0) {
    contents = (<>
      <div>{"<root>"}</div>
      {data ? <Node data={data} level={level+1} dispatch={dispatch} /> : null}
      
    </>);
  }
  else if (data.type === 'array') {
    contents = (<>
      <div>{"["}</div>
      {data.items.map((item, index) => (<Node parent={data.parent} key={`node_${level}_${index}`} data={item.value} level={level+1} dispatch={dispatch} />))}
      <div>{"]"}</div>
    </>)
  }
  else if (data.type === 'object') {
    contents = (<>
      <div>{"{"}</div>
      {data.items.map((item, index) => (
        <div className={`object-key-node`} key={`node_${level}_${index}`}>
          {`"${item.key}": `}
          <Node parent={data.parent} data={item.value} level={level+1} dispatch={dispatch} />
        </div>
      ))}
      <div>{"}"}</div>
    </>)
  }
  else if (data.type === 'var') {
    contents = (<div>{`VAR<${data.value.substring(1)}>`}</div>)
  }
  else if (data.type === 'value') {
    contents = (<div>{data.value}</div>)
  }
  
  return contents;
}

export default function Node({data, level = 0, dispatch}) {
  
  return (<div className={`data-node level__${level}`}>
    {getContents(data, level, dispatch)}
    {level !== 0 ? (<button onClick={() => dispatch({type: 'remove', data})}>{"remove"}</button>) : null} 
  </div>)
}