const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const UserGroup = sequelize.define('usergroup', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    autoNull: false,
    primaryKey: true
  },
  isAdmin:{
    type:Sequelize.BOOLEAN,
    autoNull: false,
  }

});

module.exports = UserGroup;