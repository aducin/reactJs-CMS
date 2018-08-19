export const setLoginState = (response, token) => {
  return {
    disabled: true,
    failure: false,
    success: true,
    message: response,
    redirect: true,
    token: token
  };
};
