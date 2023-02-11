import express from 'express'
import getLineUser from '../controllers/api/getLineUser'
import getAdmin from '../controllers/api/getAdmin'
import managerRegistration from '../controllers/api/managerRegistration'

const apiRouter = express.Router()

// ルーティング
apiRouter
  .post('/get-player', getLineUser)
  .post('/get-admin', getAdmin)
  .post('/manager-registration', managerRegistration)

export default apiRouter
