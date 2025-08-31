import { useCallback, useEffect, useState } from "react";
import { useLearningPreferences } from "./useLearningPreferences";
import { Lesson } from "@/types/Lesson";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

export const useLessons = () => {
  const { preferences } = useLearningPreferences();
  const { level, topic } = preferences;
  const [lesson, setLesson] = useState<Lesson>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuthStore();

  const getLessonIA = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/lessons", {
        method: "POST",
        body: JSON.stringify({
          level,
          topic,
        }),
      });
      const data = await res.json();
      setLesson(data);
    } catch (error) {
      console.error('Error al generar lección:', error);
    } finally {
      setIsLoading(false);
    }
  }, [level, topic]);

  const saveLessonDB = useCallback(async () => {
    if (!lesson || !user || !level || !topic) {
      console.error('No hay lección, usuario, level o topic para guardar');
      return null;
    }

    setIsSaving(true);
    
    try {
      // Usar directamente los IDs de level y topic de las preferencias
      // ya que level y topic son los IDs almacenados en las preferencias
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .insert({
          user_id: user.id,
          level_id: level, // level ya es el ID
          topic_id: topic, // topic ya es el ID
          title: lesson.title,
          description: lesson.description,
          content: lesson, // Guardar toda la lección como JSON en la columna content
          status: 'ready',
          difficulty: 3, // Valor por defecto
          estimated_duration: 30 // Valor por defecto en minutos
        })
        .select()
        .single();

      if (lessonError) {
        console.error('Error al guardar lección:', lessonError);
        throw lessonError;
      }

      console.log('Lección guardada exitosamente:', lessonData);
      return lessonData;
    } catch (error) {
      console.error('Error al guardar lección en DB:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [lesson, user, level, topic]);
  
  // Removed automatic lesson generation - lessons are now generated manually

  return {
    lesson,
    isLoading,
    isSaving,
    getLessonIA,
    saveLessonDB
  }
}