import axios from 'axios';
import { count } from 'console';
import { writeFileSync } from 'fs';

const main = async () => {
  const url = 'https://www.hofstede-insights.com/wp-json/v1/country';
  const response = await axios.get(url);
  const data = response.data;
  const countries = data.map(
    ({
      id,
      title,
      pdi,
      idv,
      mas,
      uai,
      lto,
      ind,
    }: {
      id: number;
      title: string;
      pdi: string;
      idv: string;
      mas: string;
      uai: string;
      lto: string;
      ind: string;
    }) => {
      const powerDistance = parseInt(pdi || '-1', 10);
      const individualism = parseInt(idv || '-1', 10);
      const masculinity = parseInt(mas || '-1', 10);
      const uncertaintyAvoidance = parseInt(uai || '-1', 10);
      const longTermOrientation = parseInt(lto || '-1', 10);
      const indulgence = parseInt(ind || '-1', 10);
      return {
        id,
        country: title,
        powerDistance,
        individualism,
        masculinity,
        uncertaintyAvoidance,
        longTermOrientation,
        indulgence,
      };
    }
  );
  writeFileSync(
    './src/data/countries.json',
    JSON.stringify(countries, null, 2)
  );
};

main().catch((error) => console.error(error));
