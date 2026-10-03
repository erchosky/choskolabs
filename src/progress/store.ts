"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  LocalProgressRepository,
  MemoryProgressRepository,
  PROGRESS_STORAGE_KEY,
  type ProgressRepository,
} from "./repository";
import { EMPTY_PROGRESS, type ProgressState } from "./types";

/**
 * Único punto del cliente que toca el repositorio de progreso.
 * Los componentes usan `useProgress()`; nunca acceden a localStorage directamente.
 */

let repository: ProgressRepository | null = null;
let snapshot: ProgressState | null = null;
const listeners = new Set<() => void>();

function getRepository(): ProgressRepository {
  if (!repository) {
    repository =
      typeof window !== "undefined" && typeof window.localStorage !== "undefined"
        ? new LocalProgressRepository(window.localStorage)
        : new MemoryProgressRepository();
  }
  return repository;
}

function emit() {
  for (const listener of listeners) listener();
}

function getSnapshot(): ProgressState {
  if (!snapshot) snapshot = getRepository().load();
  return snapshot;
}

function getServerSnapshot(): ProgressState {
  return EMPTY_PROGRESS;
}

function onStorage(event: StorageEvent) {
  // Otra pestaña (p. ej. la del laboratorio) cambió el progreso.
  if (event.key === PROGRESS_STORAGE_KEY || event.key === null) {
    snapshot = getRepository().load();
    emit();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function updateProgress(transition: (state: ProgressState) => ProgressState) {
  const current = getSnapshot();
  const next = transition(current);
  if (next === current) return;
  snapshot = next;
  getRepository().save(next);
  emit();
}

export function resetProgress() {
  getRepository().reset();
  snapshot = EMPTY_PROGRESS;
  emit();
}

/** Sobrescribe el progreso completo (herramientas de desarrollo). */
export function replaceProgress(state: ProgressState) {
  snapshot = state;
  getRepository().save(state);
  emit();
}

export interface UseProgress {
  progress: ProgressState;
  /** false durante el render de servidor y la hidratación: evita parpadeos de estado. */
  hydrated: boolean;
  update: (transition: (state: ProgressState) => ProgressState) => void;
}

const noopSubscribe = () => () => {};

export function useProgress(): UseProgress {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const update = useCallback((t: (s: ProgressState) => ProgressState) => updateProgress(t), []);
  return { progress, hydrated, update };
}
