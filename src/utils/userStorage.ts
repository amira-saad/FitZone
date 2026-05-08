import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export type HistoryItem = {
  workoutId: string;
  calories: number;
  userId: string;
  date: string;
};

export type UserProgress = {
  workoutsCompleted: number;
  caloriesBurned: number;
  history: HistoryItem[];
};

export const emptyUserProgress = (): UserProgress => ({
  workoutsCompleted: 0,
  caloriesBurned: 0,
  history: [],
});

type UserData = {
  plan: string;
  progress: UserProgress;
};

const userDocRef = (userId: string) => doc(db, "users", userId, "app", "main");
const localUserKey = (userId: string) => `fitzone_user_${userId}`;
const legacyProgressKey = (userId: string) => `fitzone_progress_${userId}`;
const legacyPlanKey = (userId: string) => `fitzone_plan_${userId}`;

const emptyUserData = (): UserData => ({
  plan: "free",
  progress: emptyUserProgress(),
});

const normalizeProgress = (value?: Partial<UserProgress>): UserProgress => ({
  workoutsCompleted: value?.workoutsCompleted || 0,
  caloriesBurned: value?.caloriesBurned || 0,
  history: Array.isArray(value?.history) ? value!.history : [],
});

function readLocalUserData(userId: string): UserData {
  const directRaw = localStorage.getItem(localUserKey(userId));
  if (directRaw) {
    try {
      const parsed = JSON.parse(directRaw) as Partial<UserData>;
      return {
        plan: parsed.plan || "free",
        progress: normalizeProgress(parsed.progress),
      };
    } catch {
      return emptyUserData();
    }
  }

  // Legacy migration path: old separate keys -> new single object key.
  const legacyProgressRaw = localStorage.getItem(legacyProgressKey(userId));
  const legacyPlan = localStorage.getItem(legacyPlanKey(userId)) || "free";
  let legacyProgress = emptyUserProgress();
  if (legacyProgressRaw) {
    try {
      legacyProgress = normalizeProgress(JSON.parse(legacyProgressRaw) as UserProgress);
    } catch {
      legacyProgress = emptyUserProgress();
    }
  }

  const migrated: UserData = { plan: legacyPlan, progress: legacyProgress };
  localStorage.setItem(localUserKey(userId), JSON.stringify(migrated));
  return migrated;
}

function hasLocalUserData(userId: string): boolean {
  return !!localStorage.getItem(localUserKey(userId));
}

function saveLocalUserData(userId: string, data: UserData) {
  localStorage.setItem(localUserKey(userId), JSON.stringify(data));
}

export async function readUserProgress(userId: string): Promise<UserProgress> {
  if (!userId) return emptyUserProgress();
  if (hasLocalUserData(userId)) {
    return readLocalUserData(userId).progress;
  }

  try {
    const snapshot = await getDoc(userDocRef(userId));
    if (!snapshot.exists()) return readLocalUserData(userId).progress;
    const parsed = snapshot.data() as Partial<UserData>;
    const fromCloud: UserData = {
      plan: parsed.plan || "free",
      progress: normalizeProgress(parsed.progress),
    };
    saveLocalUserData(userId, fromCloud);
    return fromCloud.progress;
  } catch {
    return readLocalUserData(userId).progress;
  }
}

export async function saveUserProgress(userId: string, progress: UserProgress): Promise<void> {
  if (!userId) return;

  const nextData: UserData = {
    ...readLocalUserData(userId),
    progress: normalizeProgress(progress),
  };
  saveLocalUserData(userId, nextData);

  try {
    await setDoc(userDocRef(userId), nextData, { merge: true });
  } catch {
    // keep local fallback
  }
}
export async function saveUserEmail(userId: string, email: string): Promise<void> {
  if (!userId || !email) return
  try {
    await setDoc(
      doc(db, "users", userId),
      { email: email.trim().toLowerCase() },
      { merge: true }
    )
  } catch {
    // silent fail
  }
}
export async function readUserPlan(userId: string): Promise<string> {
  if (!userId) return "free";
  if (hasLocalUserData(userId)) {
    return readLocalUserData(userId).plan;
  }

  try {
    const snapshot = await getDoc(userDocRef(userId));
    if (!snapshot.exists()) return readLocalUserData(userId).plan;
    const parsed = snapshot.data() as Partial<UserData>;
    const fromCloud: UserData = {
      plan: parsed.plan || "free",
      progress: normalizeProgress(parsed.progress),
    };
    saveLocalUserData(userId, fromCloud);
    return fromCloud.plan;
  } catch {
    return readLocalUserData(userId).plan;
  }
}

export async function saveUserPlan(userId: string, plan: string): Promise<void> {
  if (!userId) return;

  const nextData: UserData = {
    ...readLocalUserData(userId),
    plan: plan || "free",
  };
  saveLocalUserData(userId, nextData);

  try {
    await setDoc(userDocRef(userId), nextData, { merge: true });
  } catch {
    // keep local fallback
  }
}
