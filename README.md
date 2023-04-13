# UTC Bar

A simple Electron app that displays the current UTC time, rounded to the nearest minute, and rounded to 
the nearest hour in the system tray. Users can copy the time values to the clipboard via the context menu.

## Installation

1. Clone this repository:

```bash
git clone https://github.com/frdeboffles/utc-bar.git
cd utc-bar
``` 

1. Install the dependencies:

```bash
npm install
```

1. Run the app:

```bash
npm start
```

## Packaging

To package the app for distribution, run the following command:

```bash
npm run dist
```

This command will generate distributable packages for macOS in the dist directory.

## License

MIT License. See the LICENSE file for details.
