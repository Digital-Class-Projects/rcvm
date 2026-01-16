'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User } from 'lucide-react';

type BasicInfoStepProps = {
  onContinue: () => void;
};

export function BasicInfoStep({ onContinue }: BasicInfoStepProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" className="mr-4 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
          <User className="w-8 h-8 text-purple-600" />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="firstName" className="text-gray-500 text-sm">First name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="lastName" className="text-gray-500 text-sm">Last name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-gray-500 text-sm">Date of birth</Label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <div>
                <Label htmlFor="dob-day" className="text-gray-400 text-xs">Day</Label>
                <Input id="dob-day" placeholder="DD" value={day} onChange={(e) => setDay(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="dob-month" className="text-gray-400 text-xs">Month</Label>
                <Input id="dob-month" placeholder="MM" value={month} onChange={(e) => setMonth(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="dob-year" className="text-gray-400 text-xs">Year</Label>
                <Input id="dob-year" placeholder="YYYY" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={onContinue}
        size="lg"
        className="w-full bg-primary hover:bg-accent text-primary-foreground rounded-full mt-8"
      >
        Continue
      </Button>
    </div>
  );
}
