"use client";
import { Header } from "@/components";
import { ProtectedRoute } from "@/components/auth";
import { Card } from "@/components/common/Card";
import { useAuth } from "@/hooks/useAuth";
import { useLearningPreferences } from "@/hooks/useLearningPreferences";
import { useLevels } from "@/hooks/useLevels";
import { useTopics } from "@/hooks/useTopics";
import type { Level } from "@/types/level";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const navigate = useRouter();
  const { user } = useAuth();
  const { levels } = useLevels();
  const { topics } = useTopics();
  const { preferences, setLevel, setTopic } = useLearningPreferences();

  const handleLevelClick = (id: string) => {
    console.log(`Navigating to level ${id}`);
    setLevel(id);
  };

  const handleTopicClick = (id: string) => {
    console.log(`Navigating to topic ${id}`);
    setTopic(id);
  };

  useEffect(() => {
    if (preferences.level && preferences.topic) {
      navigate.push(`/lessons`);
    }
  }, [preferences.level, preferences.topic, navigate]);

  return (
    <ProtectedRoute>
      <Header />
      <div className="min-h-screen w-full bg-[#0f172a] relative">
        <div
          className=" inset-0 z-0"
          style={{
            backgroundImage: `radial-gradient(circle 600px at 50% 50%, rgba(59,130,246,0.3), transparent)`,
          }}
        >
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
