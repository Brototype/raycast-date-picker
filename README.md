# Date Picker Raycast Extension

Native Raycast extension for copying dates in your chosen format.

It shows the current month and next month as compact calendar grids with ISO week numbers. Select a day and press `Enter` to copy the date with a confirmation HUD, or press `Command` + `Enter` to paste it at the cursor in the previously focused app.

Change the copied date format in Raycast Settings > Extensions > Date Picker. The built-in formats cover common numeric date styles, and the Custom option supports `yyyy`, `MM`, `M`, `dd`, and `d` tokens.

Raycast's native `Grid` API currently supports at most 8 columns per grid or section, so the two months are shown as stacked sections rather than a true side-by-side layout.

## Install from Source

You can install Date Picker locally without joining the Raycast organization. Make sure Raycast, Node.js, npm, and Git are installed, then run:

```bash
git clone https://github.com/Brototype/raycast-date-picker.git
cd raycast-date-picker
npm install
npm run build
```

This installs the dependencies and builds Date Picker as a local developer extension. After the build finishes, open Raycast, search for `Date Picker`, and assign a hotkey in Raycast Settings > Extensions.

If you downloaded the repository as a ZIP instead, extract it, open a terminal in the extracted `raycast-date-picker` folder, and run `npm install` followed by `npm run build`.

Re-run `npm run build` whenever you edit the extension source.

## Development

```bash
npm install
npm run dev
```

After `npm run dev`, Raycast will show the local `Date Picker` command. Assign it a hotkey in Raycast Settings > Extensions.

## Publishing for Maintainers

The manifest is configured for the private Heiners Org Store. To validate, build, and publish a new private version:

```bash
npm run publish
```

This publishes directly to the private organization Store; it does not submit the extension to Raycast's public Store.
