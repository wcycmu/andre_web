# Andre - Your Smart Wall Street BFF

This repository contains the frontend source code for Andre, a smart financial assistant designed to provide portfolio analysis and recommendations. The application is built with plain HTML, Tailwind CSS, and JavaScript, and it communicates with a backend API for data processing and analysis.

## Features

- **Transaction Upload:** Users can upload their trading history via a CSV file.
- **Dashboard:** View a summary of uploaded transactions.
- **Sentiment Analysis:** Users can log their daily market sentiment.
- **Market Data:** Fetch and display real-time stock metrics and news headlines for tickers in the portfolio.
- **AI-Powered Analysis:** Combines transaction data, user sentiment, and market data to generate personalized portfolio recommendations.
- **Responsive Design:** The UI is fully responsive and works beautifully on desktop, tablet, and mobile devices.

## Tech Stack

- **Frontend:** HTML, JavaScript (ES6+), Tailwind CSS
- **API Communication:** `fetch()` API
- **State Management:** Browser `localStorage`

---

## How to Run Locally

1.  **Clone the backend repository** and follow its instructions to start the backend server.
2.  **Verify the API URL:** By default, the frontend expects the backend to be running on `http://localhost:8000`. If your backend runs on a different port (e.g., 5000), you **must** update the `API_BASE_URL` constant at the top of the `script.js` file to match.
3.  **Clone this frontend repository:**
    ```bash
    git clone git@github.com:wcycmu/andre_web.git
    ```
4.  **Open `index.html` in your browser.** You can do this by right-clicking the file and selecting "Open with..." or by using a simple live server extension in your code editor (like "Live Server" for VS Code).

---

## How to Deploy to GitHub Pages

Follow these steps to deploy the web application to a free public URL using GitHub Pages.

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone git@github.com:wcycmu/andre_web.git
    cd andre_web
    ```

2.  **Ensure all files are in the correct location.** The required files (`index.html`, `dashboard.html`, `style.css`, `script.js`, etc.) should be in the root of the repository or in a `/docs` folder. The current structure with files in the root is ready for deployment.

3.  **Push your code to the `main` branch on GitHub:**
    ```bash
    git add .
    git commit -m "Prepare for deployment"
    git push origin main
    ```

4.  **Enable GitHub Pages in your repository settings:**
    *   Navigate to your GitHub repository page: `https://github.com/wcycmu/andre_web`
    *   Click on the **Settings** tab.
    *   In the left sidebar, click on **Pages**.
    *   Under "Build and deployment", for the **Source**, select **Deploy from a branch**.
    *   Set the **Branch** to **`main`** and the folder to **`/(root)`**.
    *   Click **Save**.

5.  **Visit your live site!**
    *   GitHub will provide you with a URL for your published site, which will look something like this:
        `https://<your-username>.github.io/andre_web/`
    *   For your repository, the URL will be: **https://wcycmu.github.io/andre_web/**
    *   It may take a few minutes for the site to become active after you save the settings.

**Note:** For the deployed version to work, the backend API must be publicly accessible on the internet, and the `API_BASE_URL` variable in `script.js` must be updated to point to that public API endpoint. The default `http://localhost:8000` will not work from the public internet.