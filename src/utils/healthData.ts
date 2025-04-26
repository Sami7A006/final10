export interface HealthResponse {
  answer: string;
  tips?: string[];
}

// Comprehensive mock database of health-related responses
const healthResponses: Record<string, HealthResponse> = {
  headache: {
    answer: "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or eye strain. Some general recommendations include:",
    tips: [
      "Stay hydrated by drinking plenty of water",
      "Take regular breaks from screens",
      "Practice stress-reduction techniques",
      "Ensure you're getting adequate sleep",
      "Consider if there are any environmental triggers"
    ]
  },
  stress: {
    answer: "Stress is a common experience that can affect both mental and physical health. Here are some general ways to manage stress:",
    tips: [
      "Practice deep breathing exercises",
      "Regular physical activity",
      "Maintain a consistent sleep schedule",
      "Try meditation or mindfulness",
      "Connect with friends and family"
    ]
  },
  sleep: {
    answer: "Good sleep is crucial for overall health. Common sleep issues can often be improved by:",
    tips: [
      "Maintain a consistent sleep schedule",
      "Create a relaxing bedtime routine",
      "Limit screen time before bed",
      "Keep your bedroom cool and dark",
      "Avoid caffeine in the evening"
    ]
  },
  nutrition: {
    answer: "A balanced diet is essential for maintaining good health. General nutrition guidelines include:",
    tips: [
      "Eat plenty of fruits and vegetables",
      "Choose whole grains over refined grains",
      "Include lean proteins in your diet",
      "Stay hydrated throughout the day",
      "Limit processed foods and added sugars"
    ]
  },
  exercise: {
    answer: "Regular physical activity is important for overall health and well-being. Here are some exercise recommendations:",
    tips: [
      "Aim for at least 150 minutes of moderate activity per week",
      "Include both cardio and strength training",
      "Start slowly and gradually increase intensity",
      "Choose activities you enjoy",
      "Listen to your body and rest when needed"
    ]
  },
  anxiety: {
    answer: "Anxiety is a common mental health concern. While professional help is recommended, here are some general coping strategies:",
    tips: [
      "Practice deep breathing exercises",
      "Use grounding techniques",
      "Maintain a regular exercise routine",
      "Limit caffeine and alcohol",
      "Consider mindfulness meditation"
    ]
  },
  digestion: {
    answer: "Digestive health is crucial for overall well-being. Here are some general tips for better digestion:",
    tips: [
      "Eat slowly and chew thoroughly",
      "Stay hydrated throughout the day",
      "Include fiber-rich foods in your diet",
      "Regular physical activity",
      "Manage stress levels"
    ]
  },
  weight: {
    answer: "Healthy weight management involves sustainable lifestyle changes. Here are some general guidelines:",
    tips: [
      "Focus on balanced, nutritious meals",
      "Practice portion control",
      "Stay physically active",
      "Get adequate sleep",
      "Track your progress"
    ]
  },
  skin: {
    answer: "Good skin health involves both internal and external care. Here are some general skincare tips:",
    tips: [
      "Protect your skin from sun damage",
      "Stay hydrated",
      "Use gentle, suitable skincare products",
      "Get adequate sleep",
      "Eat a balanced diet rich in antioxidants"
    ]
  },
  joints: {
    answer: "Joint health is important for mobility and quality of life. Here are some tips for maintaining joint health:",
    tips: [
      "Maintain a healthy weight",
      "Stay active with low-impact exercises",
      "Include anti-inflammatory foods in your diet",
      "Practice good posture",
      "Avoid overexertion"
    ]
  }
};

export const findBestMatch = (query: string): HealthResponse => {
  // Convert query to lowercase for matching
  const lowercaseQuery = query.toLowerCase();
  
  // Check for keyword matches
  for (const [key, response] of Object.entries(healthResponses)) {
    if (lowercaseQuery.includes(key)) {
      return response;
    }
  }
  
  // Default response if no match is found
  return {
    answer: "I understand you have a health-related question. While I can provide general information, it's important to consult with a healthcare professional for personalized medical advice. Here are some general wellness tips:",
    tips: [
      "Maintain a balanced diet",
      "Get regular exercise",
      "Ensure adequate sleep",
      "Stay hydrated",
      "Manage stress through relaxation techniques"
    ]
  };
};