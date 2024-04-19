export interface IUser {
  login: string;
  password: string;
}

export interface IMessage {
  text: string;
  from: string;
  to: string;
  datetime: number;
  status: { isDelivered: boolean; isReaded: boolean; isEdited: boolean };
}

export interface IUserLoginned {
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
  MessageHistory = 'MSG_FROM_USER',
  MessageDeliver = 'MSG_DELIVER',
}

export type WsMessage =
  | UserLogin
  | UserLogout
  | UserExternalLogin
  | UserExternalLogout
  | ErrorOut
  | UsersActive
  | UsersInActive
  | MessageReceived
  | MessageHistory
  | MessageDeliver;

export type EventType =
  | 'userLoggedIn'
  | 'userLoggedOut'
  | 'usersActive'
  | 'usersInActive'
  | 'userExternalLogin'
  | 'userExternalLogout'
  | 'error'
  | 'connection'
  | 'messageReceived'
  | 'messageHistory'
  | 'messageDeliver';

export type EventPayloads = {
  userLoggedIn: { isLogined: boolean; login: string };
  userLoggedOut: { login: string; password: string };
  userExternalLogin: { isLogined: boolean; login: string };
  userExternalLogout: { isLogined: boolean; login: string };
  messageReceived: IMessage;
  messageHistory: { messages: IMessage[] };
  messageDeliver: {
    message: {
      id: string;
      status: {
        isDelivered: boolean;
      };
    };
  };
  usersActive: { users: IUserLoginned[] };
  usersInActive: { users: IUserLoginned[] };
  error: { error: string };
  connection: { connection: boolean };
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
    user: IUser;
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
    users: IUserLoginned[];
  };
}

export interface UsersInActive {
  id: string;
  type: SocketType.AllInAuthenticatedUsers;
  payload: {
    users: IUserLoginned[];
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

export interface MessageHistory {
  id: string;
  type: SocketType.MessageHistory;
  payload: {
    messages: IMessage[];
  };
}

export interface MessageDeliver {
  id: string;
  type: SocketType.MessageDeliver;
  payload: {
    message: {
      id: string;
      status: {
        isDelivered: boolean;
      };
    };
  };
}
