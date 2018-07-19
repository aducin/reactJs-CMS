import React from 'react';

import axios from 'axios';

import Config from '../Config';

const LoginModel = {
  checkToken: (token) => {
    let url = Config.url.serverPath + 'login?token=' + token;
    return axios.get(url);
  },
  login: (params, curConfig) => {
    let url = Config.url.serverPath + 'login';
    return axios.post(url, {params}, curConfig);
  }
};

export default LoginModel;