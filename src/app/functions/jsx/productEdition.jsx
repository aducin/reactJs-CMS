import React from 'react';

import Config from '../../Config';

export const handleSelectOpts = (list) => {
  let selectList = [];
  list.forEach(el => {
    selectList.push(<option key={ el.id } value={ el.id }>{ el.name }</option>);
  });
  return selectList;
};

export const setContent = (product, name, descShort, description, linkRewrite, metaTitle, metaDesc, tags, quantity,
                     newPrice, oldPrice, manufactorer, active, condition, categories, image, additional, buttons) => {
  let title = Config.message.fullEdition + product.id;
  let urlPath = Config.url.path + String(product.id) + '-' + product.linkRewrite + '.html';
  return (
    <div class="container bgrContent paddingBottom2 paddingTop2 marginTop2 borderRadius10">
      <div class="col-xs-12 col-lg-9">
        <h2><a href={urlPath} target="blank">{title}</a></h2>
        {name}
        {descShort}
        {description}
        {linkRewrite}
        {metaTitle}
        {metaDesc}
        {tags}
        {quantity}
        {newPrice}
        {oldPrice}
        {manufactorer}
        {active}
        {condition}
        {categories}
        {image}
        {additional}
        {buttons}
      </div>
    </div>
  );
};
