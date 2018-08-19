import React from 'react';

import Config from '../../Config';

const checking = (props) => {
  return (
    <div>
      <div class="col-sm-3 pull-left">
      </div>
      <div class="col-sm-6 pull-left">
        <h2>{Config.message.authorisation}</h2>
      </div>
    </div>
  );
};

export default checking;
