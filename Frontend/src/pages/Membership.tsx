import { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import { submitMembership } from '../services/api'
import SectionHeader from '../components/SectionHeader'
import { usePageTitle } from '../hooks/usePageTitle'
import { DIVISIONS } from '../types'
import type { MembershipFormData } from '../services/api'
import FileUploader from '../components/FileUploader'

const MEMBERSHIP_FEES = {
  ordinary: 500,
  lifetime: 10000
}

type Form = MembershipFormData

export default function Membership() {
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [membershipId, setMembershipId] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<Form>({
    name: '', 
    designation: '', 
    division: 'BSL', 
    department: '', 
    place: '', 
    unit: '', 
    mobile: '', 
    email: '',
    type: 'ordinary',
    paymentMethod: 'upi',
    paymentStatus: 'pending',
    paymentAmount: 500,
    status: 'pending',
    personalDetails: {},
    professionalDetails: {},
    documents: []
  })
  
  usePageTitle('CREA • Choose Your Membership Plan')

  const startApplication = (type: 'ordinary' | 'lifetime') => {
    setForm(f => ({
      ...f,
      type,
      paymentAmount: type === 'lifetime' ? MEMBERSHIP_FEES.lifetime : MEMBERSHIP_FEES.ordinary
    }))
    setShowForm(true)
  }

  const onBasicInfoChange = (k: keyof Omit<Form, 'personalDetails' | 'professionalDetails' | 'documents'>, v: string | number) => {
    setForm((f) => ({ 
      ...f, 
      [k]: v,
      paymentAmount: k === 'type' && v === 'lifetime' ? MEMBERSHIP_FEES.lifetime : MEMBERSHIP_FEES.ordinary
    }))
  }

  const onPersonalDetailsChange = (k: keyof Required<Form>['personalDetails'], v: string) => {
    setForm((f) => ({ ...f, personalDetails: { ...f.personalDetails, [k]: v } }))
  }

  const onProfessionalDetailsChange = (k: keyof Required<Form>['professionalDetails'], v: string | number) => {
    setForm((f) => ({ ...f, professionalDetails: { ...f.professionalDetails, [k]: v } }))
  }

  const onDocumentsChange = (files: File[]) => {
    setForm((f) => ({ ...f, documents: files }))
  }

  const submit = async () => {
    setSubmitting(true)
    try {
      const res = await submitMembership(form)
      if (res.success && res.membershipId) {
        setMembershipId(res.membershipId)
        setStep(5) // Success step
      }
    } catch (error) {
      console.error('Membership submission error:', error)
    }
    setSubmitting(false)
  }

  if (!showForm) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Choose Your Membership Plan</h1>
          <p className="text-lg text-gray-600 mb-12">Join a community of professionals dedicated to growth and collaboration.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Ordinary Membership Card */}
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105">
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-blue-900 mb-4">Ordinary Membership</h3>
              <p className="text-gray-600 mb-4">Ideal for staying connected and accessing annual benefits.</p>
              
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold text-gray-900">₹500</span>
                <span className="text-gray-500 ml-2">/ year</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Access to all events
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Forum participation
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Receive circulars & updates
                </li>
              </ul>

              <button
                onClick={() => startApplication('ordinary')}
                className="w-full bg-blue-900 text-white rounded-lg py-3 font-semibold hover:bg-blue-800 transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Lifetime Membership Card */}
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105">
            <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
              RECOMMENDED
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-blue-900 mb-4">Lifetime Membership</h3>
              <p className="text-gray-600 mb-4">A one-time payment for a lifetime of benefits and support.</p>
              
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold text-gray-900">₹10,000</span>
                <span className="text-gray-500 ml-2">one-time</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  All Ordinary benefits, for life
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Priority event registration
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Special recognition
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  No annual renewals
                </li>
              </ul>

              <button
                onClick={() => startApplication('lifetime')}
                className="w-full bg-orange-500 text-white rounded-lg py-3 font-semibold hover:bg-orange-600 transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setShowForm(false)}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <SectionHeader title="Apply for Membership" subtitle="Fill in your details and complete payment." />
      </div>

      {membershipId ? (
        <div className="rounded-md border bg-white p-6">
          <h2 className="text-lg font-semibold text-green-800">Application Submitted Successfully</h2>
          <p className="mt-2 text-sm text-gray-700">Membership ID: <span className="font-mono">{membershipId}</span></p>
          <p className="mt-1 text-sm text-gray-500">Your membership will be activated after payment verification.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            {[1,2,3,4].map((i) => (
              <span key={i} className={`px-2 py-1 rounded ${step>=i?'bg-blue-900 text-white':'bg-gray-200'}`}>{i}. {['Basic','Personal','Professional','Payment'][i-1]}</span>
            ))}
          </div>

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Name *" value={form.name} onChange={(e)=>onBasicInfoChange('name', e.target.value)} />
              <Input label="Designation *" value={form.designation} onChange={(e)=>onBasicInfoChange('designation', e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Division *</label>
                <select
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                  value={form.division}
                  onChange={(e)=> onBasicInfoChange('division', e.target.value)}
                >
                  {DIVISIONS.map((d)=> (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <Input label="Department *" value={form.department} onChange={(e)=>onBasicInfoChange('department', e.target.value)} />
              <Input label="Place of working *" value={form.place} onChange={(e)=>onBasicInfoChange('place', e.target.value)} />
              <Input label="Unit *" value={form.unit} onChange={(e)=>onBasicInfoChange('unit', e.target.value)} />
              <Input label="Mobile Number *" value={form.mobile} onChange={(e)=>onBasicInfoChange('mobile', e.target.value)} />
              <Input label="Email ID *" type="email" value={form.email} onChange={(e)=>onBasicInfoChange('email', e.target.value)} />
              <div className="md:col-span-2 flex justify-end">
                <Button 
                  onClick={()=> setStep(2)} 
                  disabled={!form.name || !form.designation || !form.mobile || !form.email || !form.division}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 rounded-md border bg-white p-6">
              <h3 className="text-lg font-medium text-gray-900">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  type="date" 
                  label="Date of Birth" 
                  value={form.personalDetails.dateOfBirth || ''} 
                  onChange={(e)=>onPersonalDetailsChange('dateOfBirth', e.target.value)} 
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                    value={form.personalDetails.gender || ''}
                    onChange={(e)=>onPersonalDetailsChange('gender', e.target.value as 'male' | 'female' | 'other')}
                  >
                    <option value="">Select gender...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Input 
                  label="Address" 
                  value={form.personalDetails.address || ''} 
                  onChange={(e)=>onPersonalDetailsChange('address', e.target.value)} 
                />
                <Input 
                  label="City" 
                  value={form.personalDetails.city || ''} 
                  onChange={(e)=>onPersonalDetailsChange('city', e.target.value)} 
                />
                <Input 
                  label="State" 
                  value={form.personalDetails.state || ''} 
                  onChange={(e)=>onPersonalDetailsChange('state', e.target.value)} 
                />
                <Input 
                  label="PIN Code" 
                  value={form.personalDetails.pincode || ''} 
                  onChange={(e)=>onPersonalDetailsChange('pincode', e.target.value)} 
                />
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={()=>setStep(1)}>Back</Button>
                <Button onClick={()=>setStep(3)}>Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 rounded-md border bg-white p-6">
              <h3 className="text-lg font-medium text-gray-900">Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Employee ID" 
                  value={form.professionalDetails.employeeId || ''} 
                  onChange={(e)=>onProfessionalDetailsChange('employeeId', e.target.value)} 
                />
                <Input 
                  type="date" 
                  label="Joining Date" 
                  value={form.professionalDetails.joiningDate || ''} 
                  onChange={(e)=>onProfessionalDetailsChange('joiningDate', e.target.value)} 
                />
                <Input 
                  type="number" 
                  label="Experience (years)" 
                  value={form.professionalDetails.experience || ''} 
                  onChange={(e)=>onProfessionalDetailsChange('experience', parseInt(e.target.value))} 
                />
                <Input 
                  label="Specialization" 
                  value={form.professionalDetails.specialization || ''} 
                  onChange={(e)=>onProfessionalDetailsChange('specialization', e.target.value)} 
                />
              </div>

              <div className="mt-6 space-y-4">
                <h4 className="font-medium text-gray-900">Required Documents</h4>
                <FileUploader 
                  accept="image/*,.pdf"
                  maxFiles={3}
                  onFiles={onDocumentsChange}
                  hint="Upload your ID proof, photo, and signature (max 3 files)"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={()=>setStep(2)}>Back</Button>
                <Button onClick={()=>setStep(4)}>Next</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-md border bg-white p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(['upi', 'qr', 'card', 'netbanking'] as const).map((method) => (
                    <label key={method} className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none">
                      <input
                        type="radio"
                        name="payment"
                        className="sr-only"
                        checked={form.paymentMethod === method}
                        onChange={() => onBasicInfoChange('paymentMethod', method)}
                      />
                      <div className="flex flex-1">
                        <div className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900 capitalize">{method}</span>
                          <span className="mt-1 flex items-center text-sm text-gray-500">
                            {method === 'upi' && 'Pay using UPI apps'}
                            {method === 'qr' && 'Scan QR code to pay'}
                            {method === 'card' && 'Credit/Debit card'}
                            {method === 'netbanking' && 'Internet banking'}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`absolute -inset-px rounded-lg border-2 pointer-events-none ${
                          form.paymentMethod === method ? 'border-blue-500' : 'border-transparent'
                        }`}
                        aria-hidden="true"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-md border bg-white p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Membership Type</span>
                    <span className="font-medium text-gray-900 capitalize">{form.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium text-gray-900">{form.type === 'lifetime' ? 'Lifetime' : '1 year'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-medium text-gray-900">₹{form.paymentAmount}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between">
                      <span className="text-base font-medium text-gray-900">Total Amount</span>
                      <span className="text-base font-medium text-gray-900">₹{form.paymentAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={()=>setStep(3)}>Back</Button>
                <Button onClick={submit} disabled={submitting} loading={submitting}>
                  {submitting ? 'Processing...' : `Pay ₹${form.paymentAmount}`}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}