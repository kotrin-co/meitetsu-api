import { Request, Response } from 'express'
import Admin from '../../models/Admin'

const getAdmins = async (req: Request, res: Response) => {
  const admin = new Admin()
  const data = await admin.getAdmins()

  res.status(201).json(data)
}

export default getAdmins
