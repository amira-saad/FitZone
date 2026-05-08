import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  where,
  query,
} from "firebase/firestore";
import { db } from "../firebase";



export async function getSingleWorkout(workoutId: string): Promise<WorkoutTemplate | null> {
  try {
    const docRef = doc(db, "workoutTemplates", workoutId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as WorkoutTemplate;
    }
    return null;
  } catch (error) {
    console.error("Error fetching single workout:", error);
    return null;
  }
}
export type Exercise = {
  name: string;
  sets: number;
  reps: number;
};
export type WorkoutTemplate = {
  id: string;
  title: string;
  level: string;
  duration: string;
  calories: number;
 exercises?: { name: string; sets: number; reps: number }[];
};

const defaultTemplates: WorkoutTemplate[] = [
  { id: "1", title: "Full Body Strength", level: "Intermediate", duration: "45 min", calories: 200 },
  { id: "2", title: "HIIT Fat Burn", level: "Advanced", duration: "30 min", calories: 200 },
  { id: "3", title: "Beginner Cardio", level: "Beginner", duration: "20 min", calories: 200 },
];

 const templatesCollection = collection(db, "workoutTemplates");

// export async function readUserRole(userId: string): Promise<"admin" | "user"> {
//   if (!userId) return "user";
//   try {
//     const snapshot = await getDoc(doc(db, "users", userId, "app", "main"));
//     const role = snapshot.data()?.role;
//     return role === "admin" ? "admin" : "user";
//   } catch {
//     return "user";
//   }
// }
export async function readUserRole(userId: string): Promise<"admin" | "user"> {
  if (!userId) return "user";
  try {
    const docRef = doc(db, "users", userId, "app", "main")
    console.log('=== readUserRole ===')
    console.log('Reading path: users/', userId, '/app/main')
    
    const snapshot = await getDoc(docRef)
    console.log('Document exists:', snapshot.exists())
    console.log('Document data:', snapshot.data())
    console.log('role field:', snapshot.data()?.role)
    
    const role = snapshot.data()?.role;
    return role === "admin" ? "admin" : "user";
  } catch (err) {
    console.error('readUserRole error:', err)
    return "user";
  }
}
export async function getWorkoutTemplates(): Promise<WorkoutTemplate[]> {
  try {
    const snapshot = await getDocs(templatesCollection);
    if (snapshot.empty) return defaultTemplates;
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: String(data.id || d.id),
        title: String(data.title || "Workout"),
        level: String(data.level || "Beginner"),
        duration: String(data.duration || "30 min"),
        calories: Number(data.calories || 200),
      };
    });
  } catch {
    return defaultTemplates;
  }
}

export async function createWorkoutTemplate(template: Omit<WorkoutTemplate, "id">) {
  await addDoc(templatesCollection, template);
}

export async function assignWorkoutToUser(userId: string, templateId: string) {
  if (!userId || !templateId) return;
  const assignmentRef = doc(db, "users", userId, "assignedWorkouts", templateId);
  await setDoc(assignmentRef, { templateId, assignedAt: new Date().toISOString() }, { merge: true });
}

export async function getAssignedWorkoutIds(userId: string): Promise<string[]> {
  if (!userId) return [];
  try {
    const snapshot = await getDocs(collection(db, "users", userId, "assignedWorkouts"));
    return snapshot.docs.map((d) => String(d.data().templateId || d.id));
  } catch {
    return [];
  }
}

export async function getUserWorkouts(userId: string): Promise<WorkoutTemplate[]> {
  const templates = await getWorkoutTemplates()
  
  // not logged in → show all
  if (!userId) return templates

  const assignedIds = await getAssignedWorkoutIds(userId)
  
  // no assignments → show ALL (Option A)
  // no assignments → show NOTHING (Option B) → return []
  if (assignedIds.length === 0) return []

  const assignedSet = new Set(assignedIds)
  const assigned = templates.filter((t) => assignedSet.has(String(t.id)))
  return assigned.length > 0 ? assigned : templates
}
export async function getUserIdByEmail(email: string): Promise<string | null> {
  try {
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("email", "==", email.trim().toLowerCase()))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return null
    return snapshot.docs[0].id
  } catch {
    return null
  }
}