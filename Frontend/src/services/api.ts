import type { 
  BodyMember, 
  Circular, 
  CourtCase, 
  Division, 
  EventItem, 
  ForumPost, 
  ForumTopic, 
  Manual, 
  MemberCount, 
  Membership,
  MutualTransfer, 
  PaymentMethod,
  Suggestion,
  ExternalLink,
  ExternalLinkCategory
} from '../types'

// Base URL for backend API
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5001'

// Token management
const TOKEN_KEY = 'crea:token'
const getToken = () => localStorage.getItem(TOKEN_KEY)
const setToken = (t: string | null) => t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY)

// Fetch helper
async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = { ...(opts.headers as Record<string,string> | undefined) }
  // Only set JSON header if body is not FormData
  const isForm = typeof FormData !== 'undefined' && opts.body instanceof FormData
  if (!isForm) headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers })
  if (!res.ok) {
    let msg = `Request failed (${res.status})`
    try {
      const data = (await res.json()) as { message?: string }
      msg = data?.message || msg
    } catch { /* ignore JSON parse errors */ }
    throw new Error(msg)
  }
  // 204 No Content
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

// Utilities
const toDateStr = (d?: string | Date) => {
  if (!d) return ''
  const dt = typeof d === 'string' ? new Date(d) : d
  if (Number.isNaN(dt.getTime())) return ''
  return dt.toISOString().split('T')[0]
}

export async function getMemberCounts(): Promise<MemberCount[]> {
  const res = await request<{ memberCounts: MemberCount[]; totals: { divisions: number; members: number; courtCases: number } }>('/api/stats/summary')
  return res.memberCounts
}

export async function getTotals(): Promise<{ divisions: number; members: number; courtCases: number }> {
  const res = await request<{ memberCounts: MemberCount[]; totals: { divisions: number; members: number; courtCases: number } }>('/api/stats/summary')
  return res.totals
}

// Events
type EventDTO = { _id: string; title: string; description?: string; date?: string; createdAt?: string; location?: string; photos?: string[]; breaking?: boolean; isBreakingNews?: boolean }
export async function getEvents(): Promise<EventItem[]> {
  const list = await request<EventDTO[]>('/api/events')
  return list.map(e => ({
    id: e._id,
    title: e.title,
    date: toDateStr(e.date ?? e.createdAt),
    location: e.location || '',
    description: e.description || '',
    photos: Array.isArray(e.photos) ? e.photos : [],
    breaking: e.breaking || e.isBreakingNews || false,
  }))
}

export async function createEvent(input: Omit<EventItem, 'id'>): Promise<EventItem> {
  const payload = { ...input, isBreakingNews: !!input.breaking }
  const e = await request<EventDTO>('/api/events', { method: 'POST', body: JSON.stringify(payload) })
  return {
    id: e._id,
    title: e.title,
    date: toDateStr(e.date ?? e.createdAt),
    location: e.location || '',
    description: e.description || '',
    photos: Array.isArray(e.photos) ? e.photos : [],
    breaking: e.breaking || e.isBreakingNews || false,
  }
}

export async function updateEvent(id: string, patch: Partial<EventItem>): Promise<EventItem> {
  const payload = { ...patch, isBreakingNews: patch.breaking }
  const e = await request<EventDTO>(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  return {
    id: e._id,
    title: e.title,
    date: toDateStr(e.date ?? e.createdAt),
    location: e.location || '',
    description: e.description || '',
    photos: Array.isArray(e.photos) ? e.photos : [],
    breaking: e.breaking || e.isBreakingNews || false,
  }
}

export async function deleteEvent(id: string): Promise<{ success: boolean }> {
  await request(`/api/events/${id}`, { method: 'DELETE' })
  return { success: true }
}

// Circulars
type CircularDTO = { _id: string; boardNumber: string; subject: string; dateOfIssue: string; url: string }
export async function getCirculars(): Promise<Circular[]> {
  const list = await request<CircularDTO[]>('/api/circulars')
  return list.map(c => ({ id: c._id, boardNumber: c.boardNumber, subject: c.subject, dateOfIssue: toDateStr(c.dateOfIssue), url: c.url }))
}
export async function createCircular(input: Omit<Circular, 'id'> & { file?: File }): Promise<Circular> {
  let body: BodyInit
  if (input.file) {
    const fd = new FormData()
    fd.append('boardNumber', input.boardNumber)
    fd.append('subject', input.subject)
    fd.append('dateOfIssue', input.dateOfIssue)
    fd.append('file', input.file)
    body = fd
  } else {
    body = JSON.stringify(input)
  }
  const c = await request<CircularDTO>('/api/circulars', { method: 'POST', body })
  return { id: c._id, boardNumber: c.boardNumber, subject: c.subject, dateOfIssue: toDateStr(c.dateOfIssue), url: c.url }
}
export async function updateCircular(id: string, patch: Partial<Circular> & { file?: File }): Promise<Circular> {
  let body: BodyInit
  if (patch.file) {
    const fd = new FormData()
    if (patch.boardNumber) fd.append('boardNumber', patch.boardNumber)
    if (patch.subject) fd.append('subject', patch.subject)
    if (patch.dateOfIssue) fd.append('dateOfIssue', patch.dateOfIssue)
    fd.append('file', patch.file)
    body = fd
  } else {
    body = JSON.stringify(patch)
  }
  const c = await request<CircularDTO>(`/api/circulars/${id}`, { method: 'PUT', body })
  return { id: c._id, boardNumber: c.boardNumber, subject: c.subject, dateOfIssue: toDateStr(c.dateOfIssue), url: c.url }
}
export async function deleteCircular(id: string): Promise<{ success: boolean }> {
  await request(`/api/circulars/${id}`, { method: 'DELETE' })
  return { success: true }
}

// Manuals
type ManualDTO = { _id: string; title: string; url: string }
export async function getManuals(): Promise<Manual[]> {
  const list = await request<ManualDTO[]>('/api/manuals')
  return list.map(m => ({ id: m._id, title: m.title, url: m.url }))
}
export async function createManual(input: Omit<Manual, 'id'> & { file?: File }): Promise<Manual> {
  let body: BodyInit
  if (input.file) {
    const fd = new FormData()
    fd.append('title', input.title)
    fd.append('file', input.file)
    body = fd
  } else {
    body = JSON.stringify(input)
  }
  const m = await request<ManualDTO>('/api/manuals', { method: 'POST', body })
  return { id: m._id, title: m.title, url: m.url }
}
export async function updateManual(id: string, patch: Partial<Manual> & { file?: File }): Promise<Manual> {
  let body: BodyInit
  if (patch.file) {
    const fd = new FormData()
    if (patch.title) fd.append('title', patch.title)
    fd.append('file', patch.file)
    body = fd
  } else {
    body = JSON.stringify(patch)
  }
  const m = await request<ManualDTO>(`/api/manuals/${id}`, { method: 'PUT', body })
  return { id: m._id, title: m.title, url: m.url }
}
export async function deleteManual(id: string): Promise<{ success: boolean }> {
  await request(`/api/manuals/${id}`, { method: 'DELETE' })
  return { success: true }
}

// Court cases
type CourtCaseDTO = { _id: string; caseNumber: string; date: string; subject: string }
export async function getCourtCases(): Promise<CourtCase[]> {
  const list = await request<CourtCaseDTO[]>('/api/court-cases')
  return list.map(c => ({ id: c._id, caseNumber: c.caseNumber, date: toDateStr(c.date), subject: c.subject }))
}
export async function createCourtCase(input: Omit<CourtCase, 'id'>): Promise<CourtCase> {
  const c = await request<CourtCaseDTO>('/api/court-cases', { method: 'POST', body: JSON.stringify(input) })
  return { id: c._id, caseNumber: c.caseNumber, date: toDateStr(c.date), subject: c.subject }
}
export async function updateCourtCase(id: string, patch: Partial<CourtCase>): Promise<CourtCase> {
  const c = await request<CourtCaseDTO>(`/api/court-cases/${id}`, { method: 'PUT', body: JSON.stringify(patch) })
  return { id: c._id, caseNumber: c.caseNumber, date: toDateStr(c.date), subject: c.subject }
}
export async function deleteCourtCase(id: string): Promise<{ success: boolean }> {
  await request(`/api/court-cases/${id}`, { method: 'DELETE' })
  return { success: true }
}

// Suggestions
type SuggestionDTO = { _id: string; userId: string; userName: string; text: string; fileNames?: string[]; createdAt: string }
export async function getSuggestions(): Promise<Suggestion[]> {
  const list = await request<SuggestionDTO[]>('/api/suggestions')
  return list.map(s => ({ id: s._id, userId: s.userId, userName: s.userName, text: s.text, fileNames: s.fileNames || [], createdAt: new Date(s.createdAt).toISOString() }))
}
export async function submitSuggestion(payload: { text: string; files: File[]; userId: string; userName: string }): Promise<{ success: boolean }> {
  const body = { userId: payload.userId, userName: payload.userName, text: payload.text, fileNames: (payload.files || []).map(f => f.name) }
  await request('/api/suggestions', { method: 'POST', body: JSON.stringify(body) })
  return { success: true }
}

// Mutual transfers
type MutualTransferDTO = {
  id?: string
  _id?: string
  post: string
  currentLocation: string
  desiredLocation: string
  availabilityDate?: string | null
  notes?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  isActive?: boolean
  ownerId?: string
  ownerDesignation?: string
  ownerDivision?: string
  createdAt?: string | null
  updatedAt?: string | null
}

const toMutual = (dto: MutualTransferDTO): MutualTransfer => ({
  id: dto.id || dto._id || '',
  post: dto.post,
  currentLocation: dto.currentLocation,
  desiredLocation: dto.desiredLocation,
  availabilityDate: dto.availabilityDate ?? null,
  notes: dto.notes ?? '',
  contactName: dto.contactName ?? '',
  contactEmail: dto.contactEmail ?? '',
  contactPhone: dto.contactPhone ?? '',
  isActive: dto.isActive ?? false,
  ownerId: dto.ownerId ?? '',
  ownerDesignation: dto.ownerDesignation ?? '',
  ownerDivision: dto.ownerDivision ?? '',
  createdAt: dto.createdAt ?? null,
  updatedAt: dto.updatedAt ?? null,
})

export async function getMutualTransfers(params?: { post?: string; current?: string; desired?: string; includeInactive?: boolean }): Promise<MutualTransfer[]> {
  const search = new URLSearchParams()
  if (params?.post) search.set('post', params.post)
  if (params?.current) search.set('current', params.current)
  if (params?.desired) search.set('desired', params.desired)
  if (params?.includeInactive) search.set('includeInactive', String(params.includeInactive))
  const q = search.toString()
  const list = await request<MutualTransferDTO[]>(`/api/mutual-transfers${q ? `?${q}` : ''}`)
  return list.map(toMutual)
}

export async function getMyMutualTransfers(): Promise<MutualTransfer[]> {
  const list = await request<MutualTransferDTO[]>('/api/mutual-transfers/mine')
  return list.map(toMutual)
}

type MutualTransferPayload = {
  post: string
  currentLocation: string
  desiredLocation: string
  notes?: string
  contactPhone?: string
  contactEmail?: string
  contactName?: string
  availabilityDate?: string | null
}

export async function createMutualTransfer(payload: MutualTransferPayload): Promise<MutualTransfer> {
  const dto = await request<MutualTransferDTO>('/api/mutual-transfers', { method: 'POST', body: JSON.stringify(payload) })
  return toMutual(dto)
}

export async function updateMutualTransfer(id: string, patch: Partial<MutualTransferPayload> & { isActive?: boolean }): Promise<MutualTransfer> {
  const dto = await request<MutualTransferDTO>(`/api/mutual-transfers/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
  return toMutual(dto)
}

export async function deleteMutualTransfer(id: string): Promise<{ success: boolean }> {
  await request(`/api/mutual-transfers/${id}`, { method: 'DELETE' })
  return { success: true }
}

// Admin function to get all transfers (including inactive)
export async function getAllMutualTransfers(): Promise<MutualTransfer[]> {
  const list = await request<MutualTransferDTO[]>('/api/mutual-transfers?includeInactive=true')
  return list.map(toMutual)
}

// Forum
type ForumTopicDTO = { _id: string; title: string; author: string; createdAt: string; createdAtStr?: string; replies?: number }
export async function getForumTopics(): Promise<ForumTopic[]> {
  const list = await request<ForumTopicDTO[]>('/api/forum/topics')
  return list.map(t => ({ id: t._id, title: t.title, author: t.author, createdAt: t.createdAtStr || new Date(t.createdAt).toISOString(), replies: t.replies ?? 0 }))
}
type ForumPostDTO = { _id: string; author: string; content: string; createdAt: string; createdAtStr?: string; likesCount?: number; comments?: Array<{ author: string; content: string; createdAtStr?: string }> }
export async function getForumPosts(topicId: string): Promise<ForumPost[]> {
  const list = await request<ForumPostDTO[]>(`/api/forum/topics/${topicId}/posts`)
  return list.map(p => ({ id: p._id, topicId, author: p.author, content: p.content, createdAt: p.createdAtStr || new Date(p.createdAt).toISOString(), likesCount: p.likesCount || 0, comments: (p.comments || []).map(c => ({ author: c.author, content: c.content, createdAt: c.createdAtStr || undefined })) }))
}

// Create a reply/post under a topic
export async function createForumPost(topicId: string, content: string): Promise<{ id: string; author: string; content: string; createdAt: string }> {
  const payload = { content }
  const p = await request<ForumPostDTO>(`/api/forum/topics/${topicId}/posts`, { method: 'POST', body: JSON.stringify(payload) })
  return { id: p._id, author: p.author, content: p.content, createdAt: p.createdAtStr || new Date(p.createdAt).toISOString() }
}

// Toggle like for a post
export async function toggleLikePost(topicId: string, postId: string): Promise<{ likesCount: number; liked: boolean }> {
  const res = await request<{ likesCount: number; liked: boolean }>(`/api/forum/topics/${topicId}/posts/${postId}/like`, { method: 'POST' })
  return res
}

// Add a comment to a post (nested comment)
export async function addCommentToPost(topicId: string, postId: string, content: string): Promise<{ author: string; content: string; createdAt?: string }> {
  const res = await request<{ author: string; content: string; createdAtStr?: string }>(`/api/forum/topics/${topicId}/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ content }) })
  return { author: res.author, content: res.content, createdAt: res.createdAtStr }
}

// Delete a forum post
export async function deleteForumPost(topicId: string, postId: string): Promise<{ success: boolean }> {
  await request(`/api/forum/topics/${topicId}/posts/${postId}`, { method: 'DELETE' })
  return { success: true }
}

// Delete a comment from a post
export async function deletePostComment(topicId: string, postId: string, commentIndex: number): Promise<{ success: boolean }> {
  await request(`/api/forum/topics/${topicId}/posts/${postId}/comments/${commentIndex}`, { method: 'DELETE' })
  return { success: true }
}

export async function createForumTopic(input: Omit<ForumTopic, 'id' | 'replies' | 'createdAt'> & { createdAt?: string; replies?: number }): Promise<ForumTopic> {
  const t = await request<ForumTopicDTO>('/api/forum/topics', { method: 'POST', body: JSON.stringify(input) })
  return { id: t._id, title: t.title, author: t.author, createdAt: t.createdAtStr || new Date(t.createdAt).toISOString(), replies: t.replies ?? 0 }
}
export async function updateForumTopic(id: string, patch: Partial<ForumTopic>): Promise<ForumTopic> {
  const t = await request<ForumTopicDTO>(`/api/forum/topics/${id}`, { method: 'PUT', body: JSON.stringify(patch) })
  return { id: t._id, title: t.title, author: t.author, createdAt: t.createdAtStr || new Date(t.createdAt).toISOString(), replies: t.replies ?? 0 }
}
export async function deleteForumTopic(id: string): Promise<{ success: boolean }> {
  await request(`/api/forum/topics/${id}`, { method: 'DELETE' })
  return { success: true }
}

// Membership
export type MembershipResponse = {
  success: boolean
  membershipId?: string
  paymentStatus?: string
  message?: string
}

export type MembershipFormData = Omit<Membership, 'id' | 'membershipId' | 'createdAt' | 'updatedAt' | 'renewalHistory' | 'documents'> & {
  documents?: File[]
}

export async function submitMembership(form: MembershipFormData): Promise<MembershipResponse> {
  const formData = new FormData()
  
  // Add basic fields
  Object.entries(form).forEach(([key, value]) => {
    if (key !== 'documents' && key !== 'personalDetails' && key !== 'professionalDetails') {
      formData.append(key, String(value))
    }
  })

  // Add nested objects
  if (form.personalDetails) {
    Object.entries(form.personalDetails).forEach(([key, value]) => {
      if (value) formData.append(`personalDetails[${key}]`, String(value))
    })
  }

  if (form.professionalDetails) {
    Object.entries(form.professionalDetails).forEach(([key, value]) => {
      if (value) formData.append(`professionalDetails[${key}]`, String(value))
    })
  }

  // Add documents
  if (form.documents) {
    form.documents.forEach((file, index) => {
      formData.append(`documents[${index}]`, file)
    })
  }

  return request<MembershipResponse>('/api/memberships', { method: 'POST', body: formData })
}

export async function getMembership(id: string): Promise<Membership> {
  return request<Membership>(`/api/memberships/${id}`)
}

export async function getMembershipByUser(): Promise<Membership | null> {
  return request<Membership | null>('/api/memberships/me')
}

export async function renewMembership(id: string, payload: { paymentMethod: PaymentMethod; paymentAmount: number }): Promise<MembershipResponse> {
  return request<MembershipResponse>(`/api/memberships/${id}/renew`, { method: 'PUT', body: JSON.stringify(payload) })
}

export async function getMembershipStats(): Promise<{
  byStatus: Array<{ _id: string; count: number }>
  byDepartment: Array<{ _id: string; count: number }>
  byType: Array<{ _id: string; count: number }>
  total: { count: number }
}> {
  return request('/api/memberships/stats')
}

// Auth
export type User = { 
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
  designation?: string
  division?: string
  department?: string
  mobile?: string
  membershipType?: string
}

type AuthDTO = { 
  _id: string
  name: string
  email: string
  role?: 'admin' | 'member'
  token?: string
  designation?: string
  division?: string
  department?: string
  mobile?: string
  membershipType?: string
}
export async function register(username: string, name: string, password: string): Promise<User> {
  if (!username || !name || !password) throw new Error('All fields are required')
  // Map username -> email
  const res = await request<AuthDTO>('/api/users/register', { method: 'POST', body: JSON.stringify({ name, email: username, password }) })
  const token = res.token as string
  if (token) setToken(token)
  return { 
    id: res._id, 
    name: res.name, 
    email: res.email, 
    role: (res.role || 'member'),
    designation: res.designation,
    division: res.division,
    department: res.department,
    mobile: res.mobile,
    membershipType: res.membershipType
  }
}

export async function login(username: string, password: string): Promise<User> {
  if (!username || !password) throw new Error('Invalid credentials')
  const res = await request<AuthDTO>('/api/users/login', { method: 'POST', body: JSON.stringify({ email: username, password }) })
  const token = res.token as string
  if (token) setToken(token)
  return { 
    id: res._id, 
    name: res.name, 
    email: res.email, 
    role: (res.role || 'member'),
    designation: res.designation,
    division: res.division,
    department: res.department,
    mobile: res.mobile,
    membershipType: res.membershipType
  }
}

export async function logout(): Promise<{ success: boolean }> {
  setToken(null)
  return { success: true }
}

// OTP Auth
export async function requestOtp(email: string, name?: string): Promise<{ success: boolean; message?: string }> {
  if (!email) throw new Error('Email is required')
  return request('/api/auth/request-otp', { method: 'POST', body: JSON.stringify({ email, name }) })
}

type VerifyOtpDTO = { _id: string; name: string; email: string; role?: 'admin' | 'member'; token?: string; designation?: string; division?: string; department?: string; mobile?: string; membershipType?: string }
export async function verifyOtp(email: string, code: string, name?: string, password?: string): Promise<User> {
  if (!email || !code) throw new Error('Email and OTP code are required')
  const res = await request<VerifyOtpDTO>('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, code, name, password }) })
  const token = (res as unknown as { token?: string }).token
  if (token) setToken(token)
  return { 
    id: res._id, 
    name: res.name, 
    email: res.email, 
    role: (res.role || 'member'),
    designation: res.designation,
    division: res.division,
    department: res.department,
    mobile: res.mobile,
    membershipType: res.membershipType
  }
}

// Profile update
export async function updateProfile(data: { name?: string; designation?: string; division?: string; department?: string; mobile?: string }): Promise<User> {
  const res = await request<AuthDTO>('/api/users/profile', { method: 'PUT', body: JSON.stringify(data) })
  return {
    id: res._id,
    name: res.name,
    email: res.email,
    role: (res.role || 'member'),
    designation: res.designation,
    division: res.division,
    department: res.department,
    mobile: res.mobile,
    membershipType: res.membershipType
  }
}

// Get current user profile
export async function getProfile(): Promise<User> {
  const res = await request<AuthDTO>('/api/users/profile', { method: 'GET' })
  return {
    id: res._id,
    name: res.name,
    email: res.email,
    role: (res.role || 'member'),
    designation: res.designation,
    division: res.division,
    department: res.department,
    mobile: res.mobile,
    membershipType: res.membershipType
  }
}

// Body members (no backend yet)
// Body Members
type BodyMemberDTO = { _id: string; name: string; designation: string; photoUrl: string; division: Division }
export async function getBodyMembers(division?: Division): Promise<BodyMember[]> {
  const q = division ? `?division=${division}` : ''
  const list = await request<BodyMemberDTO[]>(`/api/body-members${q}`)
  return list.map(m => ({ id: m._id, name: m.name, designation: m.designation, photoUrl: m.photoUrl, division: m.division }))
}

export async function createBodyMember(input: Omit<BodyMember, 'id'>): Promise<BodyMember> {
  const m = await request<BodyMemberDTO>('/api/body-members', { method: 'POST', body: JSON.stringify(input) })
  return { id: m._id, name: m.name, designation: m.designation, photoUrl: m.photoUrl, division: m.division }
}

export async function updateBodyMember(id: string, patch: Partial<Omit<BodyMember, 'id'>>): Promise<BodyMember> {
  const m = await request<BodyMemberDTO>(`/api/body-members/${id}`, { method: 'PUT', body: JSON.stringify(patch) })
  return { id: m._id, name: m.name, designation: m.designation, photoUrl: m.photoUrl, division: m.division }
}

export async function deleteBodyMember(id: string): Promise<{ success: boolean }> {
  await request(`/api/body-members/${id}`, { method: 'DELETE' })
  return { success: true }
}

// Backward-compatible no-op used by pages that previously seeded demo data locally
export async function loadDemoData(): Promise<void> {
  // Intentionally left blank. In production, data comes from the backend.
  // If you want to seed demo data conditionally, implement it here.
}

// Lightweight real-time notifications (intra-tab/app) for stats changes
export function notifyStatsChanged(): void {
  if (typeof window !== 'undefined' && 'dispatchEvent' in window) {
    window.dispatchEvent(new CustomEvent('crea:stats-changed'))
  }
}

// Admin: Users
type UserDTO = { _id: string; name: string; email: string; role: 'admin' | 'member'; designation?: string; division?: string; department?: string; mobile?: string; membershipType?: 'Ordinary' | 'Lifetime' | 'None' }
export type MemberUser = { id: string; name: string; email: string; role: 'admin' | 'member'; designation: string; division: Division | ''; department: string; mobile?: string; membershipType: 'Ordinary' | 'Lifetime' | 'None' }

function toMemberUser(u: UserDTO): MemberUser {
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    designation: u.designation || '',
    division: (u.division as Division) || '',
    department: u.department || '',
    mobile: u.mobile,
    membershipType: (u.membershipType || 'None'),
  }
}

export async function adminListUsers(params?: { division?: Division; role?: 'admin'|'member' }): Promise<MemberUser[]> {
  const q = new URLSearchParams()
  if (params?.division) q.set('division', params.division)
  if (params?.role) q.set('role', params.role)
  const list = await request<UserDTO[]>(`/api/users${q.toString() ? `?${q.toString()}`:''}`)
  return list.map(toMemberUser)
}

export async function adminUpdateUser(id: string, patch: Partial<Omit<MemberUser,'id'|'email'>> & { role?: 'admin'|'member' }): Promise<MemberUser> {
  // Map back to DTO shape
  const body: Record<string, unknown> = { ...patch }
  const u = await request<UserDTO>(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(body) })
  return toMemberUser(u)
}

// External Links
type ExternalLinkDTO = {
  _id: string
  title: string
  url: string
  category: ExternalLinkCategory
  description?: string
  order: number
  isActive: boolean
}

export async function getExternalLinks(): Promise<{ [key: string]: ExternalLink[] }> {
  const list = await request<{ [key: string]: ExternalLinkDTO[] }>('/api/external-links')
  const result: { [key: string]: ExternalLink[] } = {}
  
  Object.entries(list).forEach(([category, links]) => {
    result[category] = links.map(link => ({
      id: link._id,
      title: link.title,
      url: link.url,
      category: link.category,
      description: link.description,
      order: link.order,
      isActive: link.isActive
    }))
  })
  
  return result
}

export async function createExternalLink(input: Omit<ExternalLink, 'id' | 'isActive'>): Promise<ExternalLink> {
  const link = await request<ExternalLinkDTO>('/api/external-links', {
    method: 'POST',
    body: JSON.stringify(input)
  })
  
  return {
    id: link._id,
    title: link.title,
    url: link.url,
    category: link.category,
    description: link.description,
    order: link.order,
    isActive: link.isActive
  }
}

export async function updateExternalLink(id: string, patch: Partial<Omit<ExternalLink, 'id'>>): Promise<ExternalLink> {
  const link = await request<ExternalLinkDTO>(`/api/external-links/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch)
  })
  
  return {
    id: link._id,
    title: link.title,
    url: link.url,
    category: link.category,
    description: link.description,
    order: link.order,
    isActive: link.isActive
  }
}

export async function deleteExternalLink(id: string): Promise<{ success: boolean }> {
  await request(`/api/external-links/${id}`, { method: 'DELETE' })
  return { success: true }
}

// Settings
export interface Setting {
  key: string
  value: any
  description?: string
  category?: string
}

export async function getSettings(category?: string): Promise<Setting[]> {
  const query = category ? `?category=${category}` : ''
  const res = await request<{ success: boolean; settings: Setting[] }>(`/api/settings${query}`)
  return res.settings
}

export async function getSettingByKey(key: string): Promise<Setting | null> {
  try {
    const res = await request<{ success: boolean; setting: Setting }>(`/api/settings/${key}`)
    return res.setting
  } catch {
    return null
  }
}

export async function upsertSetting(setting: Setting): Promise<Setting> {
  const res = await request<{ success: boolean; setting: Setting }>('/api/settings', {
    method: 'POST',
    body: JSON.stringify(setting)
  })
  return res.setting
}

export async function updateMultipleSettings(settings: Setting[]): Promise<Setting[]> {
  const res = await request<{ success: boolean; settings: Setting[] }>('/api/settings/bulk', {
    method: 'PUT',
    body: JSON.stringify({ settings })
  })
  return res.settings
}

export async function getMembershipPricing(): Promise<{ ordinary: number; lifetime: number }> {
  try {
    const settings = await getSettings('Membership Settings')
    const ordinaryPrice = settings.find(s => s.key === 'membership_ordinary_price')?.value ?? 500
    const lifetimePrice = settings.find(s => s.key === 'membership_lifetime_price')?.value ?? 10000
    return {
      ordinary: typeof ordinaryPrice === 'number' ? ordinaryPrice : 500,
      lifetime: typeof lifetimePrice === 'number' ? lifetimePrice : 10000
    }
  } catch {
    return { ordinary: 500, lifetime: 10000 }
  }
}

