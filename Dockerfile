FROM node:14-slim

COPY . /app
WORKDIR /app

ARG REACT_APP_CRASH_GAME_BACKEND_URL
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_CASINO_GAMES_BACKEND_URL=
ARG REACT_APP_SOCKET_URL
ARG REACT_APP_NEWS_API_KEY
ARG REACT_APP_RECAPTCHA_KEY
ARG REACT_APP_GTM_ID
ARG REACT_APP_PUMP_DUMP_GAME_BACKEND_URL
ARG REACT_APP_SHOW_UPCOMING_FEATURES=true
ARG REACT_APP_GOOGLE_CLIENT_ID
ARG REACT_APP_FACEBOOK_CLIENT_ID
ARG REACT_APP_URL
ARG REACT_APP_DEPOSIT_WALLET
ARG REACT_APP_ACCOUNT_MAPPER_URL
ARG REACT_APP_ENVIRONMENT
ARG REACT_APP_DEPOSIT_WALLET_BITCOIN
ARG REACT_APP_DEPOSIT_WALLET_ETHEREUM
ARG REACT_APP_DEPOSIT_WALLET_LITECOIN
ARG REACT_APP_TOKEN_NAME
ARG REACT_APP_TRANSAK_API_KEY
ARG REACT_APP_TRANSAK_ENVIROMENT
ARG REACT_APP_TRANSAK_DEFAULT_CRYPTO_CURRENCY
ARG REACT_APP_TRANSAK_CRYPTO_CURRENCY_CODE
ARG REACT_APP_TRANSAK_WALLET_ADDRESS
ARG REACT_APP_TRANSAK_NETWORK
ARG REACT_APP_TWITCH_CLIENT_ID
ARG REACT_APP_DISCORD_CLIENT_ID
ARG REACT_APP_WITHDRAW_SERVICE_URL
ARG REACT_APP_SMARTSOFT_LAUNCHER_URL
ARG REACT_APP_SMARTSOFT_PORTALNAME
ARG REACT_APP_EVENTS_SERVICE_URL
ARG REACT_APP_PLAYMONEY
ARG REACT_APP_TOKEN_DISPLAY_NAME

RUN npm install
RUN npm run build

CMD npm run production

EXPOSE 3000
