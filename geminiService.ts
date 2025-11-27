import { GoogleGenAI, Modality } from "@google/genai";

// Helpers for Audio
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// 1. Generate Image (Nano Banana)
export const generateWorldImage = async (prompt: string): Promise<string | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key missing");
    return null;
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

// 2. Text to Speech
export const playNarrativeAudio = async (text: string, audioContext: AudioContext): Promise<void> => {
  if (!process.env.API_KEY) return;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const prompt = `Narrate the following text in a mysterious, epic, and storytelling tone suitable for a fantasy legend. Language: Spanish (Latin America). Text: "${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Deep, mysterious voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio) {
      const audioBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(audioBytes, audioContext);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (error) {
    console.error("Error generating speech:", error);
  }
};

// 3. Chat Assistant (Hint System)
export const getAiHint = async (
  currentWorldTitle: string,
  riddle: string,
  userQuery: string
): Promise<string> => {
  if (!process.env.API_KEY) return "Lo siento, no tengo conexión con los sabios.";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const systemInstruction = `Eres un sabio asistente mágico en el juego "La Saga de los Números Eternos". 
    El usuario está atrapado en: ${currentWorldTitle}.
    El acertijo es: "${riddle}".
    Tu objetivo es dar una PISTA sutil sobre cómo resolver la ecuación lineal, pero NO des la respuesta directa (el número).
    Habla con tono místico y breve.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Las estrellas guardan silencio...";
  } catch (error) {
    console.error("Chat error:", error);
    return "El oráculo está nublado.";
  }
};
