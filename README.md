# EQ App Project

A mobile-sized, interactive headphone app for changing headphone EQ settings and integrating music-provider services. Library access is still in progress.

## Design

[View the Figma design](https://www.figma.com/design/Og6CTdEFSSMGZHIbwyUQqR/PROD151-Design-File?node-id=0-1&p=f&t=th1UHc9zECFjPvCd-0)

## Run locally

I have made local run scripts depending on what OS you are on for convenience.

Linux or macOS:

```sh
./start.sh
```

Windows:

```bat
start.bat
```

Then open [http://localhost:8000](http://localhost:8000) in a browser.
If you already have something running on port 8000 then change the config file to a currently open port e.g 8001

This web app was developed under the assumption it would be used as a mobile layout and thus is not flexible and doesnt scale for desktop sites and has a fixed width. For a more optimal experience please change the view to mobile in the browser dev settings.
Also, if you have a browser with forced dark mode then the colours will not be the same.

The launchers use Python 3. No project packages, build step, account, or external service are required.

## Files

- `index.html` — page structure
- `styles.css` — responsive layout, styling, and animations
- `script.js` — navigation, switches, player controls, equalizer presets, and saved settings
- `start.sh` / `start.bat` — local server launchers
- `PROJECT_OVERVIEW.txt` — project summary and learning reflection

The `assets` folder contains the local font and artwork (Icons etc).
