import setVal from 'lodash/set';
import getVal from 'lodash/get';

export const clear = () => {
  return window.localStorage.setItem('duelour', JSON.stringify({}));
};

export const set = (path, value) => {
  const currentStorage = Object.assign(
    {},
    JSON.parse(window.localStorage.getItem('duelour'))
  );
  const newStorage = setVal(currentStorage, path, value);
  return window.localStorage.setItem('duelour', JSON.stringify(newStorage));
};

export const get = path => {
  const currentStorage = JSON.parse(window.localStorage.getItem('duelour'));
  return getVal(currentStorage, path, {});
};
