'use strict';

const logger = {
  data: null,
  
  message: function (description) {
    console.info(description);
    console.info(this.data);
    const jsonString = JSON.stringify(this.data, null, 2);
    console.info(jsonString);
    return this;
  },

  withFields: function (data) {
    this.data = data;
    return this;
  },
};

module.exports = logger;
