export const CATEGORIES = [
  "Academic Stress",
  "Loneliness",
  "Breakup",
  "Career Pressure",
  "Family Problems",
  "Anxiety",
  "Hope",
  "Success Story",
  "General",
];

export const MOODS = [
  { name: "Sad", emoji: "🌧️", color: "bg-blue-50 text-blue-700 border-blue-200", darkColor: "dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50", description: "Carrying a heavy heart" },
  { name: "Confused", emoji: "🌀", color: "bg-purple-50 text-purple-700 border-purple-200", darkColor: "dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50", description: "Trying to make sense of things" },
  { name: "Anxious", emoji: "⚡", color: "bg-amber-50 text-amber-700 border-amber-200", darkColor: "dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50", description: "Mind racing or chest tight" },
  { name: "Hopeful", emoji: "🌱", color: "bg-emerald-50 text-emerald-700 border-emerald-200", darkColor: "dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50", description: "Sensing a small light ahead" },
  { name: "Grateful", emoji: "✨", color: "bg-indigo-50 text-indigo-700 border-indigo-200", darkColor: "dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50", description: "Appreciating small gifts" },
  { name: "Better Today", emoji: "☀️", color: "bg-teal-50 text-teal-700 border-teal-200", darkColor: "dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/50", description: "Taking a step forward" },
];

export const REASON_CATEGORIES = [
  "All",
  "Simple Pleasures",
  "Connection",
  "Nature",
  "Art & Music",
  "Future Hopes",
  "Personal Strength",
];

export const CRISIS_RESOURCES = [
  {
    id: "tele-manas",
    title: "Tele-MANAS (National Mental Health Helpline)",
    description: "Government of India's 24/7 toll-free mental health service providing free, confidential counseling and crisis intervention in 20+ regional languages.",
    contact: "Toll-Free: 14416 / 1800-891-4416",
    actionText: "Call 14416",
    actionHref: "tel:14416",
    tag: "Govt of India / 24/7",
    availability: "Available 24/7 (20+ Languages)",
    country: "India (All States & UTs)",
  },
  {
    id: "vandrevala-foundation",
    title: "Vandrevala Foundation Helpline",
    description: "Free, confidential 24/7 mental health counseling and crisis intervention by trained clinical psychologists and counselors.",
    contact: "+91 9999 666 555",
    actionText: "Call +91 9999 666 555",
    actionHref: "tel:+919999666555",
    tag: "Free & Confidential",
    availability: "Available 24/7 / 365 days",
    country: "India",
  },
  {
    id: "kiran-helpline",
    title: "KIRAN Helpline (Govt of India)",
    description: "24/7 toll-free mental health helpline by the Ministry of Social Justice & Empowerment offering early screening, first-aid, and psychological support in 13 languages.",
    contact: "Toll-Free: 1800-599-0019",
    actionText: "Call 1800-599-0019",
    actionHref: "tel:18005990019",
    tag: "Toll-Free 24/7",
    availability: "24/7 Helpline (13 Languages)",
    country: "India",
  },
  {
    id: "aasra",
    title: "AASRA Suicide Prevention",
    description: "A 24-hour non-judgmental helpline offering confidential emotional support to individuals experiencing suicidal thoughts, depression, and despair.",
    contact: "Call +91 98204 66726",
    actionText: "Call AASRA",
    actionHref: "tel:+919820466726",
    tag: "Suicide Prevention",
    availability: "Available 24/7",
    country: "India",
  },
  {
    id: "icall-tiss",
    title: "iCALL Psychosocial Helpline (TISS)",
    description: "Professional, free counseling run by Tata Institute of Social Sciences (TISS) addressing emotional distress, relationship strain, and mental health challenges.",
    contact: "022-25521111 / +91 91529 87821",
    actionText: "Call 022-25521111",
    actionHref: "tel:02225521111",
    tag: "TISS Psychosocial",
    availability: "Mon - Sat (8:00 AM - 10:00 PM)",
    country: "India",
  },
  {
    id: "sneha-india",
    title: "Sneha Suicide Prevention Helpline",
    description: "Volunteer-run 24-hour confidential helpline operating for over 35 years, providing unconditional support to anyone feeling isolated or suicidal.",
    contact: "Call +91 44 2464 0050",
    actionText: "Call Sneha India",
    actionHref: "tel:+914424640050",
    tag: "Befrienders Affiliate",
    availability: "Available 24/7",
    country: "India & International",
  },
  {
    id: "international-hotlines",
    title: "Befrienders Worldwide (International)",
    description: "A global directory of emotional support centers operating across 32+ countries for anyone seeking support outside India.",
    contact: "Global Directory",
    actionText: "Find Local Line",
    actionHref: "https://www.befrienders.org/",
    tag: "International",
    availability: "Worldwide Directory",
    country: "Global",
  }
];

export const SELF_CARE_PRACTICES = [
  {
    title: "The 5-4-3-2-1 Sensory Reset",
    subtitle: "Grounding technique for acute anxiety",
    steps: [
      "5 things you can SEE around you right now",
      "4 things you can physically TOUCH or feel",
      "3 things you can HEAR in the room or outdoors",
      "2 things you can SMELL (or favorite scents)",
      "1 thing you can TASTE or one positive thought",
    ],
    time: "3-5 mins",
  },
  {
    title: "The 4-7-8 Breathing Reset",
    subtitle: "Slows the nervous system & heart rate",
    steps: [
      "Inhale quietly through the nose for 4 seconds",
      "Hold your breath gently for 7 seconds",
      "Exhale completely through your mouth for 8 seconds",
      "Repeat for 4 peaceful cycles",
    ],
    time: "2 mins",
  },
  {
    title: "The 'Mammalian Dive Reflex' Cold Splash",
    subtitle: "Instant biological reset for panic",
    steps: [
      "Fill a sink or bowl with cold ice water",
      "Gently splash cool water on your eyes, forehead, and temples",
      "Feel the sudden calming drop in racing heart rate",
      "Pat dry with a soft towel and take a slow sip of water",
    ],
    time: "1-2 mins",
  }
];

export function formatTimeAgo(dateString) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  } catch {
    return "Recently";
  }
}
