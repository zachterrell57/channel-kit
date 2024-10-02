export type ChannelMetadata = {
  id: string
  url: string
  name: string
  description: string
  object: "channel"
  created_at: number
  follower_count: number
  image_url: string
  parent_url: string
  moderator: {
    object: "user"
    fid: number
    username: string
    display_name: string
    custody_address: string
    pfp_url: string
    profile: {
      bio: {
        text: string
        mentioned_profiles: string[]
      }
    }
    follower_count: number
    following_count: number
    verifications: string[]
    verified_addresses: {
      eth_addresses: string[]
      sol_addresses: string[]
    }
    active_status: string
    power_badge: boolean
    viewer_context: {
      following: boolean
      followed_by: boolean
    }
  }
  viewer_context: {
    following: boolean
  }
}

export type User = {
  object: "user"
  fid: number
  custody_address: string
  username: string
  display_name: string
  pfp_url: string
  profile: {
    text: string
  }
  follower_count: number
  following_count: number
  verifications: string[]
  verified_addresses: {
    eth_addresses: string[]
    sol_addresses: string[]
  }
  active_status: string
  power_badge: boolean
}

export type Cast = {
  object: string
  hash: string
  thread_hash: string
  parent_hash: string | null
  parent_url: string | null
  root_parent_url: string | null
  parent_author: {
    fid: number | null
  }
  author: User
  text: string
  timestamp: string
  embeds: any[]
  reactions: {
    likes_count: number
    recasts_count: number
    likes: Array<{ fid: number; fname: string }>
    recasts: Array<{ fid: number; fname: string }>
  }
  replies: {
    count: number
  }
  channel: {
    object: string
    id: string
    name: string
    image_url: string
  } | null
  mentioned_profiles: User[]
}

export type Member = {
  object: string
  channel_id: string
  role: string
  user: User
}
