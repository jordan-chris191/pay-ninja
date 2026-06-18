"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Profile } from "./types";

interface SettingsViewProps {
  profile: Profile;
  onSave: (updates: Omit<Profile, "id">) => void;
}

export function SettingsView({ profile, onSave }: SettingsViewProps) {
  const [name, setName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [biz, setBiz] = useState(profile.businessName);
  const [prefix, setPrefix] = useState(profile.invoicePrefix);
  const [terms, setTerms] = useState(String(profile.paymentTerms));

  const handleSave = () => {
    onSave({
      fullName: name,
      email,
      businessName: biz,
      invoicePrefix: prefix,
      paymentTerms: Number(terms) || 0,
    });
  };

  return (
    <div className="max-w-lg space-y-5">
      <Card className="border shadow-none">
        <CardHeader className="px-5 pt-4 pb-3 border-b">
          <CardTitle className="text-sm font-semibold">Profile</CardTitle>
        </CardHeader>
        <CardContent className="px-5 py-4 space-y-4">
          {[
            { label: "Full Name", value: name, setter: setName, placeholder: "Your name" },
            { label: "Email", value: email, setter: setEmail, placeholder: "you@example.com" },
          ].map(f => (
            <div key={f.label} className="space-y-1.5">
              <Label className="text-xs">{f.label}</Label>
              <Input className="h-8 text-sm" value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border shadow-none">
        <CardHeader className="px-5 pt-4 pb-3 border-b">
          <CardTitle className="text-sm font-semibold">Business</CardTitle>
        </CardHeader>
        <CardContent className="px-5 py-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Business Name</Label>
            <Input className="h-8 text-sm" value={biz} onChange={e => setBiz(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Invoice Prefix</Label>
              <Input className="h-8 text-sm font-mono" value={prefix} onChange={e => setPrefix(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Payment Terms (days)</Label>
              <Input className="h-8 text-sm" type="number" value={terms} onChange={e => setTerms(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button className="h-8 text-sm" onClick={handleSave}>Save Changes</Button>
    </div>
  );
}