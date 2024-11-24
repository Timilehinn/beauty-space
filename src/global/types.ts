export interface UserType {
  id: number
  type: 'Owner' | 'User' | 'Manager' | 'Staff'
  created_at: string
  updated_at: any
}

export interface AccountType {
  id: number
  user_id: number
  account_type_id: number
  created_at: string
  updated_at: string
  user_type: UserType
  permissions: Array<Permission>
}

type DeviceToken = {
  created_at: string
  id: number
  notification_token: string
  updated_at: string
  user_id: number
}

export type Gift = {
  amount_paid: string
  created_at: string
  discount_id: number | null
  gifted_id: number
  id: number
  is_gifted: boolean
  payment_status: 'success' | 'failed'
  qr_code: string
  transaction_date: string
  transaction_id: string
  updated_at: string
  user: UserDetails
}

export type Permission = {
  id: number
  name: string
  created_at: string
  updated_at: string
  pivot: {
    user_account_type_id: number
    permission_id: number
  }
}

interface SubscriptionPlan {
  amount: number
  created_at: string | null
  id: number
  interval: 'monthly' | 'annual'
  plan: string
  updated_at: string | null
}

export type ActiveSubscription = {
  amount: number
  created_at: string | null
  id: number
  plan_id: number
  start_date: string
  status: 'active' | 'inactive' | 'cancelled'
  subscription_id: number | null
  subscription_plan: SubscriptionPlan
  updated_at: string | null
  user_id: number
}

export type UserDetails = {
  id: number
  first_name: string
  last_name: string
  email: string
  address: string
  city: string
  state: string
  country: string
  gender: string
  date_of_birth: string
  language: string
  deleted_at: any
  created_at: string
  updated_at: string
  provider: any
  phone_number: any
  profile_url: string
  timezone: string
  has_password: boolean
  email_verified_at: null | string
  account_type: AccountType[]
  booked_workspaces: any[]
  workspace_favourites: any[]
  settings: any
  notifications: any[]
  social_account: string
  device_token: DeviceToken
  gifts: Array<Gift>
  permissions: string[]
  subscriptions: ActiveSubscription[]
  billings: any[]
  business?: {
    id: number
    name: string
  }
}

export type OpeningHour = {
  created_at: string
  day: number
  id: number
  is_selected: boolean
  opening_hours: Array<string>
  updated_at: string
  user_id: number
  workspaces_id: number
}

export interface Group {
  id: number
  name: string
  asset_urls: {
    url: string
    workspaces_id: number
  }[]
  user_id: number
  created_at: string
  updated_at: string
}

export interface SpaceServicesI {
  id: number
  name: string
  price: number
  min_hour: number
  home_service_price: number
  created_at: string
  updated_at: string
  groups: Group[]
  images?: { url: string; workspaces_id: number }[]
  photos?: { url: string; workspaces_id: number }[]
  type: 'home-service' | 'walk-in'
}

export type Team = {
  id: number
  user_id: number
  owner_id: number
  created_at: Date | string
  updated_at: Date | string
  owner: UserDetails
  user: UserDetails & { role: AccountType }
}

export type Business = {
  id: number
  name: string
  description: string
  address: string
  city: string
  state: string
  country: string
  mentorship_available: boolean
  available_space: number
  price: number
  agreement: boolean
  status: string
  user_id: number
  created_at: Date
  updated_at: Date
  deleted_at: null
  is_featured: boolean
  lat: number
  lng: number
  slug: string
  category_id: number
  open_hours: string
  opening_hours: Array<OpeningHour>
  type: {
    id: number
    url?: string
    workspaces_id: number
    created_at: Date
    updated_at: Date
    type?: string
  }
  qr_code: string
  photos: {
    id: number
    url?: string
    workspaces_id: number
    created_at: Date
    updated_at: Date
    type?: string
  }[]
  owner: UserDetails
  services: SpaceServicesI[]
  brand_color: string[]
  team: Team[]
  subscriptions: ActiveSubscription[]
}

export type GroupedServiceItem = {
  groupId: number
  id: number
  name: string
  price: number
  min_hour: number
  home_service_price: number
  type: string
  created_at: Date | string
  updated_at: Date | string
  images: { url: string; id?: number; workspace_id?: number }[]
}

export type GroupedService = {
  asset_urls: { url: string; id: number }[]
  created_at: Date | string
  updated_at: Date | string
  id: number
  name: string
  user_id: number
  services: Array<GroupedServiceItem>
  isPackage: boolean
  packagePrice: number
  bgColor?: string
}

export type Availability = {
  day: number
  opening_hours: Array<string>
  opening_hour: Array<string>
  isSelected: boolean
}

export type Discount = {
  code: string
  created_at: string
  deleted_at: string | null
  started_at: string
  expired_at: string
  id: number
  percentage: number
  updated_at: string
  user_id: number
  workspaces_id: number
  workspace: Business
}

export type Customer = {
  id: number
  first_name: string
  last_name: string
  email: string
  phone_number: string
  address: string | null
  city: string | null
  country: string | null
  date_of_birth: string | null
  device_token: string | null
  email_verified_at: string | null
  gender: string | null
  has_password: boolean
  interest: string | null
  is_referred: boolean
  language: string | null
  profile_url: string
  provider: string | null
  referral: string | null
  referred_by: string | null
  state: string | null
  timezone: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type LoyaltyCustomer = {
  id: number
  code: string
  business_id: number
  customer: Customer
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  user_id: number
}

export type CreateLoyalCustomer = {
  first_name: string
  last_name: string
  email: string
  phone_number: string
}

export type PaginatedResponseGenerics<Data> = {
  current_page: number
  data: Array<Data>
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: {
    url: string | null
    label: string
    active: boolean
  }[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export type BusinessResponse = Business[]

export type StaffReport = {
  booking_date: string
  manager: string
  service_id: number
  service_name: string
  staff: string
  total_cost: number
  total_service_count: number
}

export interface People {
  city: string | null
  country: string | null
  date_of_birth: string // ISO 8601 date string
  email: string
  first_name: string
  gender: 'Male' | 'Female' | string // Using union type but allowing other strings for flexibility
  has_password: boolean
  id: number
  last_name: string
  phone_number: string
  profile_url: string
}

// Link item in the links array
export interface PageLink {
  url: string | null
  label: string
  active: boolean
}

// Main pagination response type
export interface PaginatedPeopleResponse {
  current_page: number
  data: People[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: PageLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface Referral {
  id: number
  referral_code: string
  code_creation_date: string
  created_at: string
  updated_at: string
}

export interface People {
  id: number
  uuid: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  profile_url: string | null
  date_of_birth: string | null
  gender: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  timezone: string | null
  device_token: string | null
  has_password: boolean
  interest: string | null
  is_referred: boolean
  referral: Referral | null
  referred_by: string | null // Adjust type if more details exist
  booked_workspaces: Business[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}
