import {
  BehavioralSignals,
  BehaviorEvent,
  MockQuestionBeh,
  Participant,
  SegmentComparison,
} from "./insightTypes";

export type QuestionType =
  | "binary"
  | "text"
  | "numeric"
  | "single-choice"
  | "multiple-choice"
  | "ranking"
  | "rating"
  | "media"
  | "3d-option";

export interface QuestionResult {
  id: string;
  number: number;
  text: string;
  type: QuestionType;
  totalResponses: number;
  skipped: number;
  data: any;
}

export const mockQuestions: QuestionResult[] = [
  {
    id: "1",
    number: 1,
    text: "Would you recommend our product to a friend or colleague?",
    type: "binary",
    totalResponses: 248,
    skipped: 3,
    data: {
      yes: 189,
      no: 59,
    },
  },
  {
    id: "2",
    number: 2,
    text: "What is your primary reason for using our product?",
    type: "single-choice",
    totalResponses: 245,
    skipped: 6,
    data: {
      options: [
        { label: "Save time", count: 89 },
        { label: "Better organization", count: 67 },
        { label: "Team collaboration", count: 52 },
        { label: "Cost savings", count: 24 },
        { label: "Other", count: 13 },
      ],
    },
  },
  {
    id: "3",
    number: 3,
    text: "Which features do you use most frequently?",
    type: "multiple-choice",
    totalResponses: 242,
    skipped: 9,
    data: {
      options: [
        { label: "Dashboard", count: 198, percentage: 81.8 },
        { label: "Reports", count: 156, percentage: 64.5 },
        { label: "Integrations", count: 134, percentage: 55.4 },
        { label: "Team Management", count: 89, percentage: 36.8 },
        { label: "API Access", count: 45, percentage: 18.6 },
        { label: "Mobile App", count: 78, percentage: 32.2 },
      ],
    },
  },
  {
    id: "4",
    number: 4,
    text: "How would you rate your overall experience?",
    type: "rating",
    totalResponses: 247,
    skipped: 4,
    data: {
      scale: 5,
      distribution: [
        { value: 1, count: 8 },
        { value: 2, count: 15 },
        { value: 3, count: 42 },
        { value: 4, count: 98 },
        { value: 5, count: 84 },
      ],
      mean: 3.95,
      median: 4,
      stdDev: 1.02,
    },
  },
  {
    id: "5",
    number: 5,
    text: "Please rank the following features by importance",
    type: "ranking",
    totalResponses: 238,
    skipped: 13,
    data: {
      options: [
        { label: "Ease of use", avgRank: 1.8 },
        { label: "Performance", avgRank: 2.3 },
        { label: "Customer support", avgRank: 3.1 },
        { label: "Pricing", avgRank: 3.4 },
        { label: "Feature set", avgRank: 4.2 },
      ],
    },
  },
  {
    id: "6",
    number: 6,
    text: "How many hours per week do you spend using our product?",
    type: "numeric",
    totalResponses: 241,
    skipped: 10,
    data: {
      mean: 12.4,
      median: 10,
      min: 1,
      max: 45,
      stdDev: 8.7,
      distribution: [
        { range: "0-5", count: 45 },
        { range: "6-10", count: 78 },
        { range: "11-15", count: 52 },
        { range: "16-20", count: 34 },
        { range: "21-30", count: 22 },
        { range: "31+", count: 10 },
      ],
    },
  },
  {
    id: "7",
    number: 7,
    text: "What improvements would you like to see?",
    type: "text",
    totalResponses: 186,
    skipped: 65,
    data: {
      responses: [
        {
          id: 1,
          text: "Better mobile experience would be amazing. The app feels clunky on smaller screens.",
          timestamp: "2024-01-15T10:23:00Z",
        },
        {
          id: 2,
          text: "More integration options with third-party tools like Zapier and Make.",
          timestamp: "2024-01-15T09:45:00Z",
        },
        {
          id: 3,
          text: "Faster loading times for the dashboard. Sometimes it takes 5+ seconds.",
          timestamp: "2024-01-14T16:30:00Z",
        },
        {
          id: 4,
          text: "Dark mode please! My eyes hurt after long sessions.",
          timestamp: "2024-01-14T14:12:00Z",
        },
        {
          id: 5,
          text: "The reporting feature needs more customization options.",
          timestamp: "2024-01-14T11:08:00Z",
        },
        {
          id: 6,
          text: "Would love to see AI-powered insights and recommendations.",
          timestamp: "2024-01-13T19:55:00Z",
        },
        {
          id: 7,
          text: "Better keyboard shortcuts for power users.",
          timestamp: "2024-01-13T15:42:00Z",
        },
        {
          id: 8,
          text: "Export to more formats - currently only CSV is supported.",
          timestamp: "2024-01-13T10:20:00Z",
        },
      ],
    },
  },
  {
    id: "8",
    number: 8,
    text: "Which visual style do you prefer for the new interface?",
    type: "media",
    totalResponses: 234,
    skipped: 17,
    data: {
      options: [
        {
          id: 1,
          label: "Modern Minimal",
          imageUrl:
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=200&fit=crop",
          count: 89,
        },
        {
          id: 2,
          label: "Bold & Colorful",
          imageUrl:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
          count: 67,
        },
        {
          id: 3,
          label: "Classic Professional",
          imageUrl:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
          count: 45,
        },
        {
          id: 4,
          label: "Dark & Sleek",
          imageUrl:
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop",
          count: 33,
        },
      ],
    },
  },
  {
    id: "9",
    number: 9,
    text: "How do you feel about our new 3D product viewer?",
    type: "3d-option",
    totalResponses: 229,
    skipped: 22,
    data: {
      like: 167,
      dislike: 62,
    },
  },
];

export const surveyMetadata = {
  title: "Q4 2024 Product Feedback Survey",
  totalResponses: 251,
  completionRate: 78.4,
  avgCompletionTime: "4m 32s",
  dateRange: {
    start: "2024-01-01",
    end: "2024-01-15",
  },
};

export const mockQuestionsBeh: MockQuestionBeh[] = [
  {
    id: "q1",
    number: 1,
    text: "How satisfied are you with our product overall?",
    type: "rating",
    responseRate: 98,
    dropOffRate: 2,
    avgTimeSpent: 8.2,
  },
  {
    id: "q2",
    number: 2,
    text: "What features do you use most frequently?",
    type: "multiple_choice",
    responseRate: 95,
    dropOffRate: 3,
    avgTimeSpent: 15.4,
  },
  {
    id: "q3",
    number: 3,
    text: "Please describe your experience with our customer support.",
    type: "text",
    responseRate: 82,
    dropOffRate: 13,
    avgTimeSpent: 45.2,
  },
  {
    id: "q4",
    number: 4,
    text: "How likely are you to recommend us to a colleague?",
    type: "scale",
    responseRate: 78,
    dropOffRate: 4,
    avgTimeSpent: 6.8,
  },
  {
    id: "q5",
    number: 5,
    text: "What is the primary reason for your rating?",
    type: "text",
    responseRate: 71,
    dropOffRate: 7,
    avgTimeSpent: 38.6,
  },
  {
    id: "q6",
    number: 6,
    text: "Which improvements would you prioritize?",
    type: "multiple_choice",
    responseRate: 68,
    dropOffRate: 3,
    avgTimeSpent: 22.1,
  },
];

export const mockBehavioralSignals: Record<string, BehavioralSignals> = {
  q1: {
    avgHesitationTime: 0.8,
    hesitationPercentage: 12,
    avgInteractionDuration: 8.2,
    backtrackPercentage: 2,
    focusLossPercentage: 5,
    idlePercentage: 3,
  },
  q2: {
    avgHesitationTime: 1.2,
    hesitationPercentage: 18,
    avgInteractionDuration: 15.4,
    backtrackPercentage: 8,
    focusLossPercentage: 7,
    idlePercentage: 5,
  },
  q3: {
    avgHesitationTime: 2.6,
    hesitationPercentage: 45,
    avgInteractionDuration: 45.2,
    backtrackPercentage: 15,
    focusLossPercentage: 22,
    idlePercentage: 18,
  },
  q4: {
    avgHesitationTime: 1.8,
    hesitationPercentage: 28,
    avgInteractionDuration: 6.8,
    backtrackPercentage: 5,
    focusLossPercentage: 8,
    idlePercentage: 6,
  },
  q5: {
    avgHesitationTime: 2.1,
    hesitationPercentage: 38,
    avgInteractionDuration: 38.6,
    backtrackPercentage: 12,
    focusLossPercentage: 18,
    idlePercentage: 14,
  },
  q6: {
    avgHesitationTime: 1.5,
    hesitationPercentage: 22,
    avgInteractionDuration: 22.1,
    backtrackPercentage: 10,
    focusLossPercentage: 9,
    idlePercentage: 7,
  },
};

export const mockSegmentComparisons: Record<string, SegmentComparison[]> = {
  q3: [
    {
      segment: "completed",
      signals: {
        avgHesitationTime: 1.8,
        hesitationPercentage: 32,
        avgInteractionDuration: 42.1,
        backtrackPercentage: 8,
        focusLossPercentage: 12,
        idlePercentage: 10,
      },
    },
    {
      segment: "dropped",
      signals: {
        avgHesitationTime: 4.2,
        hesitationPercentage: 68,
        avgInteractionDuration: 52.4,
        backtrackPercentage: 35,
        focusLossPercentage: 45,
        idlePercentage: 38,
      },
    },
  ],
  q5: [
    {
      segment: "completed",
      signals: {
        avgHesitationTime: 1.6,
        hesitationPercentage: 28,
        avgInteractionDuration: 35.2,
        backtrackPercentage: 6,
        focusLossPercentage: 10,
        idlePercentage: 8,
      },
    },
    {
      segment: "dropped",
      signals: {
        avgHesitationTime: 3.8,
        hesitationPercentage: 62,
        avgInteractionDuration: 48.8,
        backtrackPercentage: 28,
        focusLossPercentage: 38,
        idlePercentage: 32,
      },
    },
  ],
};

export const generateBehaviorEvents = (
  status: "completed" | "dropped",
  questionCount: number
): BehaviorEvent[] => {
  const events: BehaviorEvent[] = [];
  let currentTime = 0;

  for (let i = 1; i <= questionCount; i++) {
    // Question start
    events.push({
      timestamp: currentTime,
      type: "question_start",
      details: `Question ${i}`,
    });
    currentTime += Math.random() * 2000 + 500;

    // Hesitation/pause sometimes
    if (Math.random() > 0.6) {
      events.push({
        timestamp: currentTime,
        type: "pause",
        duration: Math.random() * 3000 + 1000,
        details: "Hesitation before interaction",
      });
      currentTime += Math.random() * 3000 + 1000;
    }

    // First interaction
    events.push({
      timestamp: currentTime,
      type: "first_interaction",
      details: `Interacted with question ${i}`,
    });
    currentTime += Math.random() * 1000 + 200;

    // Focus loss sometimes
    if (Math.random() > 0.75) {
      events.push({
        timestamp: currentTime,
        type: "blur",
        details: "Tab lost focus",
      });
      currentTime += Math.random() * 5000 + 2000;
      events.push({
        timestamp: currentTime,
        type: "focus",
        details: "Tab regained focus",
      });
      currentTime += Math.random() * 1000;
    }

    // Backtrack sometimes
    if (Math.random() > 0.8 && i > 1) {
      events.push({
        timestamp: currentTime,
        type: "backtrack",
        details: `Returned to question ${i - 1}`,
      });
      currentTime += Math.random() * 3000 + 1000;
    }

    // Answer
    events.push({
      timestamp: currentTime,
      type: "answer",
      details: `Answered question ${i}`,
    });
    currentTime += Math.random() * 2000 + 500;
  }

  return events;
};

export const mockParticipants: Participant[] = [
  {
    id: "p1",
    startedAt: new Date("2024-01-15T10:23:00"),
    completedAt: new Date("2024-01-15T10:31:00"),
    status: "completed",
    device: "desktop",
    responseTime: "fast",
    questionsAnswered: 6,
    totalQuestions: 6,
    behaviorEvents: generateBehaviorEvents("completed", 6),
  },
  {
    id: "p2",
    startedAt: new Date("2024-01-15T11:45:00"),
    completedAt: new Date("2024-01-15T11:58:00"),
    status: "completed",
    device: "mobile",
    responseTime: "average",
    questionsAnswered: 6,
    totalQuestions: 6,
    behaviorEvents: generateBehaviorEvents("completed", 6),
  },
  {
    id: "p3",
    startedAt: new Date("2024-01-15T14:12:00"),
    status: "dropped",
    device: "mobile",
    responseTime: "slow",
    questionsAnswered: 3,
    totalQuestions: 6,
    droppedAtQuestion: 3,
    behaviorEvents: generateBehaviorEvents("dropped", 3),
  },
  {
    id: "p4",
    startedAt: new Date("2024-01-15T15:30:00"),
    completedAt: new Date("2024-01-15T15:42:00"),
    status: "completed",
    device: "desktop",
    responseTime: "average",
    questionsAnswered: 6,
    totalQuestions: 6,
    behaviorEvents: generateBehaviorEvents("completed", 6),
  },
  {
    id: "p5",
    startedAt: new Date("2024-01-15T16:08:00"),
    status: "dropped",
    device: "desktop",
    responseTime: "slow",
    questionsAnswered: 5,
    totalQuestions: 6,
    droppedAtQuestion: 5,
    behaviorEvents: generateBehaviorEvents("dropped", 5),
  },
  {
    id: "p6",
    startedAt: new Date("2024-01-15T17:22:00"),
    completedAt: new Date("2024-01-15T17:29:00"),
    status: "completed",
    device: "mobile",
    responseTime: "fast",
    questionsAnswered: 6,
    totalQuestions: 6,
    behaviorEvents: generateBehaviorEvents("completed", 6),
  },
];

export const mockSurvey = {
  id: "s1",
  name: "Product Satisfaction Survey Q1 2024",
  totalResponses: 1247,
  completionRate: 68,
  avgCompletionTime: 8.5,
  questions: mockQuestions,
};
