const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Message = sequelize.define('message', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    autoNull: false,
    primaryKey: true
  },

  name: {
    type: Sequelize.STRING,
    autoNull: false,
  },

  message: {
    type: Sequelize.STRING,
    autoNull: false,
  },

  to: {
    type: Sequelize.INTEGER,
    autoNull: false, 
  }

});

module.exports = Message;