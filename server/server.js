const express = require('express');
const path = require('path');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

const routes = require('./routes');
app.use(routes);

// const getFreshTeams = require('./services/addTeams/espn_teams')
// const getFreshSchedule = require('./services/updateSchedules/espn_schedules_fresh')
// const updateSchedule = require('./services/commonServices/updateSchedules/espn_schedules_update')

db.once('open', () => {
  // getFreshTeams({
  //   dropTable: true
  // })
  // getFreshSchedule({
  //   dropTable: false,
  //   current: false,
  //   season: 2020,
  //   seasonType: [2,3]
  // })
  // updateSchedule({
  //   current: true
  // })
  app.listen(PORT, () => console.log(`Now listening on ${PORT}`))
})