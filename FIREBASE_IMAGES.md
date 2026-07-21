# Firebase Image Usage in this App

## TL;DR

This app **does not upload images**. It's a static, exported Next.js site that only **reads** image URLs already stored as string fields on Firestore documents, and renders them with plain `<img>` tags. There is no Firebase Storage SDK usage (`getStorage`, `uploadBytes`, `getDownloadURL`, storage `ref()`), no file-input/upload UI, and no admin/dashboard/API route in this repo. Uploads (to Firebase Storage, presumably under the `school-management-cms` project) must happen in a separate CMS/admin app not present here — that app writes the resulting URL into a Firestore field, and this site just displays it.

---

## 1. Firebase setup

**`src/lib/firebase.js`** — initializes the app and Firestore only (no Storage SDK):

```js
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app)
export default app
```

`storageBucket` is present in the config but `getStorage(app)` is never called anywhere — no `storage` export exists.

**`src/lib/firestore.js`** — the data-access layer every page/component uses to fetch documents/collections (including the ones with image fields):

```js
'use client'
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore'
import { db } from './firebase'

export const getCollection = async (col, { orderByField = null, orderDir = 'desc' } = {}) => {
  const ref = collection(db, col)
  const q = orderByField ? query(ref, orderBy(orderByField, orderDir)) : ref
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getDocument = async (col, id) => {
  const snap = await getDoc(doc(db, col, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export const isVisible = (doc) => doc.active !== false
```

Environment variables (`.env.local`, client-side `NEXT_PUBLIC_*` keys):

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=school-management-cms.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=school-management-cms
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=school-management-cms.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=155354489943
NEXT_PUBLIC_FIREBASE_APP_ID=1:155354489943:web:4e759c0b853418d5c9af12
```

`firebase.json` only configures Hosting (static export from `out/`); no `storage` deploy target and no `storage.rules` file exist in this repo:

```json
{
  "hosting": {
    "public": "out",
    "cleanUrls": true,
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "site": "school-public",
    "rewrites": [
      { "source": "/news/**", "destination": "/news/placeholder.html" }
    ]
  }
}
```

`next.config.mjs` uses `output: 'export'` — a static export, which is why `next/image` (Next's remote image optimizer) is never used anywhere; every image is a plain `<img src="...">`.

---

## 2. Uploading images

**Not implemented in this repo.** No `<input type="file">`, `FormData`, `uploadBytes`/`uploadString`, or `admin`/`dashboard`/`api` routes exist anywhere under `src/`. Images must be uploaded elsewhere (e.g., the Firebase console, or a separate CMS/admin app tied to the `school-management-cms` Firebase project) and the resulting download URL is written directly into a Firestore document field.

---

## 3. Displaying images

Every image on the site is rendered by pulling a URL field off a Firestore document/collection item and dropping it straight into an `<img>` tag, typically with a local fallback image if the field is empty.

| Firestore source | Image field(s) | Consumed by |
|---|---|---|
| `news` (collection) | `imageUrl` | `src/app/news/page.js`, `src/app/news/[id]/NewsArticleClient.jsx`, `src/components/NewsEventsSection.jsx` |
| `gallery_albums` (collection) | `coverUrl` (falls back to first photo's `url`) | `src/app/gallery/page.js` |
| `gallery_photos` (collection) | `url` | `src/app/gallery/page.js`, `src/components/Gallery.jsx` |
| `videos` (collection) | `thumbnailUrl` | `src/app/gallery/page.js` |
| `banners` (collection) | `imageUrl` | `src/components/HeroSection.jsx` |
| `testimonials` (collection) | `photoUrl` | `src/components/TestimonialsSection.jsx` |
| `faculty` (collection) | `photoUrl` | `src/app/academics/page.js` |
| `academic_streams` (collection) | `imageUrl` | `src/components/AcademicsSection.jsx` |
| `infrastructure` (collection) | `imageUrl` | `src/app/about/page.js` |
| `school_info/about` (doc) | `imageUrl` | `src/app/about/page.js`, `src/components/AboutSection.jsx` |
| `school_info/chairman` (doc) | `imageUrl` | `src/app/about/page.js` |
| `school_info/principal` (doc) | `imageUrl` | `src/components/LeadershipMessage.jsx` |
| `site_settings/popup_notice` (doc) | `imageUrl` | `src/components/PopupNotice.jsx` |

### Examples

`src/app/news/page.js` (news list thumbnails, with local fallback images):

```js
const FALLBACK_IMAGES = ['/banner1.jpeg', '/banner2.jpeg', '/banner3.jpeg', '/science.jpeg', '/commerce.jpeg']
...
<img src={n.imageUrl || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]} alt=""
  className="w-full h-full object-cover img-treat" />
```

`src/app/news/[id]/NewsArticleClient.jsx` (single article page):

```js
getDocument('news', id).then(doc => setArticle(doc && isVisible(doc) ? doc : null))
...
{article.imageUrl && (
  <img src={article.imageUrl} alt=""
    className="w-full aspect-[16/9] object-cover img-treat border border-hairline p-2 bg-white mb-12" />
)}
```

`src/app/gallery/page.js` (albums, photos-in-album, video thumbnails):

```js
getCollection('gallery_albums', { ... }).then(data => setAlbums(...))
getCollection('gallery_photos', { ... }).then(setPhotos)
getCollection('videos', { ... }).then(data => setVideos(...))
const albumCover = (a) => a.coverUrl || albumPhotos(a.id)[0]?.url
...
<img src={p.url} alt={p.caption || activeAlbum.name} className="w-full h-full object-cover img-treat" />
...
{cover ? <img src={cover} alt={a.name} className="w-full h-full object-cover img-treat" /> : ...}
...
{v.thumbnailUrl ? (
  <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover opacity-80 ..." />
) : ...}
```

`src/components/Gallery.jsx` (homepage gallery preview):

```js
getCollection('gallery_photos', { orderByField: 'createdAt', orderDir: 'desc' })
  .then(data => setPhotos(data.slice(0, 8)))
...
<img src={p.url} alt={p.caption || 'Life at Agram'} className="w-full h-full object-cover img-treat" />
```

`src/components/HeroSection.jsx` (`banners` collection):

```js
getCollection('banners', { orderByField: 'order', orderDir: 'asc' }).then(data => {
  const visible = data.filter(isVisible)
  if (visible.length > 0) setBanner(visible[0])
})
const image = banner?.imageUrl || HERO_IMG
...
<img src={image} alt="Students at Agram Open School" className="absolute inset-0 w-full h-full object-cover img-treat" />
```

`src/components/TestimonialsSection.jsx`:

```js
{t.photoUrl ? (
  <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" />
) : ...}
```

`src/components/PopupNotice.jsx` (`site_settings/popup_notice` doc):

```js
{notice.imageUrl && (
  <img src={notice.imageUrl} alt="" className="w-full aspect-[16/9] object-cover" />
)}
```

`src/components/LeadershipMessage.jsx` (`school_info/principal` doc):

```js
<img src={msg?.imageUrl || IMG} alt="Principal, Agram Open School" ... />
```

`src/components/AboutSection.jsx` (`school_info/about` doc, forwarded to `ImageStack`):

```js
<ImageStack extraFirst={about?.imageUrl} />
```

`src/app/about/page.js` (`school_info/about`, `school_info/chairman`, `infrastructure` collection):

```js
<img src={about?.imageUrl || '/banner1.jpeg'} alt="Agram Open School campus" className="w-full aspect-[4/3] object-cover img-treat" />
...
<img src={chairman.imageUrl || '/banner3.jpeg'} alt={chairman.name || 'Chairman'} ... />
...
{f.imageUrl && (
  <img src={f.imageUrl} alt={f.name} className="w-full h-full object-cover img-treat" />
)}
```

`src/app/academics/page.js` (`faculty` collection):

```js
getCollection('faculty', { orderByField: 'createdAt', orderDir: 'desc' })
...
{f.photoUrl ? (
  <img src={f.photoUrl} alt={f.name} className="w-full h-full object-cover img-treat" />
) : ...}
```

---

## 4. Notes

- `src/lib/firestore.js` references an external `PUBLIC_WEBSITE_SCHEMA.md` describing the Firestore schema, but that file isn't in this repo — it likely lives in the separate admin/CMS project that owns the uploads.
- Because `next/image` isn't used, none of these images get Next's automatic optimization/resizing — they're served at whatever resolution they were uploaded at.
