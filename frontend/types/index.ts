export type SubscriptionTier = 'free' | 'individual' | 'organization'
export type AccessTier = 'free' | 'premium' | 'organization'
export type OrganizationRole = 'admin' | 'member'

export interface User {
  id: string
  email: string
  displayName: string
  subscriptionTier: SubscriptionTier
  preferences: Record<string, any>
  createdAt: string
}

export interface UserInterest {
  id: string
  userId: string
  categories: string[]
  regions: string[]
  topics: string[]
}

export interface Article {
  id: string
  title: string
  content: string
  summary: string
  source: string
  sourceUrl: string
  author: string
  publishedAt: string
  categories: string[]
  accessTier: AccessTier
  featuredImage?: string
}

export interface Organization {
  id: string
  name: string
  subscription: Record<string, any>
  createdAt: string
}

export interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  role: OrganizationRole
}

