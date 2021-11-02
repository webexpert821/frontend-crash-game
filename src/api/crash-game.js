import * as ApiUrls from '../constants/Api';
import axios from 'axios';
import ContentTypes from '../constants/ContentTypes';

const createInstance = (host, apiPath) => {
  return axios.create({
    baseURL: `${host}${apiPath}`,
    timeout: 30000,
    headers: {
      'content-type': ContentTypes.applicationJSON,
      accept: ContentTypes.applicationJSON,
    },
  });
};

class GameApi {
  constructor(host) {
    this.host = host;
    this.api = createInstance(host, '/');
  }
  setToken = token => {
    const authentication = 'Bearer ' + token;

    this.api.defaults.headers.common['Authorization'] = authentication;
  };

  createTrade = payload => {
    return this.api.post(ApiUrls.API_TRADE_CREATE, payload).catch(error => {
      console.log('[API Error] called: createTrade', error);
      throw error;
    });
  };

  cancelBet = () =>
    this.api.delete(ApiUrls.API_TRADE_CREATE).catch(error => {
      throw error;
    });

  getCurrentGameInfo = () => {
    return this.api.get(ApiUrls.API_CURRENT).catch(error => {
      console.log('[API Error] called: getCurrentGameInfo', error);
    });
  };

  cashOut = () => {
    return this.api.post(ApiUrls.API_CASH_OUT, {}).catch(error => {
      console.log('[API Error] called: Cash Out', error);
      throw error;
    });
  };

  getGameDetailById = (gameId, type) => {
    const gameUrl = ApiUrls.CRASH_GAME_API_GET_GAME_DETAILS.replace(
      ':gameId',
      gameId
    );

    return this.api.get(gameUrl + (type ? `/${type}` : '')).catch(error => {
      console.log('[API Error] called: getGameDetailById', error);
    });
  };
}

const Api = createInstance(ApiUrls.CRASH_GAME_BACKEND_URL, '/');

const setToken = token => {
  const authentication = 'Bearer ' + token;

  Api.defaults.headers.common['Authorization'] = authentication;
};

const createTrade = payload => {
  return Api.post(ApiUrls.API_TRADE_CREATE, payload).catch(error => {
    console.log('[API Error] called: createTrade', error);
    throw error;
  });
};

const cancelBet = () =>
  Api.delete(ApiUrls.API_TRADE_CREATE).catch(error => {
    throw error;
  });

const getCurrentGameInfo = () => {
  return Api.get(ApiUrls.API_CURRENT).catch(error => {
    console.log('[API Error] called: getCurrentGameInfo', error);
  });
};

const cashOut = () => {
  return Api.post(ApiUrls.API_CASH_OUT, {}).catch(error => {
    console.log('[API Error] called: Cash Out', error);
    throw error;
  });
};

const getGameDetailById = (gameId, type) => {
  const gameUrl = ApiUrls.CRASH_GAME_API_GET_GAME_DETAILS.replace(
    ':gameId',
    gameId
  );

  return Api.get(gameUrl + (type ? `/${type}` : '')).catch(error => {
    console.log('[API Error] called: getGameDetailById', error);
  });
};

export {
  GameApi,
  Api,
  setToken,
  createTrade,
  getCurrentGameInfo,
  cashOut,
  cancelBet,
  getGameDetailById,
};
