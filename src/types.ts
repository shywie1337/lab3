export interface TripPhoto {
  id: string
  caption: string
  url?: string
}

export interface NewTrip {
  title: string
  country: string
  city: string
  startDate: string
  endDate: string
  description: string
  tags: string[]
  places: string[]
  photos: TripPhoto[]
}

export interface Trip extends NewTrip {
  id: string
}

export interface TravelerProfile {
  name: string
  avatarUrl: string
  bio: string
}

