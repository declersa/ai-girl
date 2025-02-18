const questions = [
  {
    id: 1,
    text: "Quel est votre budget mensuel pour accéder à une plateforme d'avatar IA ?",
    options: [
      { id: "free", text: "Gratuit", icon: "coins" },
      { id: "low", text: "Moins de 10 €", icon: "coins" },
      { id: "medium", text: "Entre 10 € et 30 €", icon: "coins" },
      { id: "high", text: "Plus de 30 €", icon: "coins" }
    ],
    image: "https://ai-girlfriend.skillsative.com/images/ai-girlfriend1.png"
  },
  {
    id: 2,
    text: "Quelles activités aimeriez-vous partager avec votre avatar IA ?",
    options: [
      { id: "deep", text: "Discussions profondes et philosophiques", icon: "brain" },
      { id: "games", text: "Jeux et divertissements", icon: "gamepad" },
      { id: "learn", text: "Apprentissage de nouvelles compétences", icon: "book" },
      { id: "time", text: "Discussion chaude", icon: "heart" }
    ],
    image: "https://ai-girlfriend.skillsative.com/images/ai-girlfriend3.png"
  },
  {
    id: 3,
    text: "Quelle apparence visuelle préférez-vous pour votre avatar ?",
    options: [
      { id: "realistic", text: "Réaliste", icon: "user" },
      { id: "anime", text: "Style anime/manga", icon: "user" },
      { id: "cartoon", text: "Dessin animé", icon: "user" },
      { id: "other", text: "Autre", icon: "user" }
    ],
    image: "https://ai-girlfriend.skillsative.com/images/ai-girlfriend4.png"
  },
  {
    id: 4,
    text: "Quelle est votre fréquence d'interaction prévue avec l'avatar ?",
    options: [
      { id: "daily", text: "Quotidienne", icon: "heart" },
      { id: "weekly", text: "Hebdomadaire", icon: "calendar" },
      { id: "occasional", text: "Occasionnelle", icon: "clock" }
    ],
    image: "https://ai-girlfriend.skillsative.com/images/ai-girlfriend5.png"
  }
];

module.exports = questions;