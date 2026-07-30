'use client'

import * as React from 'react'
import { User, Save } from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { toast } from 'sonner'

export function UserProfileCard() {
  const { userProfile, setUserProfile } = useDiagnosisStore()
  const [form, setForm] = React.useState(userProfile)

  React.useEffect(() => {
    setForm(userProfile)
  }, [userProfile])

  const save = () => {
    setUserProfile(form)
    toast.success('Profile saved')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
          <User className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-medium">Personal Information</p>
          <p className="text-xs text-muted-foreground">
            Used to contextualize your AI diagnoses
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="e.g. 32"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Gender</Label>
            <RadioGroup
              value={form.gender}
              onValueChange={(v) =>
                setForm({ ...form, gender: v as typeof form.gender })
              }
              className="flex gap-3 pt-2"
            >
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="male" id="g-m" />
                <Label htmlFor="g-m" className="text-xs cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="female" id="g-f" />
                <Label htmlFor="g-f" className="text-xs cursor-pointer">Female</Label>
              </div>
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="other" id="g-o" />
                <Label htmlFor="g-o" className="text-xs cursor-pointer">Other</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              value={form.height || ''}
              onChange={(e) => setForm({ ...form, height: e.target.value })}
              placeholder="optional"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              value={form.weight || ''}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              placeholder="optional"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="conditions">Pre-existing conditions</Label>
          <Textarea
            id="conditions"
            value={form.conditions || ''}
            onChange={(e) => setForm({ ...form, conditions: e.target.value })}
            placeholder="e.g. diabetes, hypertension, asthma (optional)"
            className="min-h-[70px]"
          />
        </div>

        <Button onClick={save} className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Save className="h-4 w-4" /> Save Profile
        </Button>
      </div>
    </div>
  )
}
