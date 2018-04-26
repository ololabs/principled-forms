'use strict';

const path = require('path');

module.exports = {
  name: 'principled-forms',

  treeForAddon() {
    return this._super.treeForAddon.call(this, `${__dirname}/build`);
  }
};
