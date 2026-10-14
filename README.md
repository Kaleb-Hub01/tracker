# One Thing

A personal tracker built as a single HTML file. One goal a day, three small
steps, habits, a parked list, and dinner planning with a shopping list. Hosted
free on GitHub Pages, used from the iPhone home screen, works offline.

Current version: 69. The version and build date show at the bottom of the app,
which is how you check whether an upload has reached your phone.

## Files

All at the top level of the repo. Do not put them in folders.

- `index.html` is the whole app. HTML, CSS and JavaScript in one file. No build step, no libraries, no server.
- `sw.js` is the offline cache. Network first for the app, cache first for fonts. Bump `CACHE` inside it whenever index.html changes.
- `icon.png` is the home screen icon, 180x180.
- `README.md` is this file.

## The three tabs

**Today** is the daily page: one goal, up to three steps, a 1 to 5 day rating, a
note, and a rest day toggle with an optional reason. The week strip and the last
30 days strip both jump to any day. The weekly goal and the Sunday review live
here too. The **Later** list is a sub-page reached from the button under the
steps.

**Habits** holds the practices, each with its own cadence, streak, 30 day
consistency figure and history.

**Dinners** holds the dish library, the weekly meal plan, the day rules and the
shopping list.

## Where the data lives

In the browser's localStorage, tied to the site address. Not in any file, not on
any server. Keys:

- `day:YYYY-MM-DD` one record per day
- `week:YYYY-Www` the weekly goal and the review for that ISO week
- `hab:YYYY-MM-DD` daily habit ticks, notes and tick times
- `habw:YYYY-Www` weekly habit ticks
- `habf:<n>` fortnightly habit ticks, n counted from a fixed Monday in 1970
- `dinner:YYYY-MM-DD` the dish planned for that day, plus locked, skip and cooked
- `shop:YYYY-Www` the shopping list for that week
- `meta:habits` the habit definitions
- `meta:dishes` the dish library
- `meta:dinnerRules` what each weekday wants
- `meta:dinnerCfg` cooldown weeks and the quality targets
- `meta:later` the parked list
- `meta:common` saved common tasks
- `meta:lastBackup` when you last backed up

A day record holds: `goal`, `goalDone`, `todos` (three items, each `t` text, `d`
done, `moved` a date if it was moved elsewhere), `rate` 0 to 5, `note`, `rest`,
`restWhy`, and `times`, which records when each item was ticked in local time
with the offset.

A habit holds: `name`, `cad`, optional `days` or `n`, `icon`, `min` for the
minimum version that still counts, and `pause` with `from` and `to`.

Consequences worth remembering:

- Changing the site address means starting empty. The data does not follow.
- Clearing Safari website data wipes it. Uploading a new index.html does not.
- One browser, one device. Safari and Chrome on the same phone are separate.
- Renaming any key above loses that history. They are load bearing.

## Rules the app follows

**Days.** A day counts as cleared when the goal is written and ticked, and every
step that has text is also ticked. Blank slots are ignored. The streak counts
back from today over cleared days; a rest day is skipped, so it neither breaks
nor extends the streak. Rest days sit out of the week stats. Ticking a future
day does nothing until that day arrives. Moving a task to another day leaves it
on the original day struck through and counted as incomplete.

**Habits.** Five cadences: daily, certain weekdays, a number of times per week,
weekly, fortnightly. A habit can have a minimum that still counts, ticked with
the "min" chip and recorded separately from a full tick. Paused days are skipped
entirely: no streak break, no streak gain, and left out of the consistency
figure. Every tick is logged, so repeated goes at the same habit in one day show
as "settled at 00:10, after 3 goes".

**Dinners.** The generator fills unlocked, unskipped days, avoiding repeats
within the cooldown and never repeating inside one week. Quality targets steer
it: "at most" is a hard limit, "at least" a strong preference. It reports when it
has had to bend the rules. Skip applies to one date; lock plus skip makes it
every week. Rough guide for how many dishes you need: dinners per week times
cooldown weeks, plus some slack.

## Backup and restore

- **Backup** writes a `.json` holding everything. That is the file that can be restored.
- **Export** writes a `.txt` for reading only. It cannot be restored.
- **Restore** offers "add missing only", which is safe, or "replace everything", which wipes the device first and asks twice.
- Backups are named by date so they never overwrite each other. Keep them in iCloud Drive, not just Downloads.
- The banner nags after seven days. The footer shows how long since the last one.

## Updating the app

1. Back up first.
2. Upload the new `index.html` and commit.
3. Bump `CACHE` in `sw.js` and upload that too, so old cached copies clear.
4. Wait two or three minutes for GitHub Pages to build.
5. Fully close the app on the phone and reopen. Check the version at the bottom.

If the app shows an old version with good signal, the cache is stale. Bumping the
version in `sw.js` is the fix. It never touches saved data.

## Known iOS quirks

- Safari blanks text inputs when the app returns to the foreground. The app refills them on `pageshow`, `visibilitychange` and `focus`. Do not remove those listeners.
- Home screen web apps may keep storage separate from Safari tabs. Pick one and stay with it.
- Native date inputs were unreliable to tap, so every date picker is a month calendar built in the app. Do not reintroduce `input type="date"`.
- Text inputs must be 16px or larger or iOS zooms when you tap them.
- The Google Fonts stylesheet is loaded non-blocking and cached by `sw.js`. Both are needed for the app to open offline.

## If you are an AI assistant reading this

The owner is not a developer. Explain in plain English, avoid jargon, and assume
no tooling beyond a browser and the GitHub web interface. Keep the app a single
self contained file.

Before changing anything: the storage keys above are load bearing, renaming one
loses that history. When editing by find and replace, assert that the search text
actually matched; a silently failed edit has shipped before and was found by the
owner rather than by testing. Test logic (streaks, generators, date maths) by
running it before publishing, not by reading it.
