'use client'

import * as React from 'react'
import {
  User,
  Save,
  Plus,
  Trash2,
  Heart,
  Activity,
  Shield,
  Phone,
  Pill,
  AlertCircle,
  CheckCircle2,
  Users
} from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import type { UserProfile } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown']

const RELATIONSHIPS: Array<{ id: UserProfile['relationship']; label: string }> = [
  { id: 'self', label: 'Self / Primary' },
  { id: 'spouse', label: 'Spouse / Partner' },
  { id: 'child', label: 'Child / Dependent' },
  { id: 'parent', label: 'Parent' },
  { id: 'other', label: 'Other' },
]

export function UserProfileCard({ onSaved }: { onSaved?: () => void }) {
  const {
    userProfile,
    savedProfiles,
    saveOrUpdateProfile,
    switchProfile,
    deleteProfile,
  } = useDiagnosisStore()

  const [form, setForm] = React.useState<UserProfile>({ ...userProfile })

  // Synchronize form when active profile changes
  React.useEffect(() => {
    setForm({ ...userProfile })
  }, [userProfile])

  // Automatically calculate BMI whenever height or weight changes
  const computedBmi = React.useMemo(() => {
    const h = parseFloat(form.height || '')
    const w = parseFloat(form.weight || '')
    if (h > 50 && w > 10) {
      const heightInMeters = h / 100
      const val = (w / (heightInMeters * heightInMeters)).toFixed(1)
      const num = parseFloat(val)
      let cat: UserProfile['bmiCategory'] = 'Normal'
      if (num < 18.5) cat = 'Underweight'
      else if (num >= 25 && num < 30) cat = 'Overweight'
      else if (num >= 30) cat = 'Obese'
      return { bmi: val, category: cat }
    }
    return { bmi: '', category: '' as UserProfile['bmiCategory'] }
  }, [form.height, form.weight])

  const handleSave = () => {
    const updated: UserProfile = {
      ...form,
      name: form.name?.trim() || 'Patient',
      bmi: computedBmi.bmi || form.bmi || '',
      bmiCategory: computedBmi.category || form.bmiCategory || '',
    }
    saveOrUpdateProfile(updated)
    toast.success(`Profile for "${updated.name}" saved!`)
    if (onSaved) onSaved()
  }

  const handleAddNew = () => {
    const newProf: UserProfile = {
      id: `prof-${Date.now()}`,
      name: `Family Member ${savedProfiles.length + 1}`,
      age: '',
      gender: 'male',
      relationship: 'child',
      bloodGroup: 'Unknown',
      height: '',
      weight: '',
      bmi: '',
      bmiCategory: '',
      conditions: '',
      allergies: '',
      medications: '',
      emergencyContact: '',
    }
    saveOrUpdateProfile(newProf)
    switchProfile(newProf.id!)
    toast.info('Created new patient profile. Please enter details.')
  }

  const handleDelete = (id: string, name: string) => {
    if (savedProfiles.length <= 1) {
      toast.error('You must keep at least one profile.')
      return
    }
    deleteProfile(id)
    toast.success(`Profile "${name}" removed.`)
  }

  return (
    <div className="space-y-5">
      {/* Profile Switcher Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-emerald-500" />
            Patient Profiles ({savedProfiles.length})
          </Label>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleAddNew}
            className="h-7 text-xs text-emerald-600 dark:text-emerald-400 gap-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Family Member
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {savedProfiles.map((p) => {
            const isActive = (p.id || 'default-self') === (userProfile.id || 'default-self')
            return (
              <button
                key={p.id || p.name}
                type="button"
                onClick={() => switchProfile(p.id!)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2',
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-card hover:bg-muted/60 text-muted-foreground border-border'
                )}
              >
                <User className="h-3.5 w-3.5" />
                <span>{p.name || 'Unnamed Patient'}</span>
                {p.relationship && p.relationship !== 'self' && (
                  <span className="text-[10px] opacity-80 uppercase font-mono">({p.relationship})</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Profile Form */}
      <Card className="border-emerald-500/20 shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600">
                <User className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold">{form.name || 'Patient Profile'}</h4>
                <p className="text-[11px] text-muted-foreground">Used to contextualize clinical diagnoses & PDF reports</p>
              </div>
            </div>

            {savedProfiles.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(form.id || '', form.name)}
                className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">Full Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Johnathan Doe"
                className="h-9 text-xs"
              />
            </div>

            {/* Relationship */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">Profile Relationship</Label>
              <select
                value={form.relationship || 'self'}
                onChange={(e) => setForm({ ...form, relationship: e.target.value as any })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {RELATIONSHIPS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Age & Gender */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">Age (Years) *</Label>
              <Input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="e.g. 35"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Gender</Label>
              <RadioGroup
                value={form.gender}
                onValueChange={(v) => setForm({ ...form, gender: v as any })}
                className="flex gap-4 pt-1.5"
              >
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="male" id="p-male" />
                  <Label htmlFor="p-male" className="text-xs cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="female" id="p-female" />
                  <Label htmlFor="p-female" className="text-xs cursor-pointer">Female</Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="other" id="p-other" />
                  <Label htmlFor="p-other" className="text-xs cursor-pointer">Other</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Blood Group */}
            <div className="space-y-1">
              <Label className="text-xs font-medium flex items-center gap-1">
                <Heart className="h-3 w-3 text-red-500" /> Blood Group
              </Label>
              <select
                value={form.bloodGroup || 'Unknown'}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-1">
              <Label className="text-xs font-medium flex items-center gap-1">
                <Phone className="h-3 w-3 text-sky-500" /> Emergency Contact
              </Label>
              <Input
                value={form.emergencyContact || ''}
                onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                placeholder="e.g. +1 234 567 8900"
                className="h-9 text-xs"
              />
            </div>

            {/* Height & Weight */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">Height (cm)</Label>
              <Input
                type="number"
                value={form.height || ''}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                placeholder="e.g. 175"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Weight (kg)</Label>
              <Input
                type="number"
                value={form.weight || ''}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="e.g. 70"
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Live BMI Indicator */}
          {computedBmi.bmi && (
            <div className="p-3 rounded-lg bg-muted/40 border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-500" />
                <span className="font-medium">Calculated Body Mass Index (BMI):</span>
                <span className="font-bold text-sm">{computedBmi.bmi}</span>
              </div>
              <Badge
                className={cn(
                  'text-[10px] font-semibold',
                  computedBmi.category === 'Normal'
                    ? 'bg-emerald-100 text-emerald-700'
                    : computedBmi.category === 'Underweight'
                    ? 'bg-blue-100 text-blue-700'
                    : computedBmi.category === 'Overweight'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                )}
                variant="secondary"
              >
                {computedBmi.category}
              </Badge>
            </div>
          )}

          {/* Pre-existing conditions & Allergies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium flex items-center gap-1">
                <Shield className="h-3 w-3 text-amber-500" /> Pre-existing Conditions
              </Label>
              <Input
                value={form.conditions || ''}
                onChange={(e) => setForm({ ...form, conditions: e.target.value })}
                placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-red-500" /> Known Allergies
              </Label>
              <Input
                value={form.allergies || ''}
                onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                placeholder="e.g. Penicillin, Peanuts, Pollen"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-medium shadow-sm py-2.5">
            <Save className="h-4 w-4" /> Save Patient Profile & Update Reports
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
