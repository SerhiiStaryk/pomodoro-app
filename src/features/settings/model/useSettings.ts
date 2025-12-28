import { useMemo, useState, useEffect } from 'react';
import type { TimerProfile, TimerSettings } from '../../../shared/types';
import {
  defaultSettings,
  loadProfiles,
  saveProfiles,
  loadActiveProfileId,
  saveActiveProfileId,
} from '../../../shared/lib/storage';

const createId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const useSettings = () => {
  const [profiles, setProfiles] = useState<TimerProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('');

  useEffect(() => {
    const loadedProfiles = loadProfiles();
    const storedActiveId = loadActiveProfileId();
    const fallbackId = loadedProfiles[0]?.id ?? '';

    const resolvedActiveId =
      storedActiveId && loadedProfiles.some((p) => p.id === storedActiveId)
        ? storedActiveId
        : fallbackId;

    setProfiles(loadedProfiles);
    setActiveProfileId(resolvedActiveId);
    if (resolvedActiveId) saveActiveProfileId(resolvedActiveId);
  }, []);

  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) ?? null;
  }, [profiles, activeProfileId]);

  const settings: TimerSettings = activeProfile?.settings ?? defaultSettings;

  const persistProfiles = (next: TimerProfile[]) => {
    setProfiles(next);
    saveProfiles(next);
  };

  const selectProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    saveActiveProfileId(profileId);
  };

  const createProfile = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    const now = Date.now();
    const profile: TimerProfile = {
      id: createId(),
      name: trimmed,
      settings: { ...defaultSettings },
      createdAt: now,
      updatedAt: now,
    };

    const next = [profile, ...profiles];
    persistProfiles(next);
    selectProfile(profile.id);
    return true;
  };

  const renameProfile = (profileId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    const next = profiles.map((p) =>
      p.id === profileId ? { ...p, name: trimmed, updatedAt: Date.now() } : p
    );
    persistProfiles(next);
    return true;
  };

  const deleteProfile = (profileId: string) => {
    if (profiles.length <= 1) return false;
    const next = profiles.filter((p) => p.id !== profileId);
    persistProfiles(next);

    if (activeProfileId === profileId) {
      const fallbackId = next[0]?.id;
      if (fallbackId) selectProfile(fallbackId);
    }
    return true;
  };

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    if (!activeProfile) return;
    const updatedSettings = { ...activeProfile.settings, ...newSettings };
    const next = profiles.map((p) =>
      p.id === activeProfile.id
        ? { ...p, settings: updatedSettings, updatedAt: Date.now() }
        : p
    );
    persistProfiles(next);
  };

  const resetSettings = () => {
    if (!activeProfile) return;
    const next = profiles.map((p) =>
      p.id === activeProfile.id
        ? { ...p, settings: { ...defaultSettings }, updatedAt: Date.now() }
        : p
    );
    persistProfiles(next);
  };

  return {
    profiles,
    activeProfileId,
    settings,
    selectProfile,
    createProfile,
    renameProfile,
    deleteProfile,
    updateSettings,
    resetSettings,
  };
};
