import { Request, Response } from 'express'
import Admin from '../../models/Admin'

const getManagers = async (req: Request, res: Response) => {
  console.log('get-managers!!')
  const admin = new Admin()
  const data = await admin.getManagers()

  res.status(201).json(data)
}

export default getManagers
