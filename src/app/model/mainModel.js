import React from 'react';

import Config from '../Config';

import axios from 'axios';

const MainModel = {
  checkToken: (token) => {
    let path = Config.url.serverPath + 'login?token=' + token;
    return axios.get(path);
  }
}

export default MainModel;