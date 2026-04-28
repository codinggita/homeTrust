/**
 * src/stores/index.js
 * Zustand state management — all stores with real backend integration.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Auth Store (persisted to localStorage) ───────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn : false,
      token      : null,
      user       : null, // { id, email, role, profile }
      role       : "buyer",

      login: (token, user) => {
        localStorage.setItem("ht_token", token);
        set({ isLoggedIn: true, token, user, role: user.role });
      },

      logout: () => {
        localStorage.removeItem("ht_token");
        localStorage.removeItem("ht_user");
        set({ isLoggedIn: false, token: null, user: null, role: "buyer" });
      },

      // Update user profile after /me call
      setUser: (user) => set({ user, role: user.role }),

      // Convenience helpers
      get name() {
        const u = get().user;
        return u?.profile?.fullName || u?.email?.split("@")[0] || "User";
      },
    }),
    {
      name: "ht_auth",
      partialize: (s) => ({
        isLoggedIn: s.isLoggedIn,
        token: s.token,
        user: s.user,
        role: s.role,
      }),
    }
  )
);

// Alias for backwards compat
export const useAuth = useAuthStore;

// ─── Report Store ─────────────────────────────────────────────────
const defaultReportState = {
  savedIds : [],   // array of pincodes
  compare  : [],   // up to 3 pincodes
};

export const useReportStore = create((set, get) => ({
  ...defaultReportState,

  setSavedIds: (ids) => set({ savedIds: ids }),

  toggleSaved: (pincode) =>
    set({
      savedIds: get().savedIds.includes(pincode)
        ? get().savedIds.filter((s) => s !== pincode)
        : [...get().savedIds, pincode],
    }),

  addCompare: (pincode) => {
    const cur = get().compare;
    if (cur.includes(pincode) || cur.length >= 3) return;
    set({ compare: [...cur, pincode] });
  },

  removeCompare: (pincode) =>
    set({ compare: get().compare.filter((c) => c !== pincode) }),

  clearCompare: () => set({ compare: [] }),
}));

// ─── Listing Filter Store ─────────────────────────────────────────
const defaultFilters = {
  query        : "",
  trustedOnly  : false,
  priceMin     : 0,
  priceMax     : 200000,
  bhk          : [],
  verification : ["Platinum", "Gold", "Silver", "Bronze"],
  minTrust     : 0,
  sort         : "newest",
  viewMode     : "grid",
  page         : 1,
};

export const useListingStore = create((set) => ({
  ...defaultFilters,
  setFilter : (key, value) => set({ [key]: value, page: 1 }),
  setPage   : (page)       => set({ page }),
  reset     : ()           => set(defaultFilters),
}));

// ─── Notification Store ───────────────────────────────────────────
export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount  : 0,

  addNotification: (n) => {
    const newNotif = {
      id   : `n${Date.now()}`,
      title: n.title,
      message: n.message,
      type : n.type || "info",
      time : "just now",
      read : false,
    };
    set({
      notifications: [newNotif, ...get().notifications],
      unreadCount  : get().unreadCount + 1,
    });
  },

  markAllRead: () =>
    set({
      notifications: get().notifications.map((n) => ({ ...n, read: true })),
      unreadCount  : 0,
    }),

  remove: (id) =>
    set({ notifications: get().notifications.filter((n) => n.id !== id) }),
}));
