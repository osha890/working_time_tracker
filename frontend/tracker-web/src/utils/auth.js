
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const saveTokens = ({ access, refresh }) => {
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const refreshAccessToken = () => {
  const refresh = getRefreshToken();
  if (!refresh) return Promise.reject('No refresh token available');

  return fetch(`${BASE_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })
    .then(res => {
      if (!res.ok) throw new Error('Refresh token expired or invalid');
      return res.json();
    })
    .then(data => {
      localStorage.setItem('accessToken', data.access);
      return data.access;
    });
};


export const fetchWithAuth = (url, options = {}) => {
  let accessToken = getAccessToken();

  const headers = {
    ...(options.headers || {}),
    'Authorization': `Bearer ${accessToken}`,
  };

  return fetch(url, { ...options, headers })
    .then(async res => {
      if (res.status === 401) {
        try {
          accessToken = await refreshAccessToken();
          const newHeaders = {
            ...(options.headers || {}),
            'Authorization': `Bearer ${accessToken}`,
          };
          return fetch(url, { ...options, headers: newHeaders });
        } catch (err) {
          clearTokens();
          window.location.reload();
          throw err;
        }
      }
      return res;
    });
};
