export interface User {
  login: string;
  password: string;
}

export interface IsUserLogin {
  login: string;
  isLogined: boolean;
}

export enum SocketType {
  ERROR = 'ERROR',
  UserLogin = 'USER_LOGIN',
  UserLogout = 'USER_LOGOUT',
  UserExternalLogin = 'USER_EXTERNAL_LOGIN',
  UserExternalLogout = 'USER_EXTERNAL_LOGOUT',
  AllAuthenticatedUsers = 'USER_ACTIVE',
  AllInAuthenticatedUsers = 'USER_INACTIVE',
  MessageReceived = 'MSG_SEND',
}

export type WsMessage =
  | UserLogin
  | UserLogout
  | UserExternalLogin
  | UserExternalLogout
  | ErrorOut
  | UsersActive
  | UsersInActive
  | MessageReceived;

export type EventType =
  | 'userLoggedIn'
  | 'userLoggedOut'
  | 'usersActive'
  | 'usersInActive'
  | 'userExternalLogin'
  | 'userExternalLogout'
  | 'error'
  | 'messageReceived';

export type EventPayloads = {
  userLoggedIn: { isLogined: boolean; login: string };
  userLoggedOut: { login: string; password: string };
  userExternalLogin: { isLogined: boolean; login: string };
  userExternalLogout: { isLogined: boolean; login: string };
  messageReceived: { text: string; from: string; to: string; datetime: number };
  usersActive: { users: IsUserLogin[] };
  usersInActive: { users: IsUserLogin[] };
  error: { error: string };
};

export interface ErrorOut {
  id: string;
  type: SocketType.ERROR;
  payload: {
    error: string;
  };
}

export interface UserLogin {
  id: string;
  type: SocketType.UserLogin;
  payload: {
    user: {
      isLogined: boolean;
      login: string;
    };
  };
}

export interface UserLogout {
  id: string;
  type: SocketType.UserLogout;
  payload: {
    user: User;
  };
}

export interface UserExternalLogin {
  id: string;
  type: SocketType.UserExternalLogin;
  payload: {
    user: {
      isLogined: boolean;
      login: string;
    };
  };
}

export interface UserExternalLogout {
  id: string;
  type: SocketType.UserExternalLogout;
  payload: {
    user: {
      isLogined: boolean;
      login: string;
    };
  };
}

export interface UsersActive {
  id: string;
  type: SocketType.AllAuthenticatedUsers;
  payload: {
    users: IsUserLogin[];
  };
}

export interface UsersInActive {
  id: string;
  type: SocketType.AllInAuthenticatedUsers;
  payload: {
    users: IsUserLogin[];
  };
}

export interface MessageReceived {
  id: string;
  type: SocketType.MessageReceived;
  payload: {
    message: {
      id: string;
      from: string;
      to: string;
      text: string;
      datetime: number;
      status: {
        isDelivered: boolean;
        isReaded: boolean;
        isEdited: boolean;
      };
    };
  };
}
