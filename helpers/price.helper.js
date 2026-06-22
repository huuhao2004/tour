const price_range = {
  "under-2m": { min: 0, max: 2000000 },
  "2m-4m": { min: 2000000, max: 4000000 },
  "4m-8m": { min: 4000000, max: 8000000 },
  "over-8m": { min: 8000000, max: Number.MAX_SAFE_INTEGER },
};

module.exports = price_range;