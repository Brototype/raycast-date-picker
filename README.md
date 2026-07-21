# Date Picker Raycast Extension

Native Raycast extension for copying dates in your chosen format.

Date Picker was originally built for distribution through my private Raycast organization, Heiners Org. The source is public so anyone can install it locally or adapt a fork for their own private organization.

It shows the current month and next month as compact calendar grids with ISO week numbers. Select a day and press `Enter` to copy the date with a confirmation HUD, or press `Command` + `Enter` to paste it at the cursor in the previously focused app.

Change the copied date format in Raycast Settings > Extensions > Date Picker. The built-in formats cover common numeric date styles, and the Custom option supports `yyyy`, `MM`, `M`, `dd`, and `d` tokens.

Raycast's native `Grid` API currently supports at most 8 columns per grid or section, so the two months are shown as stacked sections rather than a true side-by-side layout.

## Install Locally from Source

To install Date Picker as a local developer extension, make sure Raycast, Node.js, npm, and Git are installed, then run:

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

## Publishing to a Private Organization

The checked-in `package.json` retains the original private Store settings:

```json
{
  "author": "Brototype",
  "owner": "heiners-org",
  "access": "private"
}
```

If you only want to install the extension locally, you do not need to change these values.

To publish a fork to your own private Raycast organization:

1. Change `author` in `package.json` to your Raycast username.
2. Change `owner` to your Raycast organization handle, which may differ from the organization's display name. In Raycast, open **Manage Organization**, select the organization, and use **Copy Organization Handle** (`Command` + `Shift` + `.`).
3. Keep `access` set to `private`.
4. Log in to the Raycast CLI and publish:

```bash
npx ray login
npm run publish
```

You must be a member of the target organization. Raycast validates and builds the extension before publishing it to that organization's private Store, where only organization members can install it.

For this repository, maintainers can publish a new private Heiners Org version with:

```bash
npm run publish
```

This does not submit the extension to Raycast's public Store. See Raycast's [private extension publishing guide](https://developers.raycast.com/teams/publish-a-private-extension) for more details.
