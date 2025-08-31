"use client";
import { useLearningPreferences } from "@/hooks/useLearningPreferences";
import { useEffect, useState } from "react";

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const { preferences } = useLearningPreferences();
  console.log(preferences.level);
  console.log(preferences.topic);

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
