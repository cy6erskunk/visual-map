function regenerateIndices(array) {
  return array.map((item, index) => {
    item.index = index;
    return item;
  });
}

export const defaultState = [undefined, undefined];

export function reducer(state = defaultState, action) {
  const [tree, hash] = state;
  let newHash = Object.assign({}, hash);

  switch (action.type) {
    case 'remove':
      const element = newHash[action.data];

      if (!element) {
        throw new Error('Element not found');
      }

      if (typeof element.parentId === 'undefined') {
        return defaultState;
      }

      delete newHash[element.id];

      if (
        newHash[element.parentId].type === 'arrayItem' ||
        newHash[element.parentId].type === 'objectItem'
      ) {
        const arrayItemElement = newHash[element.parentId];
        delete newHash[arrayItemElement.id];

        const arrayElement = Object.assign(
          {},
          newHash[arrayItemElement.parentId]
        );
        newHash[arrayElement.id] = arrayElement;

        let items = arrayElement.items
          .slice(0)
          .map((item) => Object.assign({}, item));

        items.splice(arrayItemElement.index, 1);
        arrayElement.items = regenerateIndices(items);
        arrayElement.items.forEach((item) => (newHash[item.id] = item));

        if (!arrayElement.parentId) {
          newHash[newHash.root] = arrayElement;
          return [arrayElement, newHash];
        } else {
          newHash[arrayElement.parentId].value = arrayElement;
        }

        return [tree, newHash];
      }
      break;
    default:
      throw new Error();
  }
}
