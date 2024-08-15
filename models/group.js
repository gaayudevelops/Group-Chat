const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Group = sequelize.define('group', {
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

});

module.exports = Group;