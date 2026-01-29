import { GoogleGenAI, Type } from "@google/genai";
import { Scheme } from "../types";

export const getGeminiResponse = async (prompt: string, context: any, audioData?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const contents: any[] = [];
  const parts: any[] = [];

  // Add audio part if provided
  if (audioData) {
    parts.push({
      inlineData: {
        mimeType: 'audio/webm',
        data: audioData.split(',')[1] || audioData,
      },
    });
  }

  // Add text prompt
  parts.push({
    text: `
      System: You are 'Samriddhi Sahayak', an AI assistant for an Indian government portal. 
      Help the user navigate schemes, eligibility, or grievances. 
      The user may speak in ANY Indian language (Hindi, Bengali, Marathi, etc.) or regional dialect.
      Understand their intent even if the audio is in a local dialect.
      Respond in the user's current selected language: ${context.language || 'English'}.
      Context: ${JSON.stringify(context)}
      User Message: ${prompt || (audioData ? "Please respond to the attached audio message." : "")}
    `
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts }],
  });
  
  return response.text;
};

export const translatePageContent = async (text: string, targetLanguage: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the following text into ${targetLanguage}. Maintain the tone and formatting. Return ONLY the translated text.\n\nText: "${text}"`,
  });
  return response.text;
};

export const checkEligibilityAI = async (userData: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on this user profile: "${userData}", list the government schemes they might be eligible for from the Indian welfare landscape. Provide a JSON list.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            schemeName: { type: Type.STRING },
            reason: { type: Type.STRING },
            nextSteps: { type: Type.STRING }
          },
          required: ["schemeName", "reason"]
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const semanticSearchSchemes = async (query: string, schemes: Scheme[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const simplifiedSchemes = schemes.map(s => ({ id: s.id, name: s.name, description: s.description }));
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user is searching for: "${query}". 
    Below is a list of government schemes. Identify and return the IDs of the most relevant schemes as a JSON array of strings. 
    If no schemes match well, return an empty array [].
    Schemes: ${JSON.stringify(simplifiedSchemes)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};

export const verifyEligibilityWithDocument = async (base64Image: string, schemeName: string, schemeCriteria: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          {
            text: `Analyze the provided document image. Determine if the user is eligible for the scheme: "${schemeName}". 
            Criteria: ${schemeCriteria.join(', ')}. 
            Identify the document type. 
            Check if key information (Name, Date, Income, Category etc.) matches the criteria.
            Return a JSON object with: 
            - isEligible (boolean)
            - confidenceScore (0-100)
            - detectedDocumentType (string)
            - observation (detailed reason why eligible or not)
            - missingInformation (list of fields not found or blurry)`
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isEligible: { type: Type.BOOLEAN },
          confidenceScore: { type: Type.NUMBER },
          detectedDocumentType: { type: Type.STRING },
          observation: { type: Type.STRING },
          missingInformation: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["isEligible", "observation", "detectedDocumentType"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};