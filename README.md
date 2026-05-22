# Offshore Rotation Planner (My_Offshore_Calendar)

**My_Offshore_Calendar** helps offshore workers track their ON/OFF rotation cycles, calculate monthly earnings, Myanmar tax, and manage travel days. (Offshore ON/OFF rotation ကိုစိတ်ကြိုက်ချိန်ညှင်းနိုင်သည့် Calendar, အလုပ်ဟောင်းကြေး၊ ခရီးစရိတ်၊ မြန်မာနိုင်ငံအခွန်တွက်ချက်မှု စသည့်ဖြင့် ပုံမှန်သုံးရန် Offshore worker များအတွက် calendar application တစ်ခုပါ။)

## Features & Overview
- **Custom Rotation Calendar**: Flexible ON/OFF cycle setup with user-defined anchor day. (ON/OFF rotation ကိုအစိတ်အပိုင်းဖြစ်အောင် ရွေးချယ်နိုင်သည့် စနစ်ပါဝင်သည်။)
- **Myanmar & Thailand Holidays**: Built-in holiday awareness for Myanmar and Thailand, including lunar holidays for Myanmar. (မြန်မာနှင့် ထိုင်းနိုင်ငံအား ပေါင်းထည့်ပေးထားသော ရုံးပိတ်ရက်များ ပါဝင်သည်။)
- **Earnings & Tax Calculation**: Track normal, travel rates, allowances, and Myanmar income tax based on latest brackets. (အလုပ်ရက်၊ ခရီးရက်၊ allowance နှင့် မြန်မာနိုင်ငံအခွန်တွက်ချက်မှုပြုလုပ်နိုင်သည်။)
- **PWA / Offline-first**: Application is installable and works offline, suitable for offshore conditions. (Offline-first PWA ဖြစ်လို့ လိုင်းမရှိပဲ သုံးနိုင်သည်။)

## Directory Structure
```
My_Offshore_Calendar/
│
├── src/
│   ├── Calendar.jsx        # Main calendar UI & rotation logic (rotation schedule, display holidays) | စိစစ်သည့် calendar code
│   ├── Dashboard.jsx       # Dashboard for summary & earnings | အလုပ်ရက်အပါအဝင် ဝင်ငွေ summary
│   ├── Settings.jsx        # User settings (rates, anchor day, currency) | အသုံးပြုသူချိန်ညှင်းမှုများ
│   ├── rotationUtils.js    # Core logic (rotation calculation, Myanmar tax, stats) | မူလ function များ၊ အလုပ်ရက်တွက်ခြင်း၊ စာရင်းပေါင်းခြင်း
│   ├── holidays.js         # Holiday and festival data/functions | Myanmar/Thailand ရုံးပိတ်/ပွဲတော်ရက်တွေ
│   └── ...                 # Other React components and utility files
│
├── public/                 # Static assets (icons, manifest)
├── sw.js                   # Custom service worker for offline
├── manifest.json           # PWA manifest file
├── package.json            # Project dependencies and scripts
├── vite.config.js          # Vite + PWA plugin config
└── index.html              # Main entry HTML
```

## Quick Start
1. **Install dependencies**
    ```powershell
    npm install
    ```
2. **Run development server**
    ```powershell
    npm run dev
    ```
3. **Production build**
    ```powershell
    npm run build
    ```

## Main Functional Flow (လုပ်ဆောင်ချက်အဓိပ္ပါယ်)
- User sets anchor date & pattern in Settings (ON/OFF period). (အသုံးပြုသူအနေနဲ့ anchor date နှင့် pattern ကိုနှစ်သက်ရာရွေးနိုင်သည်။)
- Calendar displays rotation periods and holidays. (ON/OFF အလုပ်ရက်၊ ခရီးရက်၊ ရုံးပိတ်ရက်တွေပြသည်။)
- Dashboard summarizes work/travel days and calculates earnings/tax. (Summary က ဝင်ငွေ၊ ခရီးစရိတ်၊ အခွန်အပါအဝင်ပြသသည်။)
- Data is stored in browser local storage (offline works, PWA enabled). (LocalStorage ကိုအသုံးပြု၍ offline အလုပ်လုပ်နိုင်သည်။)

## Technologies Used
- React, Zustand, Vite, TailwindCSS, date-fns
- Vite PWA plugin, Custom Service Worker

## License
_Add a LICENSE file to specify usage rights_

---

For more details or to contribute, see source files with both English and Myanmar mixed code comments. (Code တွင် မြန်မာလို/English လို မှတ်ချက်တွေလည်းပါဝင်သည်။)
