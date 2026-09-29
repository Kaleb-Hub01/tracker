# One Thing

A single page daily tracker. One goal a day, up to three small steps, a
star rating, a note, and a weekly review. Built as one HTML file, hosted
free on GitHub Pages, used from the iPhone home screen.

## Files

* `index.html` is the whole app. All the HTML, CSS and JavaScript in one file. No build step, no libraries, no server.
* `sw.js` is the offline cache. Network first, so the newest version always wins when there is signal. The cached copy is only used when offline.
* `icon.png` is the home screen icon, 180x180. Referenced from the head of index.html.
* `README.md` is this file.

All four sit at the top level of the repo. Do not put them in folders.

## Where the data lives

In the browser's localStorage, tied to the site address. It is not in any
file and not on any server. Keys look like:

* `day:YYYY-MM-DD` one record per day
* `week:YYYY-Www` one record per ISO week, holds the weekly goal and the review
* `meta:lastBackup` timestamp of the last successful backup
* `meta:routines` saved step sets

A day record holds: `goal`, `goalDone`, `todos` (three items, each `t` text
and `d` done), `rate` 0 to 5, `note`, `rest`, and `times`, which records
when each item was ticked in local time with the offset.

Consequences worth remembering:

* Changing the site address means starting empty. The data does not follow.
* Clearing Safari website data wipes it. Uploading a new index.html does not.
* One browser, one device. Safari and Chrome on the same phone are separate.

## Rules the app follows

* A day counts as cleared when the goal is written and ticked, and every step that has text is also ticked. Blank step slots are ignored, so one real step beats three invented ones.
* The streak counts backwards from today over cleared days. A rest day is skipped: it does not break the streak and does not extend it.
* Rest days sit out of the week stats, so days cleared shows out of the number of non rest days.
* Ticking a future day does nothing until that day arrives. This is deliberate.
* The weekly review appears on any Sunday and on any past week. The "next week's goal" field becomes the weekly goal when the new week starts.

## Backup and restore

* Backup writes a `.json` holding everything. That is the file that can be restored.
* Export writes a `.txt` for reading only. It cannot be restored.
* Restore offers "add missing only", which is safe, or "replace everything", which wipes the device first and asks twice.
* Backups are named by date, so they never overwrite each other. Keep them in iCloud Drive, not just Downloads.

## Updating the app

1. Back up first.
2. Upload the new `index.html` to the repo and commit.
3. If `index.html` changed, bump `CACHE` in `sw.js` (for example `onething-v1` to `onething-v2`) and upload that too, so old cached copies get cleared.
4. Wait two or three minutes for GitHub Pages to build.
5. Fully close the app on the phone and reopen.

If the app shows an old version with good signal, the cache is stale.
Bumping the version in `sw.js` is the fix. It never touches the saved data.

## Known iOS quirks

* Safari sometimes blanks text inputs when the app returns to the foreground. The app refills them on `pageshow`, `visibilitychange` and `focus` to prevent this. Do not remove those listeners.
* Home screen web apps may keep storage separate from Safari tabs. Pick one and stay with it.
* Date inputs and share sheets are styled by iOS and will not always match the rest of the design.
* Before changes, note that the storage key names above are load bearing: renaming them loses the user's history.

