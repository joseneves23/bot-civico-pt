# Bot Cívico - Chatbot for Civic Information

## Overview
Bot Cívico is a chatbot designed to provide useful information about cities in Portugal. It offers insights into municipal chambers, transport schedules, health centers, and public services. Users can ask questions like "Qual é o horário da Câmara de Setúbal?" or "Onde tratar do Cartão de Cidadão em Braga?" to receive accurate and timely responses.

## Features
- **City Information**: Access details about municipal chambers, transport schedules, health centers, and public services across various cities in Portugal.
- **User-Friendly Interface**: An intuitive chat interface that allows users to easily interact with the bot.
- **Dynamic Data**: The chatbot utilizes a JSON file to keep city information updated and easily manageable.

## Project Structure
```
bot-civico
├── public
│   └── favicon.ico
├── src
│   ├── pages
│   │   ├── api
│   │   │   └── chat.ts
│   │   └── index.tsx
│   ├── components
│   │   ├── ChatInput.tsx
│   │   └── ChatMessages.tsx
│   ├── data
│   │   └── cidades.json
│   ├── lib
│   │   └── llmApi.ts
│   └── styles
│       └── globals.css
├── .env.example
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd bot-civico
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
To start the development server, run:
```
npm run dev
```
The application will be available at `http://localhost:3000`.


## Usage
Once the application is running, users can interact with the chatbot through the web interface. Simply type your question in the input field and hit enter to receive a response.
