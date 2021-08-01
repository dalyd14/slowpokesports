function Settings(options) {
    this.leagueSizeLimit = options.leagueSizeLimit;
    this.ncaafbIncluded = options.ncaafbIncluded;
    this.ncaafbWeekGameLimit = options.ncaafbWeekGameLimit;
    this.planTier = options.planTier;
    this.weekStart = options.weekStart;
    this.weekEnd = options.weekEnd;
    this.confidencePoints = options.confidencePoints;
    this.tiebreaker = options.tiebreaker;
    
    this.getSettings = function() {
        return this
    }
}

module.exports = Settings