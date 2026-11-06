"use client";

import { useCallback, useEffect, useState } from "react";
import { schoolService } from "@/services";
import type {
  AcademicReport,
  Assignment,
  AttendanceRecord,
  Classroom,
  FeeRecord,
  PortalOverview,
  PortalRole,
  School,
  SchoolOverview,
  SchoolRole,
  SchoolSettingsData,
  StaffMember,
  Student,
  StudentInput,
} from "@/types/school";

type ResourceState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
};

function useRemoteResource<T>(
  load: (signal: AbortSignal) => Promise<T>,
): ResourceState<T> {
  const [resource, setResource] = useState<{
    data: T | null;
    error: string | null;
    isLoading: boolean;
    load: typeof load | null;
  }>({ data: null, error: null, isLoading: true, load: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve()
      .then(() => load(controller.signal))
      .then(
        (data) => {
          if (!controller.signal.aborted) {
            setResource({ data, error: null, isLoading: false, load });
          }
        },
        (reason: unknown) => {
          if (!controller.signal.aborted) {
            setResource({
              data: null,
              error: reason instanceof Error ? reason.message : "Unable to load this information.",
              isLoading: false,
              load,
            });
          }
        },
      );

    return () => controller.abort();
  }, [load, version]);

  const refresh = useCallback(() => {
    setResource((current) => ({ ...current, isLoading: true, error: null }));
    setVersion((current) => current + 1);
  }, []);
  const isCurrentLoad = resource.load === load;
  return {
    data: isCurrentLoad ? resource.data : null,
    isLoading: !isCurrentLoad || resource.isLoading,
    error: isCurrentLoad ? resource.error : null,
    refresh,
  };
}

export function useSchoolOverview(role: SchoolRole) {
  const load = useCallback(
    (signal: AbortSignal) => schoolService.getOverview(role, signal),
    [role],
  );
  return useRemoteResource<SchoolOverview>(load);
}

export function usePortalOverview(role: PortalRole) {
  const load = useCallback(
    (signal: AbortSignal) => schoolService.getPortalOverview(role, signal),
    [role],
  );
  return useRemoteResource<PortalOverview>(load);
}

export function useStudents() {
  const load = useCallback((signal: AbortSignal) => schoolService.getStudents(signal), []);
  return useRemoteResource<Student[]>(load);
}

export function useSaveStudent() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(async (id: string | null, input: StudentInput) => {
    setIsPending(true);
    setError(null);
    try {
      return id
        ? await schoolService.updateStudent(id, input)
        : await schoolService.createStudent(input);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save this student.");
      return null;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { save, isPending, error };
}

export function useStaff() {
  const load = useCallback((signal: AbortSignal) => schoolService.getStaff(signal), []);
  return useRemoteResource<StaffMember[]>(load);
}

export function useClassrooms() {
  const load = useCallback((signal: AbortSignal) => schoolService.getClassrooms(signal), []);
  return useRemoteResource<Classroom[]>(load);
}

export function useSchools() {
  const load = useCallback((signal: AbortSignal) => schoolService.getSchools(signal), []);
  return useRemoteResource<School[]>(load);
}

export function useAttendance() {
  const load = useCallback((signal: AbortSignal) => schoolService.getAttendance(signal), []);
  return useRemoteResource<AttendanceRecord[]>(load);
}

export function useAcademicReports() {
  const load = useCallback((signal: AbortSignal) => schoolService.getReports(signal), []);
  return useRemoteResource<AcademicReport[]>(load);
}

export function useFees() {
  const load = useCallback((signal: AbortSignal) => schoolService.getFees(signal), []);
  return useRemoteResource<FeeRecord[]>(load);
}

export function useAssignments() {
  const load = useCallback((signal: AbortSignal) => schoolService.getAssignments(signal), []);
  return useRemoteResource<Assignment[]>(load);
}

export function useSchoolSettings() {
  const load = useCallback((signal: AbortSignal) => schoolService.getSettings(signal), []);
  return useRemoteResource<SchoolSettingsData>(load);
}

export function useUpdateSchoolSettings() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (settings: SchoolSettingsData) => {
    setIsPending(true);
    setError(null);
    try {
      return await schoolService.updateSettings(settings);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save school settings.");
      return null;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { update, isPending, error };
}
