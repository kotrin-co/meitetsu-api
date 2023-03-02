export type LineUserData = {
  lineId: string
  lineName: string
  followedAt: string
}

export type PlayerData = LineUserData & {
  sex: string
  birthday: string
  agreement: boolean
  displayName: string
  positions: string[]
  team: string
}

export type PlayerRegistrationData = {
  idToken: string
  birthday: string
  sex: string
  team: string
  displayName: string
  positions: string
  agreement: string
}

export type AdminData = {
  email: string
  name: string
  team: string
  type: 'admin' | 'manager'
  registeredAt: string
}

export type RecordData = {
  lineId: string
  date: string
  content: string
  createdAt: string
  remarks: string
  updatedAt: string
  weight: number
}

export type ManagerComment = {
  email: string
  name: string
  comment: string
  createdAt: string
  updatedAt: string
}
