function regenerateIndices(array) {
  array.forEach((item, index) => {
    item.index = index;
  });
}

export const defaultState = [undefined, undefined];

export function reducer(state = defaultState, action) {
  const [tree, hash] = state;
  let newHash = Object.assign({}, hash);
  switch (action.type) {
    case 'remove':
      const element = hash[action.data];

      if (!element) {
        return [tree, newHash];
      }

      delete newHash[action.data];

      if (typeof element.parent === 'undefined') {
        return defaultState;
      }

      if (element.parent.type === 'arrayItem') {
        const arrayItem = element.parent;
        arrayItem.parent.items.splice(arrayItem.index, 1);
        regenerateIndices(arrayItem.parent.items);

        return [tree, newHash];
      } else if (element.parent.type === 'objectItem') {
        element.parent.parent.items.splice(element.parent.index, 1);
        regenerateIndices(element.parent.parent.items);

        return [tree, newHash];
      }
      break;
    default:
      throw new Error();
  }
}
