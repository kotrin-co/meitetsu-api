import express from 'express'
import getLineUser from '../controllers/api/getLineUser'
import getAdmins from '../controllers/api/getAdmins'
import managerRegistration from '../controllers/api/managerRegistration'
import getManagers from '../controllers/api/getManagers'
import playerRegistration from '../controllers/api/playerRegistration'
import dailyRecord from '../controllers/api/dailyRecord'
import getRecords from '../controllers/api/getRecords'
import getTeamRecords from '../controllers/api/getTeamRecords'

const apiRouter = express.Router()

// ルーティング
apiRouter
  .post('/get-player', getLineUser)
  .post('/manager-registration', managerRegistration)
  .get('/managers', getManagers)
  .get('/admins', getAdmins)
  .post('/player-registration', playerRegistration)
  .post('/daily-record', dailyRecord)
  .post('/get-records', getRecords)
  .post('/get-team-records', getTeamRecords)

export default apiRouter
