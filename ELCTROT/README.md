# தமிழ் எலக்ட்ரானிக்ஸ் சாதன சேவை முகவர்

இந்த project ஒரு static Tamil web client. Build step தேவையில்லை.

## அம்சங்கள்

- தமிழ் landing page மற்றும் சேவை பட்டியல்
- வாடிக்கையாளர் தகவல், சாதனம், சேவை இடம், அவசர நிலை, பயனர் தேவைகள் பதிவு
- Browser local storage-ல் சேவை request சேமிப்பு
- உறுப்பினர் login, கடைசி login நேரம், active/offline கண்காணிப்பு
- சமீபத்திய கோரிக்கைகள் dashboard

## திறப்பது

`index.html` file-ஐ browser-ல் திறந்தால் இயங்கும்.

Local server வேண்டுமெனில்:

```powershell
python -m http.server 5173
```

பிறகு:

```text
http://localhost:5173
```

## மாற்ற வேண்டிய இடங்கள்

- Phone number: `index.html`-ல் `+919876543210`
- Email: `service@example.com`
- Business name: `தமிழ் எலக்ட்ரானிக்ஸ்`
