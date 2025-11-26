# WhatsApp Bot Backend

This is a Node.js backend for a WhatsApp Bot using the WhatsApp Business Cloud API.

## Prerequisites

1.  **Node.js** installed.
2.  **Meta Developer Account** and a WhatsApp Business App set up.
3.  **Ngrok** (for local testing) to expose your localhost to the internet.

## Setup

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Configure Environment Variables**:
    Open `.env` and update the following:

    - `WEBHOOK_VERIFY_TOKEN`: A random string you create (e.g., "my_secure_token"). You will use this in the Meta Dashboard.
    - `GRAPH_API_TOKEN`: Your temporary or permanent access token from the WhatsApp API Setup page.
    - `PHONE_NUMBER_ID`: Found on the WhatsApp API Setup page.
    - `BUSINESS_ACCOUNT_ID`: Found on the WhatsApp API Setup page.

3.  **Run the Server**:
    ```bash
    npm start
    ```
    The server will run on port 3000.

## Connect to WhatsApp

1.  Start **Ngrok** (if running locally):

    ```bash
    ngrok http 3000
    ```

    Copy the HTTPS URL (e.g., `https://1234-56-78.ngrok-free.app`).

2.  **Configure Webhook in Meta Dashboard**:

    - Go to your App Dashboard -> WhatsApp -> Configuration.
    - Click **Edit** under Webhook.
    - **Callback URL**: `YOUR_NGROK_URL/webhook`
    - **Verify Token**: The value you put in `.env` (e.g., `my_secure_verify_token`).
    - Click **Verify and Save**.

3.  **Subscribe to Fields**:
    - Under Webhook fields, click **Manage**.
    - Subscribe to `messages`.

## Usage

Send a message to the test phone number provided in the Meta Dashboard.

- Send "Hello" to get a greeting.
- Send "Help" to see options.
