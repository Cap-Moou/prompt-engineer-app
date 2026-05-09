import { GoogleGenAI } from '@google/genai';
import { PromptConfig } from '../types';
import { IMAGE_MODELS } from '../constants';

const MODEL_MINDSETS: Record<string, string> = {
  // Image Models
  "GOOGLE NANO BANANA PRO": "Luxury commercial photographer mindset. Focus on ultra-realism, premium materials (marble, onyx), clean composition, physically accurate lighting. Use structured prompts with camera lens and lighting details.",
  "GOOGLE NANO BANANA2": "Fast and flexible creative model. Social-media optimized. Rapid content generation, simple visual descriptions, trendy aesthetics.",
  "SEEDREAM 5 LITE": "Stylized concept artist mindset. Fantasy-inspired, emotional atmosphere, color harmony, creative lighting. Avoid hyper-realism.",
  "SEEDREAM 4.5": "Balanced cinematic art. Realism + stylized storytelling. Dramatic lighting, composition-heavy.",
  "FLUX.2 PRO": "Professional photography focus. Realism, clean details, photography terminology, natural lighting.",
  "FLUX.2 MAX": "Cinematic and artistic. Dramatic atmosphere, premium aesthetics, luxury campaigns, fashion editorials.",
  "FLUX.2 FLEX": "Experimental and creative. Mixed aesthetics, unusual concepts, abstract combinations.",
  "CINEMATIC": "Movie-frame aesthetics. Film language, camera directions, anamorphic descriptions, dramatic visual composition.",
  
  // Video Models
  "SEEDANCE 2.0": "Dynamic action focus. High-energy motion, fast pacing language. Keywords: high-energy, dynamic movement.",
  "SEEDANCE 2.0 FAST": "Lightweight rapid generation. Simple motion descriptions, short prompts.",
  "SEEDANCE 1.5 PRO": "Stable cinematic movement. Smoother camera motion, artistic sequences, storytelling focus.",
  "KLING 3.0": "Film director mindset. Realistic physics, 'motion dynamics', 'cinematic tracking shot', 'environmental interaction'. Focus on sequential action.",
  "KLING 3.0 MOTION CONTROL": "Precision motion control. Object trajectories, timing-based prompts, professional choreography.",
  "GROK": "Creative and experimental. Abstract concepts, viral internet visuals, unconvential ideas.",
  "GROK 4.1": "Cinematic reasoning. Narrative prompts, visual consistency, stylized storytelling.",
  "KLING 2.6": "Balanced realism. Stable motion, image-to-video consistency.",
  "KLING 2.6 MOTION CONTROL": "Precision camera choreography, tracking instructions.",
  "KLING 2.5": "Cinematic physics-based. Realistic destruction, dramatic motion logic.",
  "GOOGLE VEO 3.1": "Full cinematic screenplay logic. 'Cinematic realism', 'screenplay-style prompts', 'realistic continuity', 'narrative logic'. Natural language, story progression.",
  "GOOGLE VEO 3.1 FAST": "Rapid cinematic previews, idea testing.",
  "GOOGLE VEO 3.1 LITE": "Simple cinematic language, basic scene descriptions.",
  "RUNWAY GEN-4.5": "Aesthetic-first. Artistic visuals, fashion energy, music-video style motion.",
  "RUNWAY ACT TWO": "Human performance focus. Facial acting, dialogue motion, emotional realism, acting instructions.",
  "PIXVERSE 6": "Social media motion. Viral content pacing, TikTok/Reels style, flashy transitions.",
  "PIXVERSE 5.5": "Fast short-form clips, draft previews.",
  "WAN 2.6": "Temporal sequencing. 'Temporal storytelling', 'scene progression', 'cinematic sequencing'. Multi-stage scenes.",
  "HAILUO 2.3": "Smooth motion, clean scene direction, emotional atmosphere, pleasing compositions."
};

export const enhanceCoreIdea = async (idea: string, language: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API Key is not configured');
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const promptText = `
You are a creative cinematic director. Take the following short scene idea and expand it into a detailed, captivating, and highly descriptive cinematic scenario. 
Maintain the original intent but add rich visual details, emotional depth, and atmospheric context suitable for an AI video generation prompt.
Do not output anything other than the enhanced scenario itself.

Original Idea: ${idea}
Output Language: ${language === 'ar' ? 'Arabic' : 'English'}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptText,
    });
    
    return response.text || idea;
  } catch (error) {
    console.error('Error enhancing idea:', error);
    throw error;
  }
};

export const generatePromptFromIdea = async (idea: string, withDialogue: boolean, language: string, aiModel: string, dialect?: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Please add it to your environment variables.');
  }

  const isImageModel = IMAGE_MODELS.includes(aiModel);
  const ai = new GoogleGenAI({ apiKey });
  const modelMindset = MODEL_MINDSETS[aiModel] || "Generic high-quality AI generation model.";
  const dialectText = dialect ? `the ${dialect} dialect/language` : (language === 'ar' ? 'Arabic (بدون تشكيل)' : 'English');
  const dialogueInstruction = isImageModel 
    ? `Since this is an IMAGE MODEL, do NOT include ANY dialogue or sound descriptions.` 
    : (withDialogue 
        ? `You MUST include character dialogue. Write the dialogue natively in ${dialectText}. Wrap the dialogue in double quotes.`
        : `Do NOT include any dialogue.`);

  const promptText = `
You are a master technical prompt engineer and ${isImageModel ? 'professional photographer' : 'cinematic director'}. 
Your task is to take the following core idea and convert it into a highly professional, ${isImageModel ? 'static visual' : 'cinematic'} prompt for an advanced AI ${isImageModel ? 'image' : 'video'} generation tool.

Core Idea: ${idea}

TARGET MODEL MINDSET:
${modelMindset}

CRITICAL RULES AND LOGIC:

1. SMART AUTOPILOT (COMPLETION LOGIC):
Since I am only providing the core idea, YOU MUST AUTO-COMPLETE ALL MISSING COMPONENTS: ${isImageModel ? 'Lighting, Style, Background, and Character Details' : 'Camera Motion, Lighting, VFX, SFX, Video Style, Background, and Character Details'}. 
Make choices that are ${isImageModel ? 'visually stunning' : 'cinematically consistent'} with the Core Idea.

2. MODEL ADAPTATION (TARGET AI: ${aiModel || 'Generic Multi-modal AI'}):
Inject highly specific terminology and formatting based on the chosen model.
Use the TARGET MODEL MINDSET to guide the terminology.

3. ${isImageModel ? 'VISUAL LOGIC' : 'DIALOGUE LOGIC'}:
${dialogueInstruction}

4. LINE-BY-LINE ARCHITECTURE (MANDATORY OUTPUT FORMAT):
You are STRICTLY FORBIDDEN from writing the prompt as a continuous paragraph. You MUST output EXACTLY and ONLY the following discrete lines. Start each line with the exact English header provided below:

Visual Quality: [Translate to English: Describe resolution, camera type, film grain, and lens matching the aiModel]
Camera Work: [Translate to English: Describe ${isImageModel ? 'camera angle and framing' : 'camera motion'}]
Character Details: [Translate to English: Precise description of clothing, facial features, skin texture, and micro-expressions]
Scene Background & Lighting: [Translate to English: Environment details, lighting setup, shadow play]
${isImageModel ? '' : 'Dialogue & Lip-Sync: [English description of facial emotions] speaking: "[Dialogue text per instructions or write \'No dialogue\']"\nVFX & Soundscape: [Translate to English: Visual effects and ambient sound descriptions]\n'}Negative Prompt: no text on video, no logos or watermark, no extra limbs, deformed, ugly, bad anatomy, poorly drawn face, mutated, blurry, low resolution

Do not include any prefixes, introductions, or conversational text. Output ONLY the ${isImageModel ? '5' : '7'} formatted lines.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptText,
    });
    
    return response.text || '';
  } catch (error) {
    console.error('Error generating direct prompt:', error);
    throw error;
  }
};

export const generateCinematicPrompt = async (config: PromptConfig): Promise<string> => {

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Please add it to your environment variables.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const isImageModel = IMAGE_MODELS.includes(config.aiModel);
  const modelMindset = MODEL_MINDSETS[config.aiModel] || "Generic high-quality AI generation model.";

  const tashkeelInstruction = isImageModel
    ? `Since this is an IMAGE MODEL, DO NOT include any dialogue or speech validation.`
    : (config.applyTashkeel 
        ? `You must NEVER translate the Dialogue into English. You MUST keep the original Arabic text. CRITICAL: You MUST add FULL ARABIC DIACRITICS (التشكيل الكامل: فتحة، ضمة، كسرة، سكون، شدة) to every single Arabic letter in the dialogue. The diacritics must strictly match the phonetic pronunciation of the selected Dialect (${config.dialect || 'Standard Arabic'}). Wrap the diacritized Arabic dialogue in double quotes and combine it with English descriptions of the character's facial and emotional expressions to help guide the lip-syncing.`
        : `You must NEVER translate the Dialogue into English. You MUST keep the exact original Arabic text strictly as provided by the user, WITHOUT adding any diacritics (بدون تشكيل). Wrap the literal Arabic dialogue in double quotes and combine it with English descriptions of the character's facial and emotional expressions to help guide the lip-syncing.`);

  const promptText = `
You are a master technical prompt engineer and ${isImageModel ? 'professional photographer' : 'cinematic director'}. Your task is to take the following input details (which are in Arabic and English) and convert them into a highly professional, ${isImageModel ? 'static visual' : 'cinematic'} prompt for an advanced AI ${isImageModel ? 'image' : 'video'} generation tool.

TARGET MODEL MINDSET:
${modelMindset}

CRITICAL RULES AND LOGIC:

1. SMART AUTOPILOT (COMPLETION LOGIC):
Review all inputs. If any field (like Camera Motion, Lighting, VFX, SFX, Video Style, Environment) is 'None provided' or empty, YOU MUST INVENT AND AUTO-COMPLETE IT. Make choices that are ${isImageModel ? 'visually stunning' : 'cinematically consistent'} with the Core Idea and Character descriptions. ${isImageModel ? 'Focus on composition and texture.' : 'Ensure the action feels suitable for an 8-second looping clip.'}

2. MODEL ADAPTATION (TARGET AI: ${config.aiModel || 'Generic Multi-modal AI'}):
Inject highly specific terminology and formatting based on the chosen model.
Use the TARGET MODEL MINDSET to guide the terminology.

3. ${isImageModel ? 'VISUAL REQUIREMENTS' : 'DIALOGUE'}:
${tashkeelInstruction}

4. LINE-BY-LINE ARCHITECTURE (MANDATORY OUTPUT FORMAT):
You are STRICTLY FORBIDDEN from writing the prompt as a continuous paragraph. You MUST output EXACTLY and ONLY the following discrete lines. Start each line with the exact English header provided below:

Visual Quality: [Translate to English: Describe resolution, camera type, film grain, and lens matching the aiModel]
Camera Work: [Translate to English: Describe ${isImageModel ? 'camera angle and framing' : 'camera motion - must be auto-completed if empty'}]
Character Details: [Translate to English: Precise description of clothing, facial features, skin texture, and micro-expressions]
Scene Background & Lighting: [Translate to English: Environment details, lighting setup, shadow play - must be auto-completed if empty]
${isImageModel ? '' : 'Dialogue & Lip-Sync: [English description of facial emotions] speaking: "[Exact original Arabic text]"\nVFX & Soundscape: [Translate to English: Visual effects and ambient sound descriptions - must be auto-completed if empty]\n'}Negative Prompt: no text on video, no logos or watermark, no extra limbs, deformed, ugly, bad anatomy, poorly drawn face, mutated, blurry, low resolution

Do not include any prefixes, introductions, or conversational text. Output ONLY the ${isImageModel ? '5' : '7'} formatted lines.

Input Settings:
- Core Idea: ${config.scenario || 'None provided'}
- Background: ${config.background || 'None provided'}
- Characters Description: ${config.characters || 'None provided'}
- Dialogue: ${config.dialogue || 'None provided'}
- Dialect/Language: ${config.dialect || 'None provided'}
- Video Style: ${config.videoStyle || 'None provided'}
- Environment: ${config.environment || 'None provided'}
- Camera Motion: ${config.cameraMotion || 'None provided'}
- Lighting: ${config.lighting || 'None provided'}
- Visual VFX: ${config.visualVfx || 'None provided'}
- Sound SFX: ${config.soundSfx || 'None provided'}

Generate your strictly formatted, breathtaking cinematic prompt now:
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptText,
    });
    
    return response.text?.trim() || 'Error generating prompt. Try again.';
  } catch (err) {
    console.error('Error in geminiService:', err);
    throw err;
  }
};
