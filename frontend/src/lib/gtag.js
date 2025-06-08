// lib/gtag.js
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Page view tracking for App Router
export const pageview = (url) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

// Event tracking
export const event = ({ action, category, label, value }) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Fitness-specific tracking functions
export const trackWorkoutCompleted = (workoutType, duration) => {
  event({
    action: "workout_completed",
    category: "fitness",
    label: workoutType,
    value: duration,
  });
};

export const trackGoalSet = (goalType) => {
  event({
    action: "goal_set",
    category: "engagement",
    label: goalType,
  });
};

export const trackNutritionLogged = (mealType) => {
  event({
    action: "nutrition_logged",
    category: "fitness",
    label: mealType,
  });
};

export const trackUserRegistration = () => {
  event({
    action: "sign_up",
    category: "engagement",
  });
};

export const trackLogin = () => {
  event({
    action: "login",
    category: "engagement",
  });
};

export const trackPageView = (pageName) => {
  event({
    action: "page_view",
    category: "navigation",
    label: pageName,
  });
};

export const trackAdminAccess = (page) => {
  event({
    action: "admin_access",
    category: "admin",
    label: page,
  });
};
