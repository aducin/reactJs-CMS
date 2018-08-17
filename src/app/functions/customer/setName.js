import Config from '../../Config';

export const setName = (data) => {
  let name;
  if (data.gender) {
    name = data.gender + ' ';
  }
  name += data.firstname + ' ' + data.lastname;
  return name;
};
