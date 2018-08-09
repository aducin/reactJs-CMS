import React from 'react';

import axios from 'axios';
import { Subject } from 'rxjs/Subject';

import Config from '../Config';

class MainModel {
  success = new Subject();
  warning = new Subject();

  constructor() {}

  checkToken(token) {
    let path = Config.url.serverPath + 'login?token=' + token;
    return axios.get(path);
  }

  setMessage(type, value) {
    if (type === 'success') {
      this.success.next(value);
    } else {
      this.warning.next(value);
    }
  }
}

const mainModelInstance = new MainModel();
Object.freeze(mainModelInstance);

export default mainModelInstance;
