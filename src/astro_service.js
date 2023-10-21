import axios from 'axios';

let tokenApiAstro

export function getTokenApiAstro() {
  const data = new URLSearchParams();
  data.append("grant_type", "client_credentials");
  data.append("client_id", "af567461-6d0c-48cc-bf94-84657b7dfe72");
  data.append("client_secret", "bBaijmZNENEhMYPKysPVEsQY6Mx7GAFc8KyvHEtS");

  const config = {
    method: 'post',
    url: 'https://api.prokerala.com/token',
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  axios(config)
  .then((response)=> {
    tokenApiAstro = `${response.data.token_type} ${response.data.access_token}`
  })
  .catch((error) => {
    console.log('error', error);
  });
}

export async function getNumerologyData(date) {
  const config = {
    method: 'get',
    url: `https://api.prokerala.com/v2/numerology/life-path-number?datetime=${date}`,
    headers: {
      Authorization: tokenApiAstro

    },
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}
