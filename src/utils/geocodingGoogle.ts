import axios from 'axios';

interface GoogleGeocodeResponse {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
}

export const obterCoordenadasPorEndereco = async (
  logradouro: string,
  bairro: string,
  cidade: string,
  estado: string,
  numero?: string,
) => {
  const enderecoCompleto = `${logradouro}, ${numero}, ${bairro}, ${cidade}, ${estado}`;
  
  const { data } = await axios.get<GoogleGeocodeResponse>(
    'https://maps.googleapis.com/maps/api/geocode/json',
    {
      params: {
        address: enderecoCompleto,
        region: 'br',
        key: process.env.GOOGLE_API_KEY,
      },
    },
  );

  // coloca o resultado da api nas constantes de latitude e longitude
  const { lat, lng } = data.results[0].geometry.location;
  return { latitude: lat, longitude: lng };
};
