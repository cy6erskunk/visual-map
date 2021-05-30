import { render, screen } from '@testing-library/react';
import EditableNode from './Node';
import {getDataTree} from '../App/getDataTree'

test('renders not root node', () => {
  render(<EditableNode data={getDataTree(1)}/>);
  const element = screen.getByText(/<root>/i);
  expect(element).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /remove/i})).toBeInTheDocument()
});

test('renders empty node', () => {
  render(<EditableNode />);
  const element = screen.getByText(/<root>/i);
  expect(element).toBeInTheDocument();
});

test('renders string value node', () => {
  render(<EditableNode data={getDataTree('foo')}/>);
  expect(screen.getByText('"foo"')).toBeInTheDocument();
});

test('renders number value node', () => {
  render(<EditableNode data={getDataTree(123)}/>);
  expect(screen.getByText('123')).toBeInTheDocument();
});

test('renders array node', () => {
  render(<EditableNode data={getDataTree([])}/>);
  expect(screen.getByText('[')).toBeInTheDocument();
  expect(screen.getByText(']')).toBeInTheDocument();
});

test('renders array children', () => {
  render(<EditableNode data={getDataTree([123, [], "foo"])}/>);
  expect(screen.getAllByText('[').length).toBe(2);
  expect(screen.getAllByText(']').length).toBe(2);
  expect(screen.getByText('123')).toBeInTheDocument();
  expect(screen.getByText('"foo"')).toBeInTheDocument();
});

test('renders object node', () => {
  render(<EditableNode data={getDataTree({a: []})}/>);
  expect(screen.getByText('{')).toBeInTheDocument();
  expect(screen.getByText('}')).toBeInTheDocument();
});

test('renders object keys', () => {
  const data = {a: 123, b: [], c: "foo", d: {}};
  render(<EditableNode data={getDataTree(data)}/>);
  expect(screen.getAllByText('{').length).toBe(2);
  expect(screen.getAllByText('}').length).toBe(2);
  expect(screen.getByText('[')).toBeInTheDocument();
  expect(screen.getByText(']')).toBeInTheDocument();
  expect(screen.getByText('123')).toBeInTheDocument();
  expect(screen.getByText('"foo"')).toBeInTheDocument();
  Object.keys(data).forEach(key => expect(screen.getByText(`"${key}":`)).toBeInTheDocument());
});

test('renders variable node', () => {
  const variableName = "index";
  render(<EditableNode data={getDataTree({a: `$${variableName}`})}/>);
  expect(screen.getByText(`VAR<${variableName}>`)).toBeInTheDocument();
});

test('renders value node with $ escaped', () => {
  const data = "$notAVariableName";
  render(<EditableNode data={getDataTree(`$${data}`)}/>);
  expect(screen.getByText(`"${data}"`)).toBeInTheDocument();
});
