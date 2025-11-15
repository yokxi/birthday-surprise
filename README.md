# Birthday Surprise!

A simple, interactive birthday website. This guide explains how to add your personal content.

**[Click Here to See the Live Surprise!](https://yokxi.github.io/birthday-surprise/)**

## 🛠️ How to Customize

Follow these steps to personalize your gift.

### 1. 🎵 Add Your Music

* **Folder:** `/audio/`
* **Action:**
    1.  Place your `.mp3` file (e.g., `happy_birthday.mp3`) into the `/audio/` folder.
    2.  Open `index.html`.
    3.  Change the `src` in the `<audio>` tag to match your filename:
        ```html
        <audio id="birthday-music" src="audio/your-music-file.mp3" loop></audio>
        ```

### 2. 📝 Write Your Personal Letter

* **File:** `index.html`
* **Action:**
    1.  Open `index.html`.
    2.  Find the `<div class="lettera-testo">` section.
    3.  Edit the text inside the `<h1>` and `<p>` tags with your message.
        ```html
        <div class="lettera-testo">
            <h1>Happy Birthday [Name]!</h1>
            <p>Write your personal message here...</p>
            <p>...</p>
            <p>With all my love,</p>
            <p>[Your Name]</p>
        </div>
        ```

### 3. 🎨 Add Decorative Corner Images

* **File:** `index.html`
* **Folder:** `/images/`
* **Action:**
    1.  Place your 4 decorative images (``.png` files with transparent backgrounds work best) into the `/images/` folder.
    2.  Open `index.html` and find the `<div class="lettera-contenitore">`.
    3.  Change the `src` path for each of the four `<img>` tags (classes `angolo-tl`, `angolo-tr`, `angolo-bl`, `angolo-br`) to match your filenames.
        ```html
        <img src="images/your-top-left.png" class="foto-angolo angolo-tl">
        <img src="images/your-top-right.png" class="foto-angolo angolo-tr">
        <img src="images/your-bottom-left.png" class="foto-angolo angolo-bl">
        <img src="images/your-bottom-right.png" class="foto-angolo angolo-br">
        ```