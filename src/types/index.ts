export type LineUserData = {
  lineId: string;
  lineName: string;
  followedAt: string;
};

export type AdminData = {
  email: string
  name: string
  team: string
  type: 'admin' | 'manager'
  registeredAt: string
}