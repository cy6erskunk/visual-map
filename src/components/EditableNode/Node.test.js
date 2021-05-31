import { fireEvent, render, screen } from '@testing-library/react';
import EditableNode from './Node';
import { getDataTree } from '../App/getDataTree';

test('renders not root node', () => {
  const data = 1;
  const [tree] = getDataTree(data);

  render(<EditableNode data={tree} />);
  const element = screen.getByText(/<root>/i);
  expect(element).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
});

test('renders empty node', () => {
  render(<EditableNode />);
  const element = screen.getByText(/<root>/i);
  expect(element).toBeInTheDocument();
});

test('renders string value node', () => {
  const data = 'foo';
  const [tree] = getDataTree(data);

  render(<EditableNode data={tree} />);
  expect(screen.getByText('"foo"')).toBeInTheDocument();
});

test('renders number value node', () => {
  const data = 123;
  const [tree] = getDataTree(data);

  render(<EditableNode data={tree} />);
  expect(screen.getByText('123')).toBeInTheDocument();
});

test('renders array node', () => {
  const data = [];
  const [tree] = getDataTree(data);

  render(<EditableNode data={tree} />);
  expect(screen.getByText('[')).toBeInTheDocument();
  expect(screen.getByText(']')).toBeInTheDocument();
});

test('renders array children', () => {
  const data = [123, [], 'foo'];
  const [tree] = getDataTree(data);

  render(<EditableNode data={tree} />);
  expect(screen.getAllByText('[').length).toBe(2);
  expect(screen.getAllByText(']').length).toBe(2);
  expect(screen.getByText('123')).toBeInTheDocument();
  expect(screen.getByText('"foo"')).toBeInTheDocument();
});

test('renders object node', () => {
  const data = { a: [] };
  const [tree] = getDataTree(data);

  render(<EditableNode data={tree} />);
  expect(screen.getByText('{')).toBeInTheDocument();
  expect(screen.getByText('}')).toBeInTheDocument();
});

test('renders object keys', () => {
  const data = { a: 123, b: [], c: 'foo', d: {} };
  const [tree] = getDataTree(data);

  render(<EditableNode data={tree} />);
  expect(screen.getAllByText('{').length).toBe(2);
  expect(screen.getAllByText('}').length).toBe(2);
  expect(screen.getByText('[')).toBeInTheDocument();
  expect(screen.getByText(']')).toBeInTheDocument();
  expect(screen.getByText('123')).toBeInTheDocument();
  expect(screen.getByText('"foo"')).toBeInTheDocument();
  Object.keys(data).forEach((key) =>
    expect(screen.getByText(`"${key}":`)).toBeInTheDocument()
  );
});

test('renders variable node', () => {
  const variableName = 'index';
  const data = { a: `$${variableName}` };
  const [tree] = getDataTree(data);

  render(<EditableNode data={tree} />);
  expect(screen.getByText(`VAR<${variableName}>`)).toBeInTheDocument();
});

test('renders value node with $ escaped', () => {
  const notAVariableName = '$notAVariableName';
  const data = `$${notAVariableName}`;
  const [tree] = getDataTree(data);

  render(<EditableNode data={tree} />);
  expect(screen.getByText(`"${notAVariableName}"`)).toBeInTheDocument();
});

test('remove is called', () => {
  const data = 1;
  const [tree] = getDataTree(data);
  const dispatch = jest.fn();

  render(<EditableNode data={tree} dispatch={dispatch} />);
  fireEvent.click(screen.getByRole('button', { name: /remove/i }));
  expect(dispatch).toBeCalledWith({
    type: 'remove',
    data: tree.id,
  });
});
