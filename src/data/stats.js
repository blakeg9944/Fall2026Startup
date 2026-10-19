// Turns a list of reviews into the numbers shown on the Browse and Restaurant pages.

// A review's rating is the average of its two confidence answers (1 to 5)
export function reviewRating(review) {
  return (review.celiac + review.sensitive) / 2;
}

// Matches the .rating-badge color classes in app.css
export function badgeClass(rating) {
  if (rating >= 4) return 'safe';
  if (rating >= 3) return 'caution';
  return 'risk';
}

// 4.25 -> "4.3 / 5", 5 -> "5 / 5"
export function formatRating(rating) {
  return `${Number(rating.toFixed(1))} / 5`;
}

export function averageRating(reviews) {
  if (reviews.length === 0) return null;
  return average(reviews.map(reviewRating));
}

export function summarize(reviews) {
  return {
    count: reviews.length,
    rating: averageRating(reviews),
    fryer: practice(reviews.map((review) => review.fryer)),
    grill: practice(reviews.map((review) => review.grill)),
    prep: practice(reviews.map((review) => review.prep)),
    menu: practice(reviews.map((review) => review.menu)),
    staff: practice(reviews.map((review) => (review.staff ? 'yes' : 'no'))),
    celiac: confidence(reviews.map((review) => review.celiac)),
    sensitive: confidence(reviews.map((review) => review.sensitive)),
  };
}

// Combines everyone's yes/no/unsure answers to one kitchen question.
// "unsure" answers are left out, since they don't say anything about the kitchen.
// level matches the .practice-* classes in restaurant.css.
function practice(answers) {
  const yes = answers.filter((answer) => answer === 'yes').length;
  const no = answers.filter((answer) => answer === 'no').length;
  const total = yes + no;

  if (total === 0) return { level: 'unknown', label: 'Unknown', agree: 0, total: 0 };

  const yesShare = yes / total;
  if (yesShare >= 0.75) return { level: 'yes', label: 'Yes', agree: yes, total };
  if (yesShare >= 0.5) return { level: 'partial', label: 'Usually', agree: yes, total };
  return { level: 'no', label: 'No', agree: no, total };
}

// level matches the .confidence.* classes in restaurant.css
function confidence(scores) {
  if (scores.length === 0) return { level: 'unknown', label: 'Unknown' };

  const score = average(scores);
  if (score >= 4) return { level: 'high', label: 'High' };
  if (score >= 3) return { level: 'medium', label: 'Medium' };
  return { level: 'low', label: 'Low' };
}

function average(numbers) {
  return numbers.reduce((sum, number) => sum + number, 0) / numbers.length;
}
