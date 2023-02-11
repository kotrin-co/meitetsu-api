import { Request, Response } from 'express'
import Admin from '../../models/Admin'

const getAdmin = async (req: Request, res: Response) => {
  console.log('get-admin!!', req.body)
  const { email } = req.body
  const admin = new Admin()
  const data = await admin.get(email)

  res.status(200).json(data)
}

export default getAdmin
