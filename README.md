# One Thing

A personal tracker built as a single HTML file. One goal a day, three small
steps plus optional bonus tasks, habits, a parked list, dinner planning with a
shopping list, rewards tied to conditions the app can judge, and a place to think
a decision through and come back to it later. Hosted free on GitHub Pages, used
from the iPhone home screen, works offline.

Current version: 102. The version and build date show at the bottom of the More
page, which is how you check whether an upload has reached your phone.

## Files

All at the top level of the repo. Do not put them in folders.

- `index.html` is the whole app. HTML, CSS and JavaScript in one file. No build step, no libraries, no server.
- `sw.js` is the offline cache. Network first for the app, cache first for fonts. Bump `CACHE` inside it whenever index.html changes.
- `icon.png` is the home screen icon, 180x180.
- `README.md` is this file.

## Getting around

A bar along the bottom with four tabs: Today, Habits, Goals and More. More is a
page with search at the top, then the Later list, Dinners, Rewards, Decisions
and App ideas, with Backup, Restore and Export underneath and the version at the
bottom. Search looks through every day's one thing, three core steps and note,
and every week's goal and review, newest first, showing up to 25 results.
Tapping a result opens that day on Today. The
bar hides only while the keyboard is actually on screen, measured from the
visible viewport, because iOS keeps a text box focused after the keyboard closes
and hiding on focus left the bar gone for good (fixed in v101).

A pink dot on Goals means a goal is late; on More it means a reward is ready to
claim or a decision is waiting. The week review and backup reminders show as
small pills at the top of Today only, and the quote sits at the bottom of Today.

Colours keep one meaning each: teal is done, purple is steps, part done and the
selected day, orange is this week (the weekly goal, the dinner plan), and pink-red
is something that needs you, is late, or deletes. Day bars are coloured by how
the day went: teal cleared, purple part done, grey stripes for a rest day.

**Today** is the daily page: one goal, three small steps, up to seven bonus
tasks on top of those, a 1 to 10 day rating, a note, and a rest day toggle with
an optional reason, sitting on the same row as the day's status line. The week strip and the last 30 days strip both jump to any
day. Steps and bonus tasks reorder by dragging their number, each within its own
list. The weekly goal and the Sunday review live here too. A row of small
progress rings sits under the weekly goal, one per live reward, filled by how
far along it is and teal once it is yours to claim. Tapping a ring opens that
reward. The row shows the five closest to done, with a sixth ring counting any
others, and disappears entirely when there are no rewards left to track. A
"From your Later list" row always shows the top three parked items for one tap
adds, with "See all" opening the full list. A quick add goes into the first free
step, or a bonus task when the steps are full. The full **Later** list is a
sub-page reached from the More page.

The Common tasks row is hidden by a single CSS rule since v102. Its saved list
in `meta:common` is kept and still backed up, so removing the rule brings it back
as it was.

**Habits** holds the practices, each with its own cadence, streak, 30 day
consistency figure and history. They are listed by how often they are due
(every day first, then by times a week, then weekly, then fortnightly), with
paused habits last. Habits due equally often keep the order you drag them into,
on every day. Dragging one out of its group holds for that day only. Opening a
habit shows one sheet: tap the icon or name to change them, then plain questions
for how often, the smallest version that counts, and a break. A new habit asks
its name and how often on one screen.

Ratings, for the day and the week, are out of 10 as a row of numbered buttons.
They were out of 5 up to v96; on first opening v97 every old rating is doubled
once, along with any day-rating reward target, so history still compares.

**Dinners** holds the dish library, the weekly meal plan, the day rules and the
shopping list.

**Rewards** holds prizes attached to conditions, with progress bars, a claim
button and a list of everything claimed. Progress also shows as rings on the
Today page. A reward is set up one question at a time (the prize, what earns it,
how often, how many), and changing one goes through the same questions.

**App ideas** is a list of changes to ask for in this app, reached from the More
page. It works
like Later, quick to add and tick, without the scheduling, because an app idea
never needs to be given a day. Deliberately separate so it does not clutter the
real Later list. "Share all ideas" sends the open list as a numbered `.txt`
file through the share sheet, or as plain text where files cannot be shared,
or copies it.

Items in Later for over a month raise a banner. "Keep them" leaves each item's
parked date alone and records the keep date in `k`, so the banner returns a
month after keeping and the list order does not change.

**Goals**, its own tab, holds a few goals, each a number to move by a date, a
list of milestones, or both. Any milestone can be put on a day with its date
button, which adds it to that day as a step (or a bonus task when the three are
full). A goal is set up one question at a time and nothing is saved until the
last step. Up or down is worked out from the starting number and the target, and
the bar starts at the starting number. A number goal has an Update button on its
card for logging where you are now.

**Decisions**, on the More page, walks one decision through seven screens (frame, criteria, options, reshape,
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
- `meta:goals` goals and their milestones
- `meta:common` saved common tasks
- `meta:lastBackup` when you last backed up
- `meta:rateScale` set to 10 once old 5-point ratings have been doubled
- `meta:habDayOrder` a habit order dragged out of its frequency group, for one day only

The week record holds `goal`, `goalDone`, `score`, `wnote` a free write-up of the
week, then `worked`, `blocked`, `change` and `next` from the Sunday review.

A day record holds: `goal`, `goalDone`, `todos`, `rate` 0 to 10, `note`, `rest`,
`restWhy`, and `times`, which records when each item was ticked in local time
with the offset. `todos` starts at three items and grows to a maximum of ten.
Each item has `t` text, `d` done, `moved`, a date if it was moved elsewhere, and
`lc`, the day the text was first parked in the Later list, if it came from there,
and `gm`, `goalId:milestoneId` when the task was put there from a goal milestone.
Every task is built through one function, `copyTodo`, so a field added later
cannot be dropped by restore or by closing gaps.
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
the time. Up to 12 options, 5 of them carried. The list has no cap.

Records written before v83 used `undo` with values easily, with effort and not
really. `fixDec` maps those onto `cost` on load, so old decisions keep working.

A goal holds: `name`, `why`, `fmt` (plain, aud, hrs or pct), `dir` up or down,
`start`, `now` and `target`, `due` and `set` dates, `done` and `doneAt`, and `ms`
the milestones. Each milestone has `id`, `t`, `d` done, and `day`, the date it is
on, or blank. Milestones from before v96 are given an id on first load and it is
saved straight away, so it never changes after that.

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

**Dinners.** The generator fills unlocked, unskipped days from today on, and
never changes a past day or one marked cooked. From Sunday the page opens on the
coming week. It avoids repeats
within the cooldown and never repeating inside one week. Quality targets steer
it: "at most" is a hard limit, "at least" a strong preference. It reports when it
has had to bend the rules. Skip asks whether it is just this date or every week
on that weekday. A skipped date keeps its dish hidden, so cooking that day again
brings it back, and lock keeps the cooked mark. Rough guide for how many dishes you need: dinners per week times
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

**Goals.** A milestone put on a day and the task it becomes are linked, so
ticking either one ticks the other. Moving the task to another day carries the
link and the milestone's date follows it; deleting the task from the day menu, or
making it the one thing, clears the date. Taking a milestone off a day from the
Goals page removes its task and can be undone. One gap is accepted: clearing a
linked task's text by hand leaves the milestone showing its date until it is
tapped and taken off, because checking every milestone against its day on every
draw would mean loading a day record per milestone.

**Deleting.** Nothing is removed on a single tap. Every delete, remove or clear
asks first with a red button and Cancel, and everything that can be put back
offers Undo for a few seconds after: tasks and the one thing, goals and
milestones, Later items, dishes, the example dishes, shopping items and both
clear buttons, rewards, decisions and common tasks. Undo puts each thing back at
its old place and skips anything already back, so it never doubles up. The one
exception is deleting an archived habit for good, which asks twice and is final
by design. Replacing a day's one thing sends the old one to Later. Clearing a
Later item's text puts the old text back rather than deleting it. Lists have no
size caps, so nothing old drops off the end.

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
- Everything means every storage key above except three left out on purpose: `meta:lastBackup`, because restoring a stale "you last backed up on" date would be misleading; `meta:habDayOrder`, because it only ever applies to one day; and `meta:rateScale`, because the backup carries its own `rateScale`. A backup without `rateScale: 10` was made before v97 with ratings out of 5, and restore doubles its ratings on the way in. Verified in v96 by backing up a store using every key through the app's own button, wiping storage, restoring from the downloaded file in both modes, and comparing the whole store key by key: identical, including milestone links, `lc` dates and tick times on day records.
- Two filters decide what is worth writing out. A day is skipped when `empty()` says nothing is in it, and a week when `wkUsed()` says the same. A weekly goal ticked with no text written used to fall through that second filter; fixed in v87 by having `wkUsed` check `goalDone` as well.
- **Export** writes a `.txt` for reading only, including a decisions section. It cannot be restored.
- **Restore** offers "Put back anything missing", which is safe, or "Replace everything", which wipes the device first and asks twice. Replace keeps a copy of what was there in memory and offers Undo straight after.
- On a new phone the app saves its starter habits the first time Habits is opened. "Put back anything missing" treats a habit list that is still exactly those starters as empty and takes the backup's list instead; before v96 it kept the starters and lost edits to any habit sharing an id with one.
- Before restoring, the dialog states the backup's save date and time and counts of days, weeks, Later items, habits and dishes, so a wrong file announces itself.
- "Put back anything missing" merges item by item, not record by record. A single task deleted from a day comes back without disturbing the rest of that day.
- A restored task brings its tick time, its `lc` parked date and its `gm` milestone link with it.
- The message after restoring counts the days put back, and only says a day had no free step slot when a task from the backup really did not fit. A bonus task may land in a different slot than it held in the backup, so its tick time is re-keyed to the new slot.
- Backups are named by date so they never overwrite each other. Keep them in iCloud Drive, not just Downloads.
- The reminder shows after seven days. The More page shows how long since the last one.

## Updating the app

1. Back up first.
2. Upload the new `index.html` and commit.
3. Bump `CACHE` in `sw.js` and upload that too, so old cached copies clear.
4. Wait two or three minutes for GitHub Pages to build.
5. Fully close the app on the phone and reopen. Check the version at the bottom of More.

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
