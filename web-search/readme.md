# Web Search Service

This project implements a web search service using Express.js. The service is capable of performing web searches (with Tavily and SerpApi [google as engine]) and scraping content from web pages(SSR pages only as of now).

## Features

-   **Web Search:** Leverages various APIs like SerpApi and Tavily for web searching.
-   **Scraping:** Utilizes the Mozilla Readability and jsdom libraries to extract readable content from web pages.
-   **Mode-Based Prompting:** Supports different response modes (brief, detailed) based on user input.
-   **Caching:** Implements caching for search and scraper results to optimize performance and reduce redundant API calls.
-   **API Error Handling:** Centralized error handling for API requests.

## Installation

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    ```

2. **Navigate to the project directory:**

    ```bash
    cd web-search
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Set up environment variables:**

    Create a `.env` file in the root directory and specify the necessary environment variables mentioned in `.env.sample`.

## Usage

-   **Run the development server:**

    ```bash
    npm run dev
    ```

-   **Build the project:**

    ```bash
    npm run build
    ```

-   **Start the production server:**

    ```bash
    npm start
    ```

## API Endpoints

-   **GET /**: Initiates a web search based on the query parameter.

    Example request:

    ```bash
    curl "http://localhost:<PORT>/?q=example+query"
    ```

## Configuration

-   **Constants:** Modify `webSearchConstants.ts` and `scraperConstants.ts` to adjust search limits and cache lifetimes.
-   **Logger:** Configure logging settings in `logger/index.ts`.

## Dependencies

-   **Express:** Web framework for Node.js
-   **Axios:** Promise-based HTTP client
-   **jsdom:** JavaScript implementation of the DOM
-   **@mozilla/readability:** Library for extracting main content from web pages
-   **Puppeteer:** Headless browser for web scraping

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements.

## License

This project is licensed under the ISC License.
