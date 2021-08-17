espn_schedules_fresh
- This service will clear out the schedule table and then add all the games for the current season (if available)

espn_schedules_update
- This service simply overwrites any games for a specified league, season, and weeks (or everything for the current season)
- Key difference is that the table cannot be dropped
- Eventually I want to add a function that will sit on top and generate the week numbers and call this service for specific leagues. I would like this service to update the scores for the past 2 weeks of the current season as well as the future schedules for the next 4 weeks.