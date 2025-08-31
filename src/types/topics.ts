export enum Topics {
  SPORT = "Sport",
  EDUCATION = "Education",
  ENTERTAINMENT = "Entertainment",
  BUSINESS = "Business",
  FOOD = "Food & Drink",
  TECHNOLOGY = "Technology",
  TRAVEL = "Travel",
  HEALTH = "Health"
}

export interface Topic {
  id: string;
  title: Topics;
  description: string;
  icon: string;
  colorSchema?: string;
}
