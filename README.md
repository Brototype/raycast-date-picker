# Date Picker Raycast Extension

Native Raycast extension for copying dates in your chosen format.

It shows the current month and next month as compact calendar grids with ISO week numbers. Select a day and press `Enter` to copy the date with a confirmation HUD, or press `Command` + `Enter` to paste it at the cursor in the previously focused app.

Change the copied date format in Raycast Settings > Extensions > Date Picker. The built-in formats cover common numeric date styles, and the Custom option supports `yyyy`, `MM`, `M`, `dd`, and `d` tokens.

Raycast's native `Grid` API currently supports at most 8 columns per grid or section, so the two months are shown as stacked sections rather than a true side-by-side layout.

## Install

From this repository:

```bash
npm install
npm run build
```

This installs dependencies and runs `ray build`, which writes the compiled extension into Raycast's local extension directory. After that, open Raycast, search for `Date Picker`, and assign a hotkey in Raycast Settings > Extensions.

Re-run `npm run build` whenever you edit the extension source.

## Development

```bash
npm install
npm run dev
```

After `npm run dev`, Raycast will show the local `Date Picker` command. Assign it a hotkey in Raycast Settings > Extensions.

## Publishing

When the extension is ready for the Raycast Store:

```bash
npm run publish
```

Raycast will validate the extension and open a pull request against the official Raycast extensions repository.
