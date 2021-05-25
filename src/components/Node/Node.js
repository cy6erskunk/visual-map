import './Node.css'

function getContents(data, level) {
  let contents = null;

  if (level === 0) {
    contents = (<>
      <div>{"<root>"}</div>
      <Node data={data} level={level+1}/></>);
  }
  else if (Array.isArray(data)) {
    contents = (<>
      <div>{"["}</div>
      {data.map((item, index) => (<Node key={`node_${level}_${index}`} data={item} level={level+1}/>))}
      <div>{"]"}</div>
    </>)
  }
  else if (typeof data === 'object') {
    contents = (<>
      <div>{"{"}</div>
      {Object.keys(data).map((objectKey, index) => (
        <div className={`object-key-node`} key={`node_${level}_${index}`}>
          {`"${objectKey}": `}
          <Node data={data[objectKey]} level={level+1}/>
        </div>
      ))}
      <div>{"}"}</div>
    </>)
  }
  else if (typeof data === 'string' && (/^\$[^$]/).test(data)) {
    contents = (<div>{`VAR<${data.substring(1)}>`}</div>)
  }
  else {
    contents = (<div>{JSON.stringify((/^\$\$/).test(data) ? data.substring(1) : data)}</div>)
  }
  
  return contents;
}

export default function Node({data, level = 0}) {
  return (<div className={`data-node level__${level}`}>{getContents(data, level)}</div>)
}