# Firebase Setup Guide

Per far funzionare l'autenticazione con Google e il salvataggio delle recensioni, devi configurare Firebase.

## 1. Creare un Progetto Firebase

1. Vai a [Firebase Console](https://console.firebase.google.com)
2. Clicca "Crea un progetto"
3. Nome progetto: `qrcode-emi` (o quello che preferisci)
4. Disabilita Google Analytics
5. Clicca "Crea progetto"

## 2. Aggiungere un'App Web

1. Nel progetto, clicca il pulsante **</>** per aggiungere un'app web
2. Nome app: `qrcode-reviews`
3. Clicca "Registra app"
4. Copia la configurazione che appare

## 3. Configurare le Variabili di Ambiente

1. Apri il file `.env.local` nel progetto
2. Sostituisci i valori con quelli copiati da Firebase:

```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

## 4. Abilitare Google Sign-In

1. Nel Firebase Console, vai a **Autenticazione** (a sinistra)
2. Clicca sulla scheda "Sign-in method"
3. Clicca su "Google"
4. Attiva il toggle e aggiungi un'email di supporto
5. Salva

## 5. Creare Firestore Database

1. Nel Firebase Console, vai a **Firestore Database**
2. Clicca "Crea database"
3. Scegli la modalità **Test** (per iniziare, puoi poi cambiare in Production)
4. Scegli la location più vicina
5. Clicca "Crea"

## 6. Configurare Regole Firestore

1. Nel Firestore, vai alla scheda **Regole**
2. Sostituisci il contenuto con:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reviews/{document=**} {
      allow read: if true;
      allow create: if request.auth.uid != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Clicca "Pubblica"

## 7. Deploy su Vercel

Quando deployi su Vercel:

1. Aggiungi le variabili di ambiente nel Dashboard Vercel:
   - Vai a **Impostazioni > Variabili di Ambiente**
   - Aggiungi tutte le variabili `NEXT_PUBLIC_FIREBASE_*`

2. Fai il deploy:
```bash
git add -A
git commit -m "Add Firebase configuration"
vercel deploy --prod
```

## Test Locale

```bash
npm run dev
```

Apri http://localhost:3000/review e testa:
1. Clicca "Accedi con Google"
2. Lascia una recensione
3. Verifica che appaia in Firestore e sulla pagina

## Soluzione Problemi

- **Errore CORS**: Assicurati di aver abilitato il progetto come app web nel Firebase Console
- **Errore Auth**: Verifica che le variabili di ambiente siano correttamente configurate
- **Firestore 404**: Crea un documento manuale in Firestore per verificare la connessione

Contatta il supporto Firebase se hai problemi: https://firebase.google.com/support
