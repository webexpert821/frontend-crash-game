import { makeActionCreator } from '../../helper/Store';

export const AlertTypes = {
  REMOVE: 'Alert/REMOVE',
  REMOVE_ALL: 'Alert/REMOVE_ALL',
  SHOW_ERROR: 'Alert/SHOW_ERROR',
  SHOW_SUCCESS: 'Alert/SHOW_SUCCESS',
  SHOW_NOTIFICATION: 'Alert/SHOW_NOTIFICATION',
};

export const UserNotificationTypes = {
  BET_RESOLVED: 'Notification/EVENT_BET_RESOLVED',
  BET_CLOSED: 'Notification/EVENT_BET_CLOSED',
  BET_DISPUTED: 'Notification/EVENT_BET_DISPUTED',
  BET_ACTIVE: 'Notification/EVENT_BET_ACTIVE',
  BET_WAITING_RESOLUTION: 'Notification/EVENT_BET_WAITING_RESOLUTION',
  EVENT_RESOLVE: 'Notification/EVENT_RESOLVE',
  EVENT_BET_CANCELLED: 'Notification/EVENT_BET_CANCELED',
  EVENT_USER_REWARD: 'Notification/EVENT_USER_REWARD',
  USER_AWARD: 'Notification/USER_AWARD',
  EVENT_CANCEL: 'Notification/EVENT_CANCEL',
  EVENT_USER_KYC_UPDATE: 'Notification/EVENT_USER_KYC_UPDATE',
};

const removeAlert = makeActionCreator(AlertTypes.REMOVE, {
  id: null,
});

const removeAlerts = makeActionCreator(AlertTypes.REMOVE_ALL);

const showError = makeActionCreator(AlertTypes.SHOW_ERROR, {
  id: null,
  message: null,
});

const showSuccess = makeActionCreator(AlertTypes.SHOW_SUCCESS, {
  id: null,
  message: null,
});

const showNotification = makeActionCreator(AlertTypes.SHOW_NOTIFICATION, {
  id: null,
  notification: null,
});

export const AlertActions = {
  removeAlert,
  removeAlerts,
  showError,
  showSuccess,
  showNotification,
};
