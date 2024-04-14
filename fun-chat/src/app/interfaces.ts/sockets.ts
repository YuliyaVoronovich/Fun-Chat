export enum SocketType {
  UserLogin = 'USER_LOGIN',
  UserLogout = 'USER_LOGOUT',
  UserExternalLogin = 'USER_EXTERNAL_LOGIN',
}

export type WsMessage = UserLogin | UserLogout;

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
    user: {
      login: string;
      password: string;
    };
  };
}
