import { create } from 'zustand';

interface WorkspaceState {
  activeOrgId: string | null;
  activeWorkspaceId: string | null;
  setActiveOrg: (orgId: string) => void;
  setActiveWorkspace: (workspaceId: string | null) => void;
  clear: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeOrgId: null,
  activeWorkspaceId: null,

  setActiveOrg: (orgId: string) =>
    set({ activeOrgId: orgId, activeWorkspaceId: null }),

  setActiveWorkspace: (workspaceId: string | null) =>
    set({ activeWorkspaceId: workspaceId }),

  clear: () => set({ activeOrgId: null, activeWorkspaceId: null }),
}));
