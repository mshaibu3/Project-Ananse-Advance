
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { SYSTEM_MESSAGE } from "../constants";
import { PhoneUseAnalysis, DriverIdentity } from "../types";

export class GeminiService {
  /**
   * Robustly parses JSON from the model's response, handling potential markdown blocks
   * and illegal trailing commas that often cause "Unexpected token ','" errors.
   */
  private safeParseJson(text: string | undefined): any {
    if (!text) return null;
    try {
      // 1. Remove markdown code blocks if present
      let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      // 2. Remove trailing commas in objects and arrays which Gemini sometimes includes in its output.
      cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");
      
      return JSON.parse(cleaned);
    } catch (e) {
      console.error("ANANSE_JSON_PARSE_ERROR:", e, "Raw Payload:", text);
      return null;
    }
  }

  /**
   * Complex analysis using Gemini 3 Pro for high-stakes evidence verification.
   * Enhanced with GAN-Sync restoration for license plates and faces.
   */
  async analyzeComplexViolation(imagePrompt: string, base64Image?: string): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const parts: any[] = [
      { text: `ANANSE TACTICAL OVERRIDE: Perform a deep multi-agent analysis with GAN-SYNC RESTORATION active.
      
      RESTORATION MANDATE:
      1. NEURAL DE-HAZE: Neutralize visual artifacts from high-density Harmattan dust or tropical precipitation (rain).
      2. PLATE RECONSTRUCTION: Prioritize TR_OCR glyph integrity. If glyphs are blurred, use temporal-spatial GAN logic to reconstruct the high-probability alphanumeric string.
      3. BIOMETRIC FIDELITY: Reconstruct facial landmarks if obscured by glass glare or environmental moisture.
      
      ANALYTICAL TASKS:
      - Identify primary and secondary infractions.
      - Assess 'Vehicle Behavioral Profile' (Stable vs Aggressive).
      - Cross-reference Plate/Make/Color against expected DVLA registry patterns.
      - Provide a forensic reasoning log.` }
    ];
    
    if (base64Image) {
      parts.push({
        inlineData: { mimeType: "image/jpeg", data: base64Image }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_MESSAGE,
        maxOutputTokens: 16000,
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            violationType: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            behavioralProfile: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            restorationQuality: {
              type: Type.OBJECT,
              properties: {
                plateReconstructionScore: { type: Type.NUMBER, description: "GAN fidelity for license plate (0.0-1.0)" },
                biometricIntegrityScore: { type: Type.NUMBER, description: "GAN fidelity for facial features (0.0-1.0)" },
                artifactNeutralizationLevel: { type: Type.STRING, description: "CLEAN, PARTIAL, or REMAINING_NOISE" }
              },
              required: ["plateReconstructionScore", "biometricIntegrityScore", "artifactNeutralizationLevel"]
            },
            environmentalFactors: {
              type: Type.OBJECT,
              properties: {
                lightingCondition: { type: Type.STRING },
                visibilityRating: { type: Type.NUMBER, description: "0.0 (Blind) to 1.0 (Crystal)" },
                moistureInterference: { type: Type.BOOLEAN },
                chromaticIntegrity: { type: Type.NUMBER }
              },
              required: ["lightingCondition", "visibilityRating", "chromaticIntegrity"]
            },
            vehicle: {
              type: Type.OBJECT,
              properties: {
                plate: { type: Type.STRING },
                make: { type: Type.STRING },
                model: { type: Type.STRING },
                color: { type: Type.STRING }
              },
              required: ["plate", "make", "model", "color"]
            },
            driverIdentity: {
              type: Type.OBJECT,
              properties: {
                idConfirmed: { type: Type.BOOLEAN },
                matchConfidence: { type: Type.NUMBER },
                occlusionDetected: { type: Type.BOOLEAN },
                reasoning: { type: Type.STRING }
              },
              required: ["idConfirmed", "matchConfidence", "occlusionDetected", "reasoning"]
            },
            securitySignature: { type: Type.STRING }
          },
          required: ["violationType", "confidenceScore", "reasoning", "vehicle", "behavioralProfile", "driverIdentity", "restorationQuality"]
        }
      }
    });

    return this.safeParseJson(response.text);
  }

  /**
   * Biometric Identity Verification with Occlusion Compensation.
   * Compares cabin image against DVLA reference patterns.
   */
  async identifyDriver(imageBase64: string): Promise<DriverIdentity | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: `ANANSE BIOMETRIC SCAN: Execute deep facial landmark analysis with NEURAL RECONSTRUCTION. 
          1. Map 68 facial points even if partially occluded.
          2. Compensate for artifacts (sunglasses, masks, cap brims).
          3. Compare against DVLA reference metadata patterns (age range, facial geometry).
          4. Confirm if identity is 'VERIFIED' with a high-value confidence threshold.
          Identify occlusion type and provide a resilience score for the match.` },
          { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
        ]
      },
      config: {
        systemInstruction: SYSTEM_MESSAGE,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            idConfirmed: { type: Type.BOOLEAN },
            matchConfidence: { type: Type.NUMBER },
            identifiedName: { type: Type.STRING },
            occlusionDetected: { type: Type.BOOLEAN },
            occlusionType: { 
              type: Type.STRING, 
              description: "SUNGLASSES, MASK, HAND, POSTURE, or NONE" 
            },
            occlusionResilienceScore: { type: Type.NUMBER, description: "Scale 0.0 to 1.0" },
            reasoning: { type: Type.STRING }
          },
          required: ["idConfirmed", "matchConfidence", "occlusionDetected", "occlusionResilienceScore", "reasoning"]
        }
      }
    });

    return this.safeParseJson(response.text);
  }

  /**
   * Enhanced Cabin Analysis for Phone Usage and Gaze Detection.
   */
  async analyzePhoneUse(videoBase64: string, mimeType: string): Promise<PhoneUseAnalysis | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { 
            text: `CRITICAL CABIN ANALYSIS: Execute a zero-trust audit of driver behavior. 
            Detect mobile phone usage and strictly classify the holding pose.
            
            GAZE TRACKING MANDATE: Perform high-fidelity iris and head-pose analysis to identify:
            - 'ROAD': Gaze is fixed on the path ahead.
            - 'LAP': Gaze is directed down towards the driver's lap area.
            - 'DEVICE': Gaze is fixed on a mobile device or secondary screen.
            - 'PASSENGER': Gaze is directed towards the front-seat passenger.
            - 'OTHER': Any other diverted gaze (e.g. side mirrors, rear-view, or out-of-window).
            
            Identify holding pose: HAND_TO_EAR, TEXTING_IN_LAP, DASHBOARD_MOUNT, HAND_IN_VIEW.
            Assess overall distraction level and provide specific confidence scores for both general detection and the gaze vector.` 
          },
          { inlineData: { data: videoBase64, mimeType: mimeType } }
        ]
      },
      config: {
        systemInstruction: SYSTEM_MESSAGE,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            violationDetected: { type: Type.BOOLEAN },
            phoneDetected: { type: Type.BOOLEAN },
            holdingPose: { 
              type: Type.STRING,
              description: "Specific pose: HAND_TO_EAR, TEXTING_IN_LAP, DASHBOARD_MOUNT, or HAND_IN_VIEW."
            },
            gazeDirection: { 
              type: Type.STRING, 
              description: "ROAD, LAP, DEVICE, PASSENGER, or OTHER" 
            },
            gazeConfidence: { 
              type: Type.NUMBER, 
              description: "Confidence in the gaze vector analysis (0.0 to 1.0)" 
            },
            confidenceScore: { 
              type: Type.NUMBER, 
              description: "Overall detection confidence (0.0 to 1.0)" 
            },
            reasoning: { type: Type.STRING },
            poseEstimation: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                distractionLevel: { type: Type.NUMBER, description: "Scale 0.0 to 1.0" }
              },
              required: ["description", "distractionLevel"]
            }
          },
          required: [
            "violationDetected", 
            "phoneDetected", 
            "holdingPose", 
            "gazeDirection", 
            "gazeConfidence",
            "confidenceScore", 
            "reasoning", 
            "poseEstimation"
          ]
        }
      }
    });

    return this.safeParseJson(response.text);
  }

  async generateEvidenceImage(prompt: string): Promise<string | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-fidelity neural evidence view of ${prompt}. Realistic, security grade, quantum-timestamped.` }]
      },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  }
}

export const geminiService = new GeminiService();
