import { endpoints } from "./endpoints";

export const fetchUser = (userId, token) => {
  console.log('Fetching user with token', token)
  return fetch(`${endpoints.users}?userId=${userId}`, {
    method: 'GET',
    headers: {
      authorization: token
    }
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return null;
    }
  }).catch((err) => {
    console.error(err);
  })
}