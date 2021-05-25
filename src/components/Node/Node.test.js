import { render, screen } from '@testing-library/react';
import Node from './Node';

test('renders root node', () => {
  render(<Node />);
  const element = screen.getByText(/<root>/i);
  expect(element).toBeInTheDocument();
});

test('renders empty node', () => {
  render(<Node />);
  const element = screen.getByText(/<root>/i);
  expect(element).toBeInTheDocument();
});

test('renders string value node', () => {
  render(<Node data={'foo'}/>);
  expect(screen.getByText('"foo"')).toBeInTheDocument();
});

test('renders number value node', () => {
  render(<Node data={123}/>);
  expect(screen.getByText('123')).toBeInTheDocument();
});

test('renders array node', () => {
  render(<Node data={[]}/>);
  expect(screen.getByText('[')).toBeInTheDocument();
  expect(screen.getByText(']')).toBeInTheDocument();
});

test('renders array children', () => {
  render(<Node data={[123, [], "foo"]}/>);
  expect(screen.getAllByText('[').length).toBe(2);
  expect(screen.getAllByText(']').length).toBe(2);
  expect(screen.getByText('123')).toBeInTheDocument();
  expect(screen.getByText('"foo"')).toBeInTheDocument();
});

test('renders object node', () => {
  render(<Node data={{a: []}}/>);
  expect(screen.getByText('{')).toBeInTheDocument();
  expect(screen.getByText('}')).toBeInTheDocument();
});

test('renders object keys', () => {
  const data = {a: 123, b: [], c: "foo", d: {}};
  render(<Node data={data}/>);
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
  render(<Node data={{a: `$${variableName}`}}/>);
  expect(screen.getByText(`VAR<${variableName}>`)).toBeInTheDocument();
});

test('renders value node with $ escaped', () => {
  const data = "$notAVariableName";
  render(<Node data={`$${data}`}/>);
  expect(screen.getByText(`"${data}"`)).toBeInTheDocument();
});
