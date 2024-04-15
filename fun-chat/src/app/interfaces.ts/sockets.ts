export interface User {
  login: string;
  password: string;
}

export enum SocketType {
  ERROR = 'ERROR',
  UserLogin = 'USER_LOGIN',
  UserLogout = 'USER_LOGOUT',
  UserExternalLogin = 'USER_EXTERNAL_LOGIN',
}

export type WsMessage = UserLogin | UserLogout | ErrorOut;

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
