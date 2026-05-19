/**
 * Motivational quotes — Nepali context, PSC toppers, engineers, and thought leaders.
 */

export const QUOTES: { text: string; author: string; context?: string }[] = [
  { text: "सपना त्यो होइन जुन सुत्दा देखिन्छ, सपना त्यो हो जसले सुत्न दिँदैन।", author: "APJ Abdul Kalam", context: "Former President of India" },
  { text: "कठिन परिश्रमको कुनै विकल्प छैन।", author: "APJ Abdul Kalam" },
  { text: "असफलता भनेको सफलताको ढिलो आउने रूप हो।", author: "Laxmi Prasad Devkota", context: "Mahakavi" },
  { text: "जीवनमा सबैभन्दा ठूलो गल्ती भनेको गल्ती गर्ने डरमा केही नगर्नु हो।", author: "APJ Abdul Kalam" },
  { text: "तपाईंको समय सीमित छ, अरूको जीवन जिउँदै नबिताउनुहोस्।", author: "Steve Jobs" },
  { text: "Consistency beats talent when talent doesn't work hard.", author: "PSC Topper Advice" },
  { text: "दिनको ६ घण्टा focused study ले ३ महिनामा PSC crack गर्न सकिन्छ।", author: "NTC Officer (2079 batch)" },
  { text: "Mock test मा fail हुनु real exam मा pass हुनुको तयारी हो।", author: "Loksewa Preparation Guide" },
  { text: "Every expert was once a beginner. हरेक सफल व्यक्ति एक दिन beginner थिए।", author: "Anonymous" },
  { text: "तपाईंले आज गर्ने मेहनतले भोलिको तपाईंलाई धन्यवाद दिनेछ।", author: "Nepali Proverb" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "पढ्ने बेलामा पढ, खेल्ने बेलामा खेल — यही balance ले सफलता दिन्छ।", author: "PSC Topper (2080)" },
  { text: "The pain of discipline is far less than the pain of regret.", author: "Engineering Wisdom" },
  { text: "नेपालमा opportunity छ, तर तयारी गरेकालाई मात्र।", author: "IT Industry Leader" },
  { text: "Code every day. Even 30 minutes counts. Consistency > intensity.", author: "Senior Developer Advice" },
  { text: "Interview मा confidence आउँछ preparation बाट, luck बाट होइन।", author: "HR Professional" },
  { text: "तपाईं जहाँ छौ त्यहाँबाट सुरु गर्नुहोस्। तपाईंसँग जे छ त्यो प्रयोग गर्नुहोस्।", author: "Arthur Ashe" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "GK को लागि daily 30 min current affairs पढ्नुहोस् — exam मा 15+ marks guaranteed।", author: "Loksewa Coach" },
  { text: "Remote job पाउन portfolio > resume। Build projects, not just CVs.", author: "Tech Recruiter Nepal" },
  { text: "मन लाग्दैन भन्दा पनि बस्नुहोस्। Discipline > Motivation.", author: "Self-discipline Philosophy" },
  { text: "एउटा राम्रो habit ले तपाईंको पूरा जीवन बदल्न सक्छ।", author: "James Clear (Atomic Habits)" },
  { text: "तपाईंको competition अरूसँग होइन, हिजोको आफूसँग हो।", author: "Growth Mindset" },
  { text: "Networking subject मा strong भए NTC exam को 40% secure हुन्छ।", author: "NTC Officer Level 7 Topper" },
  { text: "Job rejection is redirection. हरेक 'No' ले तपाईंलाई सही 'Yes' तिर लैजान्छ।", author: "Career Coach" },
  { text: "Rest is not laziness. Recovery is part of the process.", author: "Mental Health Awareness" },
  { text: "आज को एक घण्टा मेहनतले भोलिको एक वर्ष बचाउँछ।", author: "Time Management Principle" },
  { text: "System बनाउनुहोस्, goal मात्र होइन। System ले तपाईंलाई daily अगाडि बढाउँछ।", author: "James Clear" },
  { text: "Nepal मा IT sector बढ्दैछ। तयार हुनुहोस्, opportunity आउँदैछ।", author: "Nepal Tech Community" },
  { text: "हार मान्नु भनेको हार हो। लड्दै रहनु भनेको जित्नुको अर्को नाम हो।", author: "Nepali Wisdom" },
];

export function getTodayQuote(): { text: string; author: string; context?: string } {
  // Deterministic based on date — same quote all day
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return QUOTES[dayOfYear % QUOTES.length];
}

export const STREAK_MILESTONES = [
  { days: 7, badge: '🔥', label: '1 Week Warrior', message: '7 din lagatar! Ramro!' },
  { days: 14, badge: '⚡', label: '2 Week Champion', message: 'Consistency building!' },
  { days: 21, badge: '💎', label: '21 Day Habit', message: 'Habit formed! Science says so.' },
  { days: 30, badge: '🏆', label: '30 Day Legend', message: '1 mahina! Incredible discipline.' },
  { days: 45, badge: '👑', label: '45 Day King', message: 'Unstoppable momentum!' },
  { days: 60, badge: '🌟', label: '60 Day Master', message: '2 months of pure dedication.' },
  { days: 90, badge: '💫', label: '90 Day Titan', message: 'Quarter year! You are transformed.' },
];
