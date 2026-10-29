# One Thing

A personal tracker built as a single HTML file. One goal a day, three small
steps plus optional bonus tasks, habits, a parked list, dinner planning with a
shopping list, rewards tied to conditions the app can judge, and a place to think
a decision through and come back to it later. Hosted free on GitHub Pages, used
from the iPhone home screen, works offline.

Current version: 88. The version and build date show at the bottom of the app,
which is how you check whether an upload has reached your phone.

## Files

All at the top level of the repo. Do not put them in folders.

- `index.html` is the whole app. HTML, CSS and JavaScript in one file. No build step, no libraries, no server.
- `sw.js` is the offline cache. Network first for the app, cache first for fonts. Bump `CACHE` inside it whenever index.html changes.
- `icon.png` is the home screen icon, 180x180.
- `README.md` is this file.

## Getting around

Two tabs across the top, Today and Habits, then a three line menu holding
Dinners, Rewards and Decisions. Those three are used occasionally rather than
daily, so they sit behind the menu instead of competing for space. The lines
carry an amber dot when a reward is ready to claim or a decision is waiting, so
you can tell there is something there without opening it. The menu closes when
you pick something or tap anywhere else.

Later and App ideas are sub-pages rather than tabs. Later is reached from the
button under the steps, App ideas from a small link under the version number.

**Today** is the daily page: one goal, three small steps, up to seven bonus
tasks on top of those, a 1 to 5 day rating, a note, and a rest day toggle with
an optional reason. The week strip and the last 30 days strip both jump to any
day. The weekly goal and the Sunday review live here too. A row of small
progress rings sits under the week strip, one per live reward, filled by how
far along it is and amber once it is yours to claim. Tapping a ring opens that
reward. The row shows the five closest to done, with a sixth ring counting any
others, and disappears entirely when there are no rewards left to track. The
**Later** list is a sub-page reached from the button under the steps.

**Habits** holds the practices, each with its own cadence, streak, 30 day
consistency figure and history.

**Dinners** holds the dish library, the weekly meal plan, the day rules and the
shopping list.

**Rewards** holds prizes attached to conditions, with progress bars, a claim
button and a list of everything claimed. Progress also shows as rings on the
Today page.

**App ideas** is a list of changes to ask for in this app, reached by a small
underlined link under the version number so it stays out of the way. It works
like Later, quick to add and tick, without the scheduling, because an app idea
never needs to be given a day. Deliberately separate so it does not clutter the
real Later list.

**Decisions**, in the menu, walks one decision through seven screens (frame, criteria, options, reshape,
consequences, judge, resolve) and brings it back on two dates you set.
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
- `meta:habitsArchive` habits taken off the list, kept so they can come back
- `meta:dishes` the dish library
- `meta:dinnerRules` what each weekday wants
- `meta:dinnerCfg` cooldown weeks and the quality targets
- `meta:later` the parked list, each item carrying `c`, the day it was parked
- `meta:fixes` the App ideas list, changes to ask for in this app
- `meta:fixesDone` App ideas ticked off. The stored order is not the display order: the Later tab sorts a copy newest first so undo can still put an item back where it was
- `meta:laterDone` Later items ticked off without ever being given a day
- `meta:rewards` the rewards and their claim history
- `meta:decisions` decisions, their working out, and the look back on each one
- `meta:common` saved common tasks
- `meta:lastBackup` when you last backed up

The week record holds `goal`, `goalDone`, `score`, `wnote` a free write-up of the
week, then `worked`, `blocked`, `change` and `next` from the Sunday review.

A day record holds: `goal`, `goalDone`, `todos`, `rate` 0 to 5, `note`, `rest`,
`restWhy`, and `times`, which records when each item was ticked in local time
with the offset. `todos` starts at three items and grows to a maximum of ten.
Each item has `t` text, `d` done, `moved`, a date if it was moved elsewhere, and
`lc`, the day the text was first parked in the Later list, if it came from there.
The day record's `goalLc` is the same thing for the one thing.
The first three are the core steps; anything past those is a bonus task.

A habit holds: `name`, `cad`, optional `days` or `n`, `icon`, `min` for the
minimum version that still counts, and `pause` with `from` and `to`.

A decision holds: `q` the question, `cost` what being wrong costs and `box` the
time limit, `outs` the ranked criteria each with a `why`, `opts` the options each
with `up`, `down`, `p` a likelihood from 0 to 90, `shape` the reshaped version and
`keep` whether it carries into the later steps, `pre` the premortem, `t10` the
ten/ten/ten answers, `mit` how to cut the downside, `ooch` the smallest test, then
`dec` the decision, `act` the first action, `conf` how sure you were, `pass` and
`fail` the conditions, `trip` the early warning, `rev` the checkpoint date and
`rev2` the look back date, `started` and `made` as timestamps, `step` where you
were up to, `check` the checkpoint note, and `look` with `how` 1 to 5, a note and
the time. Up to 12 options, 5 of them carried. The list is capped at 80.

Records written before v83 used `undo` with values easily, with effort and not
really. `fixDec` maps those onto `cost` on load, so old decisions keep working.

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
ignored. Clearing a core step pulls the first bonus task up into the gap, so the
three core slots always fill before anything sits in the bonus row. A task that
came from the Later list carries its original parked date in
`lc`, so sending it to a day and later back to Later shows its true age instead of
resetting to today. Bonus tasks never count towards clearing a day, so leaving them
unticked cannot break a streak. A cleared day with at least one bonus task
ticked is a big day, shown in rose in the 30 day strip. The streak counts back
from today over cleared days; a rest day is skipped, so it neither breaks nor
extends the streak. The longest run ever and the one before it show under the
header, worked out by walking every day from the first record to today, using the
same rules, and cached because it reads every day you have. Rest days sit out of
the week stats. Ticking a future day
does nothing until that day arrives.

Moving a task to another day behaves differently depending on the day it leaves,
because the same action means two different things. Moving one off today or a
future day is re-planning: the slot empties, the remaining steps close the gap,
and that day can still clear on what is actually left. Moving one off a day that
has already passed is catching up on something missed, so it stays on that day
struck through with an arrow to where it went, and that day stays incomplete.
The practical effect is that a day you deliberately lightened still counts, and a
day you genuinely missed still reads as missed once you carry the work forward.

**Habits.** Removing one archives it rather than discarding it. Every tick lives
in the `hab:`, `habw:` and `habf:` records keyed by habit id, so the history was
never destroyed by a removal; what used to be lost was the definition, which left
that history orphaned and invisible. Keeping the definition in
`meta:habitsArchive` means putting a habit back restores the streak and the whole
record with it. The Archived section appears on the Habits tab only when
something is in it, and deleting from there drops the definition for good.

Five cadences: daily, certain weekdays, a number of times per week,
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
repeating reward can be claimed again next week. The Today rings show only
rewards still in play: anything claimed for the current period, and any pinned
period that has ended, drops off that row and stays on the Rewards page. Working
out a reward's value means walking day records, so the whole set is worked out
once and held until the next save.

**Decisions.** Seven screens, one question each, and nothing except the decision
sentence is required. The order is deliberate: each step is meant to be blind to
the next, so options get written before anything judges them. Reshape sits before
the judging because when options are things you are inventing rather than choosing
between, the first draft is never the best version and scoring a draft you would
have changed is wasted work.

The gate at the front asks what being wrong costs, not whether it can be undone.
Those are different: plenty of decisions are easy to reverse and still cost months
before you find out you should have. Answer "a day or less" and the app says to
just decide and offers to skip to the end.

Long lists get a narrowing pass. Up to twelve options, five carried forward, the
rest parked so they stay on the list without cluttering the four screens after.
The Judge screen rates each option against whatever you ranked first, by name, and
offers a way back to the options when nothing clears the bar, because that usually
means the list is wrong rather than your nerve.

Resolve captures what counts as it working and what would make you stop, which are
the conditions that matter most and the hardest to write honestly six weeks later.
Two dates: a checkpoint for an early look, and a look back for when you will
actually know. Either one falling due raises a banner on Today, the same way the
week review and backup banners do. The look back shows your confidence next to how
it actually went, which is the only way the guessing gets better.

Saving is a deliberate tap, not automatic, because it timestamps the decision and
the point of writing down what you thought is that it stays what you thought. The
first action can be handed to tomorrow as the one thing, or parked in the Later
list.

## Backup and restore

- **Backup** writes a `.json` holding everything. That is the file that can be restored.
- Everything means every storage key above except `meta:lastBackup`, which is left out on purpose: restoring a stale "you last backed up on" date would be misleading. Verified by backing up all twenty stores through the app's own button, wiping storage, restoring from the file, and comparing key by key.
- Two filters decide what is worth writing out. A day is skipped when `empty()` says nothing is in it, and a week when `wkUsed()` says the same. A weekly goal ticked with no text written used to fall through that second filter; fixed in v87 by having `wkUsed` check `goalDone` as well.
- **Export** writes a `.txt` for reading only, including a decisions section. It cannot be restored.
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
- Typing in the Decisions screens saves on a debounce without redrawing, so the record captured when the screen was drawn goes stale. Any button that reads a field at click time must fetch the record again with `decById`, or it will test what was on screen a moment ago rather than what was typed. This shipped broken in v82: typing the decision and immediately tapping Save was rejected.
- `scrollHeight` counts a box's own padding but not its border. `shrink` used to compare it against a measurement of the border alone, so every single-line box was marked as clipped by the height of its own padding. Nothing showed for it until clipped boxes were given a marker in v85, at which point every step sprouted one.
- Setting a text box's height to `auto` collapses it for an instant, and on a long note the page scrolls to fill the gap and back again, which reads as the box jumping while you type. `grow` only collapses when the text has got shorter, and puts the scroll position back when it does.
- A text box inside a hidden tab reports no layout, so `scrollHeight` is 0 and a height worked out from it would be `0px`: text present but invisible. `grow` and `shrink` therefore measure only a box that is really on screen, and otherwise flag it on `_refit`. `refit()` sizes those flagged boxes, and runs when a tab is shown and when the app returns to the foreground. Removing either call brings back blank-looking rows after a task is added to a day from another tab.

## Before changing the code

- The storage keys above are load bearing. Renaming one loses that history.
- Keep the app a single self contained file, with no libraries and no build step.
- When editing by find and replace, check that the search text actually matched before writing. A silently failed edit has shipped before and was caught in use rather than in testing.
- Several CSS selectors and short statements appear more than once in the file. Anchor an edit on surrounding text that is unique, or count the matches deliberately.
- Test logic by running it, not by reading it. Streaks, the dinner generator, reward conditions, restore merging and the date maths all have edge cases that only show up when you feed them real data.
- Bump `VERSION` in `index.html` and `CACHE` in `sw.js` together, or the phone will quietly keep serving the old file.
