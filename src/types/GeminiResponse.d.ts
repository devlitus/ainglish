export interface GeminiResponse {
  text: string;
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}