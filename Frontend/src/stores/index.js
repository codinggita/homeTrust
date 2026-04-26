import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isLoggedIn: false,
  email: null,
  name: null,
  role: "buyer",
  login: (email, role = "buyer") =>
    set({
      isLoggedIn: true,
      email,
      name: email
        .split("@")[0]
        .replace(/[^a-z]/gi, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      role,
    }),
  logout: () =>
    set({ isLoggedIn: false, email: null, name: null, role: "buyer" }),
  setRole: (role) => set({ role }),
}));

export const useAuth = useAuthStore;

export const useReportStore = create((set, get) => ({
  savedIds: ["lincoln-park", "west-hollywood", "chelsea"],
  compare: ["lincoln-park", "lakeview"],
  toggleSaved: (id) =>
    set({
      savedIds: get().savedIds.includes(id)
        ? get().savedIds.filter((s) => s !== id)
        : [...get().savedIds, id],
    }),
  addCompare: (id) => {
    const cur = get().compare;
    if (cur.includes(id) || cur.length >= 3) return;
    set({ compare: [...cur, id] });
  },
  removeCompare: (id) =>
    set({ compare: get().compare.filter((c) => c !== id) }),
  clearCompare: () => set({ compare: [] }),
}));

const defaultFilters = {
  query: "",
  trustedOnly: true,
  priceMin: 500,
  priceMax: 10000,
  bhk: [],
  verification: ["Platinum", "Gold", "Silver"],
  minTrust: 60,
  sort: "trust",
  viewMode: "grid",
};

export const useListingStore = create((set) => ({
  ...defaultFilters,
  setFilter: (key, value) => set({ [key]: value }),
  reset: () => set(defaultFilters),
}));

export const useNotificationStore = create((set, get) => ({
  notifications: [
    {
      id: "n1",
      title: "Scam alert",
      message: "A listing near your saved area was flagged as duplicate.",
      time: "10m ago",
      read: false,
      type: "alert",
    },
    {
      id: "n2",
      title: "Market shift",
      message: "Chelsea rent index up 3.2% this week.",
      time: "1h ago",
      read: false,
      type: "info",
    },
    {
      id: "n3",
      title: "Report ready",
      message: "Your Palo Alto neighborhood report is available.",
      time: "3h ago",
      read: true,
      type: "success",
    },
  ],
  unreadCount: 2,
  addNotification: (n) => {
    const newNotif = {
      id: `n${Date.now()}`,
      title: n.title,
      message: n.message,
      type: n.type,
      time: "just now",
      read: false,
    };
    set({
      notifications: [newNotif, ...get().notifications],
      unreadCount: get().unreadCount + 1,
    });
  },
  markAllRead: () =>
    set({
      notifications: get().notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }),
  remove: (id) =>
    set({ notifications: get().notifications.filter((n) => n.id !== id) }),
}));

// re-export type
