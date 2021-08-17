const pool = (options) => {

    let leagueSizeLimit = { 
        value: options.leagueSizeLimit,
        type: "number"
    };
    let ncaafbIncluded = {
        value: options.ncaafbIncluded,
        type: "boolean"
    };
    let ncaafbWeekGameLimit = {
        value: options.ncaafbWeekGameLimit,
        type: "number"
    };
    let planTier = {
        value: options.planTier,
        type: [
            {
                value: "bench_plan",
                display: "Bench Plan"
            },
            {
                value: "pro_plan",
                display: "Professional Plan"
            },
            {
                value: "hof_plan",
                display: "Hall of Fame Plan"
            }
        ]
    };
    let weekStart = {
        value: options.weekStart,
        type: "weekday"
    };
    let weekEnd = {
        value: options.weekEnd,
        type: "weekday"
    };
    let confidencePoints = {
        value: {
            high: {
                points: {
                    value: options.confidencePoints.high.points,
                    type: "number"
                },
                quantity: {
                    value: options.confidencePoints.high.quantity,
                    type: "number"
                }
            },
            low: {
                points: {
                    value: options.confidencePoints.low.points,
                    type: "number"
                },
                quantity: {
                    value: options.confidencePoints.low.quantity,
                    type: "number"
                }
            }
        },
        type: "object"
    };
    return {
        getSettings: function() {
            return {
                leagueSizeLimit: leagueSizeLimit.value,
                ncaafbIncluded: ncaafbIncluded.value,
                ncaafbWeekGameLimit: ncaafbWeekGameLimit.value,
                planTier: planTier.value,
                weekStart: weekStart.value,
                weekEnd: weekEnd.value,
                confidencePoints: {
                    high: {
                        points: confidencePoints.value.high.points.value,
                        quantity: confidencePoints.value.high.quantity.value
                    },
                    low: {
                        points: confidencePoints.value.low.points.value,
                        quantity: confidencePoints.value.low.quantity.value
                    }
                }
            }
        },
        getFields: function() {
            return {
                leagueSizeLimit,
                ncaafbIncluded,
                ncaafbWeekGameLimit,
                planTier,
                weekStart,
                weekEnd,
                confidencePoints
            }
        },
        confirmTiers: function(gameConfig) {
            const gameConfigTier = gameConfig[planTier.value]
            if (gameConfigTier.player_size_limit !== leagueSizeLimit.value) {
                return { ok: false, message: "The league size limit does not match" }
            }
            if (gameConfigTier.ncaafb !== ncaafbIncluded.value) {
                return { ok: false, message: "The ncaafb included does not match" }
            }
            if (gameConfigTier.ncaafb_week_limit !== ncaafbWeekGameLimit.value) {
                return { ok: false, message: "The ncaafb week game limit does not match" }
            }
            return { ok: true, message: "The settings  match the plane tier"}
        }
    }
}

module.exports = { 
    pool 
}