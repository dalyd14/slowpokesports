const moment = require('moment')

const { pool } = require('../../model/LeagueSchedules')
const { League, Schedule } = require('../../model')

const poolController = {
    async getAllSchedulesFromLeagues ({ params, body, user }, res) {
        try {
            const foundLeague = await League.findById(params._id)

            if (!foundLeague.users.includes(user._id)) {
                throw { error_message: 'This user is not a member of this league.' }
            }

            let searchParams = {
                league: params._id
            }

            if (body) {
                searchParams = {
                    ...searchParams,
                    ...body
                }
            }
            const foundSchedules = await pool.find(searchParams)
            res.json(foundSchedules)
        } catch (e) {
            res.status(400).json({ message: "An error occurred while finding the schedules for the league.", ...e })
        }

    },

    async ownerUpdateEvents ({ params, body, user }, res) {
        // Expected body.events
        // body.events = [
        //     {
        //         event: event ID,
        //         play: whether this game will be played for this league,
        //         is_tiebreaker: whether this game will be the tie breaker for the week,
        //         odds: {
        //           line: +/- spread,
        //           favorite: home team or away
        //         }
        //     }
        // ]
        
        try {
            const foundLeague = await League.findById(params._id).populate('settings')

            if (!foundLeague.users.includes(user._id)) {
                throw { error_message: 'This user is not a member of this league.' }
            } else if (foundLeague.owner != user._id) {
                throw { error_message: 'This user is not the owner of this league.' }
            }

            let searchParams = {}
            if (body.week && body.year) {
                searchParams = {
                    league: params._id,
                    week: body.week,
                    year: body.year
                }
            } else {
                throw { error_message: 'A year and week was not included for this update request.' }
            }

            const foundSchedule = await pool.findOne(searchParams)
            const okEvents = await checkPickSchedule(foundSchedule.events, body.events, foundLeague.settings)

            if (!okEvents.ok) {
                throw okEvents.error_message
            }

            Promise.all(okEvents.results.map(async pick => {
                const foundPick = await pool.findOne(
                    {
                        ...searchParams,
                        events: { $elemMatch: { event: pick.event } }
                    }
                )
                if (foundPick) {
                    return await pool.findOneAndUpdate(
                        searchParams,
                        {
                            "events.$[a].play": pick.play,
                            "events.$[a].is_tiebreaker": pick.is_tiebreaker,
                            "events.$[a].odds": pick.odds
                        },
                        {
                            new: true, upsert: true,
                            arrayFilters: [{ "a.event": pick.event }]
                        }
                    )
                } else {
                    return await pool.findOneAndUpdate(
                        searchParams,
                        {
                            $push: {
                                "events": {
                                    "event": pick.event,
                                    "play": pick.play,
                                    "is_tiebreaker": pick.is_tiebreaker,
                                    "odds": pick.odds
                                }
                            }
                        },
                        {
                            new: true, upsert: true
                        }
                    )
                }
                
            }))
            .then(updatedSchedule => res.json(updatedSchedule[updatedSchedule.length - 1]))
            .catch(e => res.status(400).json({ message: "An error occurred while updating the schedules for the league.", ...e }))
        } catch (e) {
            res.status(400).json({ message: "An error occurred while updating the schedules for the league.", ...e })
        }
    },

    async playerUpdateEvents ({ params, body, user }, res) {

        // Expected body.events
        // body.events = [
        //     {
        //         event: event ID,
        //         picked: whether or not this event was picked by this user,
        //         picked_home: whether the user picked the home team,
        //         confidence_points: { confidencePointsPresent: true, value: 2 }
        //              how many confidence points did this event receive,
        //         tiebreaker: (optional) the tiebreaker that this user chose
        //     }
        // ]

        try {
            const foundLeague = await League.findById(params._id).populate('settings')

            if (!foundLeague.users.includes(user._id)) {
                throw { error_message: 'This user is not a member of this league.' }
            }

            let searchParams = {}
            if (body.week && body.year) {
                searchParams = {
                    league: params._id,
                    week: body.week,
                    year: body.year
                }
            } else {
                throw { error_message: 'A year and week was not included for this update request.' }
            }

            const targetSchedule = await pool.findOne(searchParams)
                .select('_id finished closed closed_at events')
                .populate({
                    path: 'events',
                    populate: {
                        path: 'event'
                    }
                })

            if (targetSchedule.closed || targetSchedule.finished) {
                throw { error_message: 'These picks cannot be submitted because the pool is closed.' }
            }

            const okPicks = checkPicks(body.events, targetSchedule.events, foundLeague.settings)

            if (!okPicks.ok) {
                throw { error_message: okPicks.error_message }
            }
            
            const submitPicks = transformPicks(body.events, targetSchedule.events, user)

            if (!submitPicks.ok) {
                throw submitPicks.error_message
            }

            Promise.all(submitPicks.results.map( async pick => {
                const { event, confidencePoints, ...updateObj } = pick
                await pool.findOneAndUpdate(
                    searchParams,
                    {
                        $pull: {
                            "events.$[a].picks": {
                                player_id: updateObj.player_id 
                            }
                        }
                    },
                    {
                        "arrayFilters": [
                            { "a._id": event }
                        ]
                    }
                )
                return await pool.findOneAndUpdate(
                    searchParams,
                    {
                        $push: { 
                            "events.$[a].picks": {
                                confidence_points: confidencePoints,
                                ...updateObj
                            }
                        }
                    },
                    { 
                        "arrayFilters": [
                            { "a._id": event }
                        ],
                        "new": true 
                    }
                )
            }))
            .then(updatedSchedule => res.json(updatedSchedule[updatedSchedule.length - 1]))
            .catch(e => res.status(400).json({ message: "An error occurred while updating the schedules for the league.", ...e }))
        } catch (e) {
            res.status(400).json({ message: "An error occurred while updating the schedules for the league.", ...e })
        }
    }
}

const mergeSchedules = (oldSchedule, newSchedule) => {
    let okObj = {
        ok: false
    }
    try {
        // this mapping will update the old schedule
        let mergedSchedule = oldSchedule.map(oev => {
            const isNew = newSchedule.find(nev => nev.event == oev.event)
            if (isNew) {
                if (isNew.play) {
                    return isNew
                }
            } else {
                if (oev.play) {
                    return oev
                }
            }
        })

        // now push any new schedules to array
        newSchedule.forEach(nev => {
            const isOld = mergedSchedule.find(mev => mev.event == nev.event)
            if (!isOld) {
                if (nev.play) {
                    mergedSchedule.push(nev)
                }
            }
        })

        return mergedSchedule
        
    } catch (e) {
        okObj = {
            ok: false,
            error_message: e
        }
        return okObj        
    }   
}

const checkPickSchedule = async (oldSchedule, newSchedule, settings) => {
    let okObj = {
        ok: false
    }
    try {
        const mergedSchedules = mergeSchedules(oldSchedule, newSchedule)
        
        const scheduledEvents = await Schedule.find(
            { _id: { $in: mergedSchedules.map(mev => mev.event) } }
        )

        const checkRes = mergedSchedules.reduce((accumalator, currentValue) => {
            const game = scheduledEvents.find(sev => `${sev._id}` === `${currentValue.event}`)
            switch (game.league_type) {
                case 'nfl':
                    accumalator.nfl += 1
                    break
                case 'ncaa_fbs':
                    accumalator.ncaa_fbs += 1
                    break
            }
            return accumalator
        }, { nfl: 0, ncaa_fbs: 0})

        if (settings.ncaafbIncluded) {
            if (checkRes.ncaa_fbs > settings.ncaafbWeekGameLimit) {
                okObj = {
                    ok: false,
                    error_message: `You have selected more NCAA FBS games than your plan allows. Limit: ${settings.ncaafbWeekGameLimit}`
                }
                return okObj      
            }
        } else {
            if (checkRes.ncaa_fbs > 0) {
                okObj = {
                    ok: false,
                    error_message: "Your plan does not allow any NCAA FBS games, please upgrade your plan or unselect the games."
                }
                return okObj
            }
        }

        okObj = {
            ok: true,
            results: mergedSchedules
        }
        return okObj
    } catch (e) {
        okObj = {
            ok: false,
            error_message: e
        }
        return okObj        
    }
}

const checkPicks = (submittedEvents, scheduledEvents, settings) => {
    let okObj = {
        ok: true
    }
    // Checking if the same number of picks were submitted that the league has open
    if (submittedEvents.length !== scheduledEvents.length) {
        return okObj = { ok: false, error_message: "Please submit all of the picks!" }
    }
    // Checking if the confidence points were submitted correctly
    const confRes = submittedEvents.reduce((accumalator, currentValue) => {
        switch (currentValue.confidence_points.value) {
            case settings.confidencePoints.high.points:
                accumalator.high += 1
                break
            case settings.confidencePoints.low.points:
                accumalator.low += 1
                break
        }
        return accumalator
    }, { high: 0, low: 0 })

    if (confRes.high !== settings.confidencePoints.high.quantity && confRes.low !== settings.confidencePoints.low.quantity) {
        return okObj = { ok: false, error_message: "The confidence point totals do not match." }
    }
    // Check if a tiebreaker was chosen for the tiebreaker game
    const tieRes = scheduledEvents.filter(e => e.is_tiebreaker)
    if (tieRes.length > 1 || tieRes.length === 0) {
        return okObj = { ok: false, error_message: `There must be exactly one tiebreaker game each week. This league has ${tieRes.length}.` }
    }
    const submitTie = submittedEvents.filter(e => e.tiebreaker || e.tiebreaker === 0)
    if (submitTie.length != 1) {
        return okObj = { ok: false, error_message: "Please submit the single tiebreaker for the week." }
    }
    if (submitTie[0].event !== tieRes[0].event.espn_game_id) {
        return okObj = { ok: false, error_message: "The tiebreaker was submnitted for the wrong game." }
    }
    return okObj
}

const transformPicks = (submittedEvents, scheduledEvents, user) => {
    // submitted format
    //   event: espn event ID,
    //   picked: whether or not this event was picked by this user,
    //   picked_home: whether the user picked the home team,
    //   confidence_points: { confidencePointsPresent: true, value: 2 }
    //       how many confidence points did this event receive,
    //   tiebreaker: (optional) the tiebreaker that this user chose
    
    
    // required transformed format
    // event: event ID (mongo id)
    // player_id: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    // picked: { type: Boolean, required: true },
    // picked_home: { type: Boolean, required: true },
    // correct: { type: Boolean, required: true },
    // confidence_points: { type: Number, required: true, default: 0 },
    // tiebreaker: { type: Number, required: true }

    let results = []
    let okObj = {
        ok: true
    }

    scheduledEvents.forEach(e => {
        if (e.play) {
            const gametime = moment(e.event.start_time)
            if (gametime.isAfter(moment())) {
                const submitEvent = submittedEvents.find(se => se.event === e.event.espn_game_id)
                if (!submitEvent || !submitEvent.picked) {
                    okObj = { ok: false, error_message: `User did not submit a pick for ${e.event.display_name}` }
                    return okObj
                }
                const pushedEvent = {
                    event: e._id,
                    player_id: user._id,
                    picked: true,
                    picked_home: submitEvent.picked_home,
                    correct: false,
                    confidencePoints: 
                        submitEvent.confidence_points.confidencePointsPresent ?
                        submitEvent.confidence_points.value : 0
                }
                if (submitEvent.tiebreaker && typeof submitEvent.tiebreaker == 'number') {
                    pushedEvent.tiebreaker = submitEvent.tiebreaker
                }
                
                results.push(pushedEvent)
            }   
        }
    })
    okObj = {
        ok: true,
        results
    }
    return okObj
}

module.exports = poolController