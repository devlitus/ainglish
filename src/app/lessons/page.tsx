"use client";
import { ProtectedRoute } from "@/components";
import { useLearningPreferences } from "@/hooks/useLearningPreferences";
import { useLessons } from "@/hooks/useLessons";
import { useState } from "react";

type SavedLesson = {
  id: string;
  title: string;
  description: string;
  user_id: string;
  level_id: string;
  topic_id: string;
  content: object;
  status: string;
  difficulty: number;
  estimated_duration: number;
  created_at: string;
  updated_at: string;
};

export default function LessonsPage() {
  const { preferences } = useLearningPreferences();
  const { lesson, isLoading, isSaving, getLessonIA, saveLessonDB } =
    useLessons();
  const [savedLessons, setSavedLessons] = useState<SavedLesson[]>([]);

  const handleGenerateLesson = async () => {
    if (preferences.level && preferences.topic) {
      await getLessonIA();
    } else {
      alert("Por favor selecciona un nivel y tema primero en el dashboard");
    }
  };

  const handleSaveLesson = async () => {
    if (lesson) {
      try {
        const savedLesson = await saveLessonDB();
        if (savedLesson) {
          setSavedLessons((prev) => [...prev, savedLesson]);
          alert("Lección guardada exitosamente en la base de datos!");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        alert("Error al guardar la lección: " + errorMessage);
      }
    }
  };
  console.log({ lesson });
  return (
    <ProtectedRoute>
      <div className="max-w-[1280px] mx-auto relative z-10 text-white pt-10">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Lecciones de Inglés
        </h1>
        {/* Aquí puedes agregar el contenido de las lecciones */}
      </div>
    </ProtectedRoute>
  );
}
