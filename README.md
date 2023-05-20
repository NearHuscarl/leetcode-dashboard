# Leetcode Dashboard

## Development

- Download and install Anki
- Install [anki-connect](https://ankiweb.net/shared/info/2055492159) add-on.
- In Anki, go to `Tools` > `Add-ons` > Select `AnkiConnect` > `Config`. Update the config to allow CORS.

```json
{
  "webCorsOriginList": [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://leetcode-dashboard.vercel.app"
  ]
}
```

- Do not close Anki to maintain the connection with AnkiConnect.
- Clone this repo.
- Install depedencies and run the dev server

```bash
yarn
yarn dev
```

<!--
--UI

https://dribbble.com/shots/20325736-Sales-Components


--Features

Factor:
- Number of problems
- Number of reviews
- Difficulty (Easy, Medium, Hard)
- Pattern (DP, BFS, DFS, etc.)
- Due status (due, near due, not due)
- Card type (new, learning, review, young, mature)
- Ease rate (total score of Again, Hard, Good, Easy)
- Retention rate

All Charts
- Highlight nodes today, this week, this month

LC solved over time
+ Line chart
+ Filter
  + Date: week, month, quarter, year, all
+ Summary: Total solved (increase this week), Total reviews (increase this week)
+ X: time
+ Y: number of LC solved
+ Tooltip
- Lines:
  + Difficulty (Easy, Medium, Hard)
  - Pattern (DP, BFS, DFS, etc.)
  * Estimated deadlines https://nivo.rocks/storybook/?path=/story/line--highlighting-negative-values

Card type over time
- Bar
- X: time
- Y: Number of card type in stack (new, learning, review)

Card type now
- Funnel
- Color: Percentage of card type (new, learning, review)

Revision History
+ Calendar
+ Each cell represents a day
+ Color shade: number of LC solved
+ 2 charts: new problems and reviews
+ Tooltip: number of LC solved
+ Streak days stats
  - Tooltip to explain total number
- Add due date as red square in the future

Upcoming Due Table
- Click to see full table
- Display upcoming leetcode problems

Heatmap
+ Show correlation between number of reviews and review hours
+ Add title
+ Add date filter
- Add tooltip

LC Problem Difficulty
- ScatterPlot
- Dot color: LC pattern
- X: Interval
- Y: Number of reviews

Current retention rate: In circle percentage
- Easy: percentage
- Medium: percentage
- Hard: percentage
- Overall: percentage

Current pattern covered
- Sunburst chart
- Each angle represents a pattern
- Each ring represents a difficulty
- Each block represents a LC problem
- Color: card type (new, learning, review)

 -->
