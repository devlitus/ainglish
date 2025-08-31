"use client";
import { ProtectedRoute } from "@/components/auth";
import { Card } from "@/components/common/Card";
import { useLearningPreferences } from "@/hooks/useLearningPreferences";
import { useLessons } from "@/hooks/useLessons";
import { useLevels } from "@/hooks/useLevels";
import { useTopics } from "@/hooks/useTopics";
import type { Level } from "@/types/level";
import { Topic } from "@/types/topics";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const navigate = useRouter();
  const { levels = [] } = useLevels();
  const { topics = [] } = useTopics();
  const { preferences, setLevel, setTopic } = useLearningPreferences();

  const handleLevelClick = (id: string) => {
    console.log(`Navigating to level ${id}`);
    setLevel(id);
  };

  const handleTopicClick = (id: string) => {
    console.log(`Navigating to topic ${id}`);
    setTopic(id);
  };
  const handleNavegationLesson = () => {
    navigate.push("/lessons");
  };

  return (
    <ProtectedRoute>
      {/* Content */}
      <section className="max-w-[1280px] mx-auto relative z-10 text-white pt-10">
          <h2 className="text-2xl font-bold mb-4">Your Levels</h2>
          {levels.length > 0 ? (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levels.map(
                  ({ id, title, description, difficult, feature }: Level) => (
                    <Card
                      key={id}
                      item={title}
                      message={description}
                      difficult={difficult}
                      feature={feature}
                      isSelected={preferences.level === id ? true : false}
                      color="blue"
                      size="md"
                      onClick={() => handleLevelClick(id)}
                    />
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">No Levels Found</h2>
              <p>You have not created any levels yet.</p>
            </div>
          )}
        </section>
        <section className="max-w-[1280px] mx-auto relative z-10 text-white py-10">
          <h2 className="text-2xl font-bold mb-4">Your Topics</h2>
          {topics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map(({ id, title, description, icon }: Topic) => (
                <Card
                  key={id}
                  item={title}
                  message={description}
                  icon={icon}
                  size="md"
                  isSelected={preferences.topic === id ? true : false}
                  onClick={() => handleTopicClick(id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">No Topics Found</h2>
              <p>You have not created any topics yet.</p>
            </div>
          )}
        </section>

        {/* Botón para ir a lecciones cuando se tienen preferencias seleccionadas */}
        {preferences.level && preferences.topic && (
          <section className="max-w-[1280px] mx-auto relative z-10 text-white py-10">
            <div className="text-center">
              <button
                onClick={handleNavegationLesson}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
              >
                Ir a Lecciones
              </button>
              <p className="text-gray-300 mt-2">
                Tienes nivel y tópico seleccionados. ¡Comienza a aprender!
              </p>
            </div>
          </section>
        )}
    </ProtectedRoute>
  );
}
