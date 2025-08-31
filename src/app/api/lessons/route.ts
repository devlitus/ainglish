import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { ApiError } from "@/types/ApiError";
import { GenerateLessonRequest } from "@/types/GenerateLessonRequest";
import { GenerateLessonResponse } from "@/types/GenerateLessonResponse";
import { Lesson } from "@/types/Lesson";
import { GeminiResponse } from "@/types/GeminiResponse";

// Inicializar Gemini AI según las mejores prácticas de @google/genai
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { level, topic }: GenerateLessonRequest = await request.json();

    if (!level || !topic) {
      return NextResponse.json(
        { success: false, error: "Level and topic are required" },
        { status: 400 }
      );
    }

    // Verificar que la API key de Gemini esté configurada
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Crear el prompt para Gemini
    const prompt = `
Generate a comprehensive English lesson for learning English as a second language.

Level: ${level}
Topic: ${topic}

Please generate a lesson that includes:
1. Grammar rules with explanations and examples
2. Spelling/vocabulary words with pronunciation and definitions
3. Interactive exercises (multiple choice, fill in the blanks, translation, pronunciation)

IMPORTANT: Your response MUST be a valid JSON object with this exact structure (no markdown, no code blocks, just pure JSON):

{
  "title": "Lesson title",
  "description": "Brief lesson description",
  "level": "${level}",
  "topic": "${topic}",
  "grammar": {
    "rules": [
      {
        "rule": "Grammar rule name",
        "explanation": "Detailed explanation",
        "examples": ["Example 1", "Example 2", "Example 3"]
      }
    ]
  },
  "spelling": {
    "words": [
      {
        "word": "vocabulary word",
        "pronunciation": "/pronunciation/",
        "definition": "Word definition",
        "examples": ["Example sentence 1", "Example sentence 2"]
      }
    ]
  },
  "exercises": [
    {
      "type": "multiple-choice",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why this is correct"
    },
    {
      "type": "fill-blank",
      "question": "Complete the sentence: I ___ to school every day.",
      "correctAnswer": "go",
      "explanation": "Present simple tense for daily routines"
    }
  ],
  "estimatedDuration": 30
}

Generate at least 3 grammar rules, 8 vocabulary words, and 6 exercises of different types. Make sure the content is appropriate for the ${level} level and focuses on ${topic}.
`;

    // Generar contenido con Gemini usando las mejores prácticas
    try {
      const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash", // Usar modelo más eficiente
        contents: prompt,
      });
      const text = result.text;

      if (!text) {
        throw new Error("No content generated from Gemini API");
      }

      // Intentar parsear la respuesta como JSON
      let lessonContent: GeminiResponse;
      try {
        // Limpiar la respuesta de posibles caracteres de markdown
        const cleanedText = text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        console.log("Cleaned Gemini response:", cleanedText);
        lessonContent = JSON.parse(cleanedText);
        console.log(
          "Parsed lesson content:",
          JSON.stringify(lessonContent, null, 2)
        );
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError);
        console.error("Raw response:", text);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to parse AI response. Please try again.",
          },
          { status: 500 }
        );
      }

      // Si llegamos aquí, lessonContent es válido
      return NextResponse.json({
        success: true,
        lesson: lessonContent,
      });
    } catch (apiError: unknown) {
      console.error("Gemini API Error:", apiError);

      // Manejar errores específicos de la API
      if ((apiError as ApiError)?.status === 429) {
        // Fallback: generar una lección de ejemplo cuando se excede la cuota
        const fallbackLesson: Lesson = {
          title: `${level} English Lesson: ${topic}`,
          description: `A comprehensive ${level.toLowerCase()} level lesson focusing on ${topic.toLowerCase()}.`,
          level,
          topic,
          grammar: {
            rules: [
              {
                rule: "Present Simple Tense",
                explanation: "Used for habits, facts, and general truths.",
                examples: [
                  "I speak English.",
                  "She works every day.",
                  "The sun rises in the east.",
                ],
              },
              {
                rule: "Articles (a, an, the)",
                explanation:
                  "Use 'a' before consonant sounds, 'an' before vowel sounds, 'the' for specific items.",
                examples: ["A book", "An apple", "The teacher"],
              },
            ],
          },
          spelling: {
            words: [
              {
                word: "hello",
                pronunciation: "/həˈloʊ/",
                definition: "A greeting used when meeting someone",
                examples: [
                  "Hello, how are you?",
                  "She said hello to everyone.",
                ],
              },
              {
                word: "goodbye",
                pronunciation: "/ɡʊdˈbaɪ/",
                definition: "A farewell expression",
                examples: ["Goodbye, see you tomorrow!", "He waved goodbye."],
              },
            ],
          },
          exercises: [
            {
              type: "multiple-choice",
              question: "Which greeting is most formal?",
              options: ["Hi", "Hello", "Hey", "What's up"],
              correctAnswer: "Hello",
              explanation:
                "Hello is the most universally appropriate greeting.",
            },
            {
              type: "fill-blank",
              question: "Complete: Good _____, how are you?",
              correctAnswer: "morning",
              explanation:
                "Common greetings include 'Good morning', 'Good afternoon', and 'Good evening'.",
            },
            {
              type: "translation",
              question: "Translate to English: Hola",
              correctAnswer: "Hello",
              explanation:
                "'Hola' in Spanish translates to 'Hello' in English.",
            },
          ],
        };

        return NextResponse.json({
          success: true,
          lesson: fallbackLesson,
          note: "Demo lesson provided due to API quota limits. Please try again later for AI-generated content.",
        } as GenerateLessonResponse);
      }

      if ((apiError as ApiError).status === 401) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid API key configuration.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate lesson content. Please try again.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating lesson:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate lesson. Please try again.",
      },
      { status: 500 }
    );
  }
}
