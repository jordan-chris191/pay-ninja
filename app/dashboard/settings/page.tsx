"use client";

import { SettingsView } from "@/components/dashboard/settings-view";
import { useDashboardData } from "@/components/dashboard/dashboard-context";

export default function SettingsPage() {
  const { profile, onSaveProfile } = useDashboardData();

  return <SettingsView profile={profile} onSave={onSaveProfile} />;
}