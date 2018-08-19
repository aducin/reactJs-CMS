import React from 'react';

import { checkWarning } from '../../../functions/product/basicModal/checkWarning';
import Input from '../../dumb/Input.jsx';
import Label from '../../dumb/Label.jsx';

const name = ( props ) => {
  let state = props.state;
  let nameBorder = checkWarning(state, 'name', 'borderWarning');
  let nameError = checkWarning(state, 'name', 'classWarning');
  return(
    <div class="marginTop20px paddingBottom30px">
      <Label labelClass={nameError} heightRow="4" name="Nazwa:" />
      <Input
        additionalClass={nameBorder}
        heightRow="8"
        placeholder="Podaj nazwę"
        changeHandler={ (e) => props.actione(e) }
        name="name"
        value={props.name}
        disable={ props.disabled }
      />
    </div>
  );
};

export default name;
