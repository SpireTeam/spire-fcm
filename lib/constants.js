/*!
 * node-gcm
 * Copyright(c) 2013 Marcus Farkas <toothlessgear@finitebox.com>
 * MIT Licensed
 */

var Constants = {

    'FCM_SEND_ENDPOINT' : 'fcm.googleapis.com',

    'FCM_SEND_ENDPATH' : '/fcm/send',

    'FCM_SEND_URI' : 'https://fcm.googleapis.com:443/fcm/send',

    // This remains 'gcm' until Google updates their endpoint
    'FCM_NOTIFICATION_URI' : 'https://android.googleapis.com/gcm/notification',

    'PARAM_COLLAPSE_KEY' : 'collapse_key',

    'PARAM_PRIORITY': 'priority',

    'PARAM_CONTENT_AVAILABLE': 'content_available',

    'PARAM_RESTRICTED_PACKAGE_NAME': 'restricted_package_name',

    'PARAM_DATA_PAYLOAD_KEY' : 'data',

    'PARAM_NOTIFICATION_PAYLOAD_KEY' : 'notification',

    'PARAM_TIME_TO_LIVE' : 'time_to_live',

    'PARAM_DRY_RUN' : 'dry_run',

    'PARAM_OPERATION' : 'operation',

    'PARAM_TO': 'to',

    'PARAM_NOTIFICATION_KEY' : 'notification_key',

    'PARAM_NOTIFICATION_KEY_NAME' : 'notification_key_name',

    'ERROR_QUOTA_EXCEEDED' : 'QuotaExceeded',

    'ERROR_DEVICE_QUOTA_EXCEEDED' : 'DeviceQuotaExceeded',

    'ERROR_MISSING_REGISTRATION' : 'MissingRegistration',

    'ERROR_INVALID_REGISTRATION' : 'InvalidRegistration',

    'ERROR_MISMATCH_SENDER_ID' : 'MismatchSenderId',

    'ERROR_NOT_REGISTERED' : 'NotRegistered',

    'ERROR_MESSAGE_TOO_BIG' : 'MessageTooBig',

    'ERROR_MISSING_COLLAPSE_KEY' : 'MissingCollapseKey',

    'ERROR_UNAVAILABLE' : 'Unavailable',

    'TOKEN_MESSAGE_ID' : 'id',

    'TOKEN_CANONICAL_REG_ID' : 'registration_id',

    'TOKEN_ERROR' : 'Error',

    'JSON_REGISTRATION_IDS' : 'registration_ids',

    'JSON_PAYLOAD' : 'data',

    'JSON_NOTIFICATION_KEY' : 'gcm_notification_key',

    'JSON_SUCCESS' : 'success',

    'JSON_FAILURE' : 'failure',

    'JSON_FAILED_REGISTRATION_IDS' : 'failed_registration_ids',

    'JSON_CANONICAL_IDS' : 'canonical_ids',

    'JSON_MULTICAST_ID' : 'multicast_id',

    'JSON_RESULTS' : 'results',

    'JSON_ERROR' : 'error',

    'JSON_MESSAGE_ID' : 'message_id',

    'UTF8' : 'UTF-8',

    'BACKOFF_INITIAL_DELAY' : 1000,

    'MAX_BACKOFF_DELAY' : 1024000  ,

    'SOCKET_TIMEOUT' : 180000 //three minutes
};

module.exports = Constants;
