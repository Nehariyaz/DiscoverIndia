const express = require('express');
const router = express.Router();
const destinations = require('../data/destination');

router.post('/', (req, res) => {
  let {
    travelType,
    budget,
    preferredSeason,
    interestedActivities = [],
    state,
    activity
  } = req.body;

  travelType = travelType?.toLowerCase();
  preferredSeason = preferredSeason?.toLowerCase();
  interestedActivities = interestedActivities.map(act => act.toLowerCase());
  state = state?.toLowerCase();
  activity = activity?.toLowerCase();

  console.log('\n📩 Filter input:', {
    travelType, budget, preferredSeason, interestedActivities, state, activity
  });

  const filtered = destinations
    .map(dest => {
      const destinationActivities = dest.activities.map(a => a.toLowerCase());

      const matchesType = !travelType || dest.travelTypes.map(t => t.toLowerCase()).includes(travelType);
      const matchesBudget = !budget || (budget >= dest.budgetRange[0] && budget <= dest.budgetRange[1]);
      const matchesSeason = !preferredSeason || dest.seasons.map(s => s.toLowerCase()).includes(preferredSeason);
      const matchesState = !state || dest.state.toLowerCase() === state;
      const matchesActivity = !activity ||
      destinationActivities.includes(activity) ||
      dest.travelTypes.map(t => t.toLowerCase()).includes(activity);


      const activityMatches = interestedActivities.filter(act =>
        destinationActivities.includes(act)
      ).length;

      const matchesActivitiesList = interestedActivities.length === 0 || activityMatches > 0;


      return {
        ...dest,
        matches: matchesType && matchesBudget && matchesActivitiesList && matchesSeason && matchesState && matchesActivity,
        activityScore: activityMatches
      };
    })
    .filter(dest => dest.matches)
    .sort((a, b) => b.activityScore - a.activityScore);

  console.log('\n Filtered destinations:', filtered.map(d => d.name));
  res.json(filtered);
});


router.get('/experience/:experience', (req, res) => {
  const experience = req.params.experience.toLowerCase();
  const stateFilter = req.query.state?.toLowerCase();

  const filtered = destinations.filter(dest =>
    (!stateFilter || dest.state.toLowerCase() === stateFilter) &&
    dest.travelTypes.map(t => t.toLowerCase()).includes(experience)
  );

  console.log(' Filtered:', filtered.map(d => `${d.name} (${d.state})`));

  if (filtered.length === 0) {
    return res.json({ message: `No ${experience} places found in ${stateFilter}` });
  }

  res.json(filtered);
});



module.exports = router;
