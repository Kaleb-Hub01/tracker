# One Thing

A personal tracker built as a single HTML file. One goal a day, three small
steps plus optional bonus tasks, habits, a parked list, dinner planning with a
shopping list, and rewards tied to conditions the app can judge. Hosted free on
GitHub Pages, used from the iPhone home screen, works offline.

Current version: 81. The version and build date show at the bottom of the app,
which is how you check whether an upload has reached your phone.

## Files

All at the top level of the repo. Do not put them in folders.

- `index.html` is the whole app. HTML, CSS and JavaScript in one file. No build step, no libraries, no server.
- `sw.js` is the offline cache. Network first for the app, cache first for fonts. Bump `CACHE` inside it whenever index.html changes.
- `icon.png` is the home screen icon, 180x180.
- `README.md` is this file.

## The four tabs

**Today** is the daily page: one goal, three small steps, up to seven bonus
tasks on top of those, a 1 to 5 day rating, a note, and a rest day toggle with
an optional reason. The week strip and the last 30 days strip both jump to any
day. The weekly goal and the Sunday review live here too. The **Later** list is
a sub-page reached from the button under the steps.

**Habits** holds the practices, each with its own cadence, streak, 30 day
consistency figure and history.

**Dinners** holds the dish library, the weekly meal plan, the day rules and the
shopping list.

**Rewards** holds prizes attached to conditions, with progress bars, a claim
button and a list of everything claimed.

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
- `meta:later` the parked list, each item carrying `c`, the day it was parked. The stored order is not the display order: the Later tab sorts a copy newest first so undo can still put an item back where it was
- `meta:laterDone` Later items ticked off without ever being given a day
- `meta:rewards` the rewards and their claim history
- `meta:common` saved common tasks
- `meta:lastBackup` when you last backed up

A day record holds: `goal`, `goalDone`, `todos`, `rate` 0 to 5, `note`, `rest`,
`restWhy`, and `times`, which records when each item was ticked in local time
with the offset. `todos` starts at three items and grows to a maximum of ten.
Each item has `t` text, `d` done, `moved`, a date if it was moved elsewhere, and
`lc`, the day the text was first parked in the Later list, if it came from there.
The day record's `goalLc` is the same thing for the one thing.
The first three are the core steps; anything past those is a bonus task.

A habit holds: `name`, `cad`, optional `days` or `n`, `icon`, `min` for the
minimum version that still counts, and `pause` with `from` and `to`.

A reward holds: `name` the prize, `scope` week or month or once, `metric` which
condition, `target` the number to reach, `habitId` when the condition is one
named habit, `pin` a date inside the locked period for a one-off, and `claims`
keyed by period.

Consequences worth remembering:

- Changing the site address means starting empty. The data does not follow.
- Clearing Safari website data wipes it. Uploading a new index.html does not.
- One browser, one device. Safari and Chrome on the same phone are separate.
- Renaming any key above loses that history. They are load bearing.

## Rules the app follows

**Days.** A day counts as cleared when the goal is written and ticked, and every
one of the three core steps that has text is also ticked. Blank slots are
ignored. A task that came from the Later list carries its original parked date in
`lc`, so sending it to a day and later back to Later shows its true age instead of
resetting to today. Bonus tasks never count towards clearing a day, so leaving them
unticked cannot break a streak. A cleared day with at least one bonus task
ticked is a big day, shown in rose in the 30 day strip. The streak counts back
from today over cleared days; a rest day is skipped, so it neither breaks nor
extends the streak. Rest days sit out of the week stats. Ticking a future day
does nothing until that day arrives. Moving a task to another day leaves it on
the original day struck through and counted as incomplete.

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

**Rewards.** Each reward is a prize plus one condition the app can already judge
from existing data: days cleared, big days, every habit at a percentage, one
named habit a number of times, average day rating, dinners cooked, weekly goal
hits, or the all time milestones for streak, big days and cleared days. A weekly
or monthly reward either repeats every period or is pinned to one week or month
by storing a date inside it, so the target cannot slide forward. A pinned period
that ends unmet reads "Missed" and stays until deleted. Earning a reward never
claims it; claiming is a deliberate tap and is recorded per period, so a
repeating reward can be claimed again next week.

## Backup and restore

- **Backup** writes a `.json` holding everything. That is the file that can be restored.
- **Export** writes a `.txt` for reading only. It cannot be restored.
- **Restore** offers "add missing only", which is safe, or "replace everything", which wipes the device first and asks twice.
- Before restoring, the dialog states the backup's save date and time and counts of days, weeks, Later items, habits and dishes, so a wrong file announces itself.
- "Add missing only" merges item by item, not record by record. A single task deleted from a day comes back without disturbing the rest of that day.
- A restored task brings its tick time and its `lc` parked date with it. A bonus task may land in a different slot than it held in the backup, so its tick time is re-keyed to the new slot.
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
- An expanded text box keeps the scroll position the cursor left it at, so collapsing one resets `scrollTop` twice, once immediately and once on the next frame.
- A text box inside a hidden tab reports no layout, so `scrollHeight` is 0 and a height worked out from it would be `0px`: text present but invisible. `grow` and `shrink` therefore measure only a box that is really on screen, and otherwise flag it on `_refit`. `refit()` sizes those flagged boxes, and runs when a tab is shown and when the app returns to the foreground. Removing either call brings back blank-looking rows after a task is added to a day from another tab.

## Before changing the code

- The storage keys above are load bearing. Renaming one loses that history.
- Keep the app a single self contained file, with no libraries and no build step.
- When editing by find and replace, check that the search text actually matched before writing. A silently failed edit has shipped before and was caught in use rather than in testing.
- Several CSS selectors and short statements appear more than once in the file. Anchor an edit on surrounding text that is unique, or count the matches deliberately.
- Test logic by running it, not by reading it. Streaks, the dinner generator, reward conditions, restore merging and the date maths all have edge cases that only show up when you feed them real data.
- Bump `VERSION` in `index.html` and `CACHE` in `sw.js` together, or the phone will quietly keep serving the old file.
