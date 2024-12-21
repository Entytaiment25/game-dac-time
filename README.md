# GameDac Time

A project to display the time on the SteelSeries GameDac with configurable options.

```powershell
npm run start
```

## How It Works

The application uses the SteelSeries SDK to register the clock app in the SteelSeries GG Engine via API requests. It then updates the clock on the display accordingly.

## Known Issues

- The `showSeconds` configuration option must be set to `true` for the application to work properly. Without this setting, the application may not function as expected.
- Compatibility issues may arise with certain versions of the SteelSeries Engine software. Ensure you are using the latest version.

If you encounter any other issues, please report them on the project's GitHub Issues page.

## Disclaimer

This application has only been tested on the SteelSeries GameDac Gen 2. Compatibility with other versions is not guaranteed.
