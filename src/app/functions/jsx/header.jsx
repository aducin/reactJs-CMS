import React from 'react';

export const setListCategories = (categories, activeCategory, noData) => {
  let listCategories = categories.map((el, index) => {
    return <option key={index + 1} value={categories[index].id}>{categories[index].metaTitle}</option>;
  });
  if (activeCategory === 0) {
    var check = categories.findIndex(function(el) { el.id == noData.id; });
    if (check === -1) {
      listCategories.unshift(<option key="0" value={ noData.id }>{ noData.nameCategory }</option>);
    }
  }
  return listCategories;
};

export const setListManufactorers = (manufactorer, activeManufactorer, noData) => {
  let listManufactorers = manufactorer.map((el, index) => {
    return <option key={index + 1} value={manufactorer[index].id}>{manufactorer[index].name}</option>;
  });
  if (activeManufactorer === 0) {
    var check = manufactorer.findIndex(function(el) { el.id == noData.id; });
    if (check === -1) {
      listManufactorers.unshift(<option key="0" value={ noData.id }>{ noData.nameManufactorer }</option>);
    }
  }
  return listManufactorers;
};
