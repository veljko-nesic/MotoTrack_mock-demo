"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { mergeState, seed } from "@/lib/data";

const STORAGE_KEY = "auto-ranc-v2";
const AppContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "reset":
      return {
        ...structuredClone(seed),
        sessionUserId: action.keepSession ? "user-milos" : null,
        view: "dashboard",
      };
    case "session":
      return { ...state, sessionUserId: action.userId, view: "dashboard" };
    case "logout":
      return { ...state, sessionUserId: null };
    case "register":
      return {
        ...state,
        users: [...state.users, action.user],
        sessionUserId: action.user.id,
        view: "dashboard",
      };
    case "update-profile":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.userId ? { ...user, ...action.patch } : user,
        ),
      };
    case "view":
      return { ...state, view: action.view };
    case "select-car":
      return { ...state, activeCarId: action.carId };
    case "set-mileage":
      return {
        ...state,
        cars: state.cars.map((car) =>
          car.id === action.carId ? { ...car, mileage: action.mileage } : car,
        ),
      };
    case "save-repair": {
      const exists = state.repairs.some((item) => item.id === action.repair.id);
      return {
        ...state,
        repairs: exists
          ? state.repairs.map((item) => (item.id === action.repair.id ? action.repair : item))
          : [action.repair, ...state.repairs],
      };
    }
    case "delete-repair":
      return { ...state, repairs: state.repairs.filter((item) => item.id !== action.id) };
    case "save-plan": {
      const exists = state.plans.some((item) => item.id === action.plan.id);
      return {
        ...state,
        plans: exists
          ? state.plans.map((item) => (item.id === action.plan.id ? action.plan : item))
          : [action.plan, ...state.plans],
      };
    }
    case "delete-plan":
      return { ...state, plans: state.plans.filter((item) => item.id !== action.id) };
    case "save-photo": {
      const exists = state.photos.some((item) => item.id === action.photo.id);
      return {
        ...state,
        photos: exists
          ? state.photos.map((item) => (item.id === action.photo.id ? action.photo : item))
          : [action.photo, ...state.photos],
      };
    }
    case "delete-photo":
      return { ...state, photos: state.photos.filter((item) => item.id !== action.id) };
    case "log-maintenance": {
      const cars = state.cars.map((car) =>
        car.id === action.entry.carId && action.entry.mileage > car.mileage
          ? { ...car, mileage: action.entry.mileage }
          : car,
      );
      return { ...state, cars, logs: [action.entry, ...state.logs] };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, seed, structuredClone);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.version === 1 && parsed.state) {
          dispatch({ type: "hydrate", state: mergeState(parsed.state) });
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, state }));
    } catch {
      /* Demo state stays in memory when storage is blocked. */
    }
  }, [state, ready]);

  const api = useMemo(() => {
    const user = state.users.find((item) => item.id === state.sessionUserId) ?? null;
    const activeCar = state.cars.find((car) => car.id === state.activeCarId) ?? state.cars[0];

    return {
      ready,
      user,
      cars: state.cars,
      activeCar,
      view: state.view,
      repairs: state.repairs
        .filter((item) => item.carId === activeCar?.id)
        .sort((a, b) => b.date.localeCompare(a.date)),
      plans: state.plans.filter((item) => item.carId === activeCar?.id),
      photos: state.photos
        .filter((item) => item.carId === activeCar?.id)
        .sort((a, b) => b.date.localeCompare(a.date)),
      logs: state.logs,
      setView: (view) => dispatch({ type: "view", view }),
      selectCar: (carId) => dispatch({ type: "select-car", carId }),
      login: (email, password) => {
        const match = state.users.find(
          (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
        );
        if (!match) return "Email ili lozinka se ne poklapaju.";
        dispatch({ type: "session", userId: match.id });
        return null;
      },
      register: (draft) => {
        const email = draft.email.trim().toLowerCase();
        if (state.users.some((item) => item.email.toLowerCase() === email)) {
          return "Nalog sa ovom adresom već postoji.";
        }
        dispatch({
          type: "register",
          user: {
            id: crypto.randomUUID(),
            name: draft.name.trim(),
            username: draft.username.trim(),
            email,
            password: draft.password,
            role: "OWNER",
          },
        });
        return null;
      },
      logout: () => dispatch({ type: "logout" }),
      updateProfile: (patch) => {
        const email = patch.email.trim().toLowerCase();
        const taken = state.users.some(
          (item) => item.id !== user.id && item.email.toLowerCase() === email,
        );
        if (taken) return "Email je zauzet.";
        dispatch({
          type: "update-profile",
          userId: user.id,
          patch: { ...patch, email },
        });
        return null;
      },
      setMileage: (carId, mileage) => dispatch({ type: "set-mileage", carId, mileage }),
      saveRepair: (repair) => dispatch({ type: "save-repair", repair }),
      deleteRepair: (id) => dispatch({ type: "delete-repair", id }),
      savePlan: (plan) => dispatch({ type: "save-plan", plan }),
      deletePlan: (id) => dispatch({ type: "delete-plan", id }),
      savePhoto: (photo) => dispatch({ type: "save-photo", photo }),
      deletePhoto: (id) => dispatch({ type: "delete-photo", id }),
      logMaintenance: (entry) => dispatch({ type: "log-maintenance", entry }),
      reset: (keepSession) => dispatch({ type: "reset", keepSession }),
    };
  }, [ready, state]);

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp mora da stoji unutar AppProvider.");
  return value;
}
