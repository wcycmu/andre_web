
const API_BASE_URL = 'http://localhost:8000';

// --- COMMON FUNCTIONS ---

/**
 * Gets a unique user ID from localStorage or creates a new one.
 */
const getUserId = () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Date.now() + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('userId', userId);
    }
    return userId;
};

/**
 * Logs the user out by clearing localStorage and redirecting to the index page.
 */
const logout = () => {
    localStorage.clear();
    window.location.replace('index.html');
};

/**
 * Checks if the user has uploaded transactions. If not, redirects to the index page.
 * This function should be called on all pages except index.html.
 */
const checkAuth = () => {
    if (document.body.id !== 'page-index' && !localStorage.getItem('transactions')) {
        window.location.replace('index.html');
    }
};

/**
 * Renders the common header and navigation bar into the page.
 * @param {string} activePage - The name of the current page to highlight in the nav.
 */
const renderHeaderAndNav = (activePage) => {
    const container = document.getElementById('header-nav-container');
    if (!container) return;

    const navLinks = [
        { href: 'dashboard.html', text: 'Dashboard', page: 'dashboard' },
        { href: 'whatsup.html', text: "What's Up", page: 'whatsup' },
        { href: 'market.html', text: 'Market Data', page: 'market' },
        { href: 'analyze.html', text: 'Analyze', page: 'analyze' },
    ];

    const desktopLinksHtml = navLinks.map(link => `
        <a href="${link.href}" 
           class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${activePage === link.page ? 'active' : ''}">
           ${link.text}
        </a>
    `).join('');

    const mobileLinksHtml = navLinks.map(link => `
        <a href="${link.href}" 
           class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${activePage === link.page ? 'active' : ''}">
           ${link.text}
        </a>
    `).join('');

    container.innerHTML = `
        <header class="bg-gray-800 shadow-lg sticky top-0 z-20">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex-shrink-0">
                        <a href="dashboard.html" title="Go to Dashboard">
                            <h1 class="text-xl font-bold text-white">Andre</h1>
                        </a>
                        <p class="text-xs text-gray-400">Your Best Smart Wall Street BFF</p>
                    </div>

                    <!-- Desktop Menu -->
                    <nav class="hidden md:flex items-center space-x-4">
                        ${desktopLinksHtml}
                        <button onclick="logout()" class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium">Logout</button>
                    </nav>

                    <!-- Mobile Menu Button -->
                    <div class="md:hidden">
                        <button id="mobile-menu-button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                            <span class="sr-only">Open main menu</span>
                            <svg class="block h-6 w-6" id="icon-open" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg class="hidden h-6 w-6" id="icon-close" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Mobile Menu, show/hide based on menu state. -->
            <div id="mobile-menu" class="md:hidden hidden">
                <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    ${mobileLinksHtml}
                </div>
                <div class="pt-4 pb-3 border-t border-gray-700">
                    <div class="flex items-center px-5">
                        <button onclick="logout()" class="w-full text-left bg-red-600 hover:bg-red-700 text-white block px-3 py-2 rounded-md text-base font-medium">Logout</button>
                    </div>
                </div>
            </div>
        </header>
    `;

    // Attach event listeners for mobile menu
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');

    if (mobileMenuButton && mobileMenu && iconOpen && iconClose) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            iconOpen.classList.toggle('hidden');
            iconClose.classList.toggle('hidden');
        });
    }
};


// --- PAGE-SPECIFIC INITIALIZATION ---

/**
 * Initializes the index page (file upload).
 */
const initIndexPage = () => {
    const form = document.getElementById('upload-form');
    const submitButton = document.getElementById('submit-button');
    const buttonText = document.getElementById('button-text');
    const loader = document.getElementById('loader');
    const messageArea = document.getElementById('message-area');

    // If user is already "logged in", redirect to dashboard
    if (localStorage.getItem('transactions')) {
        window.location.replace('dashboard.html');
        return; // Stop execution for this page
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        submitButton.disabled = true;
        buttonText.classList.add('hidden');
        loader.classList.remove('hidden');
        messageArea.textContent = 'Processing your transactions...';
        messageArea.className = 'mt-4 text-center text-gray-400';

        const formData = new FormData(form);

        try {
            const response = await fetch(`${API_BASE_URL}/upload-transactions`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status === 'success' && data.preview) {
                localStorage.setItem('transactions', JSON.stringify(data.preview));
                getUserId(); // Ensure a user ID is created on first successful upload
                window.location.replace('dashboard.html');
            } else {
                throw new Error(data.message || 'Failed to process file.');
            }

        } catch (error) {
            messageArea.textContent = `Error: ${error.message}`;
            messageArea.classList.add('text-red-400');
        } finally {
            submitButton.disabled = false;
            buttonText.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    });
};

/**
 * Initializes the dashboard page.
 */
const initDashboardPage = () => {
    checkAuth();
    renderHeaderAndNav('dashboard');

    const transactions = JSON.parse(localStorage.getItem('transactions'));
    const table = document.getElementById('transactions-table');
    const msg = document.getElementById('no-transactions-msg');
    
    if (!transactions || transactions.length === 0) {
        msg.classList.remove('hidden');
        return;
    }
    
    const tableHead = `
        <thead class="bg-gray-700">
            <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ticker</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Buy Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
            </tr>
        </thead>
    `;
    
    const tableBody = `
        <tbody class="bg-gray-800 divide-y divide-gray-700">
            ${transactions.map(tx => `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${tx.ticker}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${tx.buy_date}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${tx.quantity}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">$${Number(tx.price).toFixed(2)}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    table.innerHTML = tableHead + tableBody;
};

/**
 * Initializes the "What's Up" page.
 */
const initWhatsupPage = () => {
    checkAuth();
    renderHeaderAndNav('whatsup');

    const form = document.getElementById('sentiment-form');
    const sentimentInput = document.getElementById('sentiment-input');
    const messageArea = document.getElementById('message-area');
    const sentimentBtns = document.querySelectorAll('.sentiment-btn');

    sentimentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sentimentBtns.forEach(b => b.classList.remove('selected', 'bg-indigo-600'));
            btn.classList.add('selected', 'bg-indigo-600');
            sentimentInput.value = btn.dataset.sentiment;
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!sentimentInput.value) {
            messageArea.textContent = 'Please select your sentiment.';
            messageArea.className = 'mt-4 text-center text-yellow-400';
            return;
        }

        const payload = {
            user_id: getUserId(),
            sentiment: sentimentInput.value,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/get-sentiment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to save sentiment.');

            const data = await response.json();
            localStorage.setItem('sentiment', data.sentiment);
            messageArea.textContent = `Success! Your sentiment "${data.sentiment}" has been saved.`;
            messageArea.className = 'mt-4 text-center text-green-400';

        } catch (error) {
            messageArea.textContent = `Error: ${error.message}`;
            messageArea.className = 'mt-4 text-center text-red-400';
        }
    });
};

/**
 * Initializes the market data page.
 */
const initMarketPage = () => {
    checkAuth();
    renderHeaderAndNav('market');

    const loader = document.getElementById('loader');
    const errorMsg = document.getElementById('error-msg');
    const dataContainer = document.getElementById('market-data-container');
    const stockContainer = document.getElementById('stock-cards-container');
    const newsContainer = document.getElementById('news-list-container');
    
    const transactions = JSON.parse(localStorage.getItem('transactions'));
    const tickers = [...new Set(transactions.map(tx => tx.ticker))];

    if (tickers.length === 0) {
        loader.classList.add('hidden');
        errorMsg.textContent = "No tickers found in your transactions.";
        errorMsg.classList.remove('hidden');
        return;
    }

    const tickerString = tickers.join(',');

    const fetchData = async () => {
        try {
            const [stockRes, newsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/get-stock-data?tickers=${tickerString}`),
                fetch(`${API_BASE_URL}/get-news?tickers=${tickerString}`)
            ]);

            if (!stockRes.ok || !newsRes.ok) throw new Error('Failed to fetch market data.');

            const stockData = await stockRes.json();
            const newsData = await newsRes.json();
            
            renderStockData(stockData.data || []);
            renderNewsData(newsData.headlines || []);
            
            dataContainer.classList.remove('hidden');

        } catch (error) {
            errorMsg.textContent = `Error: ${error.message}`;
            errorMsg.classList.remove('hidden');
        } finally {
            loader.classList.add('hidden');
        }
    };

    const renderStockData = (stocks) => {
        if(stocks.length === 0) {
             stockContainer.innerHTML = `<p class="text-gray-400 col-span-full">Could not retrieve stock data.</p>`;
             return;
        }
        stockContainer.innerHTML = stocks.map(stock => `
            <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h4 class="text-xl font-bold text-white">${stock.ticker}</h4>
                <div class="mt-2 space-y-1 text-sm">
                    <p class="text-gray-300">P/E Ratio: <span class="font-semibold text-white">${stock.pe_ratio.toFixed(2)}</span></p>
                    <p class="text-gray-300">EPS: <span class="font-semibold text-white">${stock.eps.toFixed(2)}</span></p>
                </div>
            </div>
        `).join('');
    };

    const renderNewsData = (news) => {
        if(news.length === 0) {
             newsContainer.innerHTML = `<p class="text-gray-400">No recent news found for your tickers.</p>`;
             return;
        }
        newsContainer.innerHTML = news.map(item => `
            <div class="border-b border-gray-700 py-3">
                <p class="text-sm text-gray-400">${item.source}</p>
                <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="font-semibold text-indigo-400 hover:text-indigo-300">
                    ${item.title}
                </a>
            </div>
        `).join('');
    };

    fetchData();
};

/**
 * Initializes the analysis page.
 */
const initAnalyzePage = () => {
    checkAuth();
    renderHeaderAndNav('analyze');

    const analyzeBtn = document.getElementById('analyze-button');
    const loader = document.getElementById('loader');
    const errorMsg = document.getElementById('error-msg');
    const prereqMsg = document.getElementById('prerequisite-msg');
    const recommendationsContainer = document.getElementById('recommendations-container');
    
    const sentiment = localStorage.getItem('sentiment');
    if (!sentiment) {
        prereqMsg.innerHTML = `Please provide your sentiment on the <a href="whatsup.html" class="font-bold underline hover:text-yellow-300">'What's Up'</a> page before running an analysis.`;
        prereqMsg.classList.remove('hidden');
        analyzeBtn.disabled = true;
    }

    analyzeBtn.addEventListener('click', async () => {
        analyzeBtn.disabled = true;
        loader.classList.remove('hidden');
        errorMsg.classList.add('hidden');
        recommendationsContainer.innerHTML = '';

        try {
            const transactions = JSON.parse(localStorage.getItem('transactions'));
            const tickers = [...new Set(transactions.map(tx => tx.ticker))].join(',');

            // 1. Fetch required data (metrics, news)
            const [stockRes, newsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/get-stock-data?tickers=${tickers}`),
                fetch(`${API_BASE_URL}/get-news?tickers=${tickers}`)
            ]);
            if (!stockRes.ok || !newsRes.ok) throw new Error('Could not fetch market data needed for analysis.');

            const stockData = await stockRes.json();
            const newsData = await newsRes.json();

            // 2. Prepare payload for /analyze
            const payload = {
                user_id: getUserId(),
                sentiment: localStorage.getItem('sentiment'),
                transaction_history: transactions.map(tx => ({
                    ticker: tx.ticker,
                    transaction_date: tx.buy_date, // Mapping buy_date to transaction_date
                    transaction_type: 'buy', // Assuming 'buy' as per MVP requirements
                    quantity: tx.quantity,
                    price: tx.price
                })),
                current_metrics: stockData.data,
                news_summaries: newsData.headlines.map(h => ({ ticker: h.ticker, headline: h.title })) // API expects this format
            };

            // 3. Call /analyze endpoint
            const analyzeRes = await fetch(`${API_BASE_URL}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!analyzeRes.ok) throw new Error('Analysis request failed.');

            const analysisResult = await analyzeRes.json();
            
            // 4. Render results
            renderRecommendations(analysisResult.recommendations || []);

        } catch (error) {
            errorMsg.textContent = `Error: ${error.message}`;
            errorMsg.classList.remove('hidden');
        } finally {
            analyzeBtn.disabled = false;
            loader.classList.add('hidden');
        }
    });

    const renderRecommendations = (recs) => {
         if(recs.length === 0) {
             recommendationsContainer.innerHTML = `<p class="text-gray-400 text-center">No specific recommendations could be generated at this time.</p>`;
             return;
        }
        recommendationsContainer.innerHTML = recs.map(rec => {
            const confidenceColor = rec.confidence.toLowerCase() === 'high' ? 'text-green-400' : (rec.confidence.toLowerCase() === 'medium' ? 'text-yellow-400' : 'text-gray-400');
            return `
                <div class="bg-gray-700 p-6 rounded-lg shadow-lg">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="text-xl font-bold text-white">${rec.ticker}</h4>
                            <p class="font-semibold text-indigo-400">${rec.recommendation}</p>
                        </div>
                        <p class="text-sm font-bold ${confidenceColor}">Confidence: ${rec.confidence}</p>
                    </div>
                    <p class="mt-4 text-gray-300">${rec.reasoning}</p>
                </div>
            `;
        }).join('');
    };
};


// --- App Router ---
document.addEventListener('DOMContentLoaded', () => {
    // This new routing mechanism is more robust than parsing the URL.
    // It relies on a unique ID on each page's <body> tag.
    const pageId = document.body.id;
    
    switch (pageId) {
        case 'page-index':
            initIndexPage();
            break;
        case 'page-dashboard':
            initDashboardPage();
            break;
        case 'page-whatsup':
            initWhatsupPage();
            break;
        case 'page-market':
            initMarketPage();
            break;
        case 'page-analyze':
            initAnalyzePage();
            break;
        default:
            // This case should not be reached if all pages have a body ID.
            // As a fallback, redirect to a safe page.
            console.error('Page has no ID or an unknown ID:', pageId);
            if (localStorage.getItem('transactions')) {
                window.location.replace('dashboard.html');
            } else {
                window.location.replace('index.html');
            }
            break;
    }
});
