"use client";
import { useLearningPreferences } from "@/hooks/useLearningPreferences";

export default function LessonsPage() {
  const { preferences } = useLearningPreferences();
  return preferences.level && preferences.topic ? (
    <div>
      <h1>Lessons</h1>
    </div>
  ) : (
    <div>
      <h1>Please select a level and topic</h1>
    </div>
  );
}
