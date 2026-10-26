import type { Language } from '../types';

export const PROMPTS_BY_LANG: Record<Language, string[]> = {
  en: [
    "What if the current solution were twice as simple?",
    "How could this work without its main feature?",
    "What would a beginner prefer?",
    "What would this look like on paper?",
    "How could two existing ideas be combined?",
    "What would make this experience more accessible?",
    "What if you had to explain this in three words?",
    "What if this was built for someone 80 years old? Or 8 years old?",
    "How would nature or biology solve this challenge?",
    "What is the most extreme or absurd version of this idea?",
    "What if there were zero screens or technology involved?",
    "What would happen if you reversed the entire process?",
    "How could this be done in 10 seconds instead of 10 minutes?",
    "What if you removed the most expensive or complex element?",
    "How could this feel magical, tactile, or poetic?",
    "What would a minimalist architect or printmaker design here?",
  ],
  uz: [
    "Agar hozirgi yechim ikki barobar soddaroq bo'lsa-chi?",
    "Bu asosiy funksiyasisiz qanday ishlashi mumkin?",
    "Yangi boshlovchi foydalanuvchi nimani afzal ko'rardi?",
    "Bu oddiy qog'ozda qanday ko'rinishda bo'lardi?",
    "Mavjud ikkita g'oyani qanday qilib bitta mukammal yechimga birlashtirish mumkin?",
    "Ushbu tajribani qanday qilib har qanday inson uchun qulay qilish mumkin?",
    "Agar buni atigi 3 ta so'zda ifodalash kerak bo'lsa-chi?",
    "Agar bu 80 yoshli nuroniy yoki 8 yoshli bola uchun yaratilsa-chi?",
    "Tabiat yoki biologiya ushbu muammoni qanday hal qilardi?",
    "Ushbu g'oyaning eng noodatiy yoki keskin ko'rinishi qanday bo'lardi?",
    "Agar bu yerda hech qanday raqamli ekran yoki texnologiya bo'lmasa-chi?",
    "Agar butun jarayonni teskari tartibda bajarsak nima bo'ladi?",
    "Buni 10 daqiqa emas, 10 soniyada qanday amalga oshirish mumkin?",
    "Eng qimmat yoki eng murakkab qismini olib tashlasak-chi?",
    "Bu qanday qilib hayratlanarli, hissiy yoki jozibador tuyulishi mumkin?",
    "Minimalist me'mor yoki kitob ustasi bu yerda nimani loyihalagan bo'lardi?",
  ],
};

export function getRandomPrompt(currentPrompt?: string, lang: Language = 'en'): string {
  const list = PROMPTS_BY_LANG[lang] || PROMPTS_BY_LANG.en;
  const available = list.filter((p) => p !== currentPrompt);
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex] || list[0];
}
