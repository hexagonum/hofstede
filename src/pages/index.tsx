import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Container from '@mui/material/Container';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { NextPage } from 'next';
import { FormEvent, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import countries from '../data/countries.json';

const randomNumber = () => Math.floor(Math.random() * 100);

type Country = {
  id: number;
  country: string;
  powerDistance: number;
  individualism: number;
  masculinity: number;
  uncertaintyAvoidance: number;
  longTermOrientation: number;
  indulgence: number;
};

const defaultCountry: Country = {
  id: 537,
  country: 'Vietnam',
  powerDistance: 70,
  individualism: 20,
  masculinity: 40,
  uncertaintyAvoidance: 30,
  longTermOrientation: 57,
  indulgence: 35,
};

const labels = [
  'Power Distance',
  'Individualism',
  'Masculinity',
  'Uncertainty Avoidance',
  'Long Term Orientation',
  'Indulgence',
];

const colors = ['#1E3888', '#47A8BD', '#F5E663', '#FFAD69', '#9C3848'];

const personalDataset: ChartDataset<'bar', number[]> = {
  data: [],
  label: 'You',
  borderRadius: 50,
  backgroundColor: colors[0],
  barPercentage: 0.3,
  categoryPercentage: 0.5,
};

const countryDataset: ChartDataset<'bar', number[]> = {
  data: [],
  label: 'Country',
  borderRadius: 50,
  backgroundColor: colors[1],
  barPercentage: 0.3,
  categoryPercentage: 0.5,
};

const barChartOptions: ChartOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as 'top',
      align: 'center' as 'center',
      labels: {
        boxWidth: 7,
        usePointStyle: true,
        pointStyle: 'circle',
      },
      title: {
        text: 'Comparison',
        display: true,
        color: '#000',
        font: { size: 18 },
      },
    },
  },
  scales: {
    y: { beginAtZero: true, max: 100 },
  },
};

type Scales = {
  powerDistance: number;
  individualism: number;
  masculinity: number;
  uncertaintyAvoidance: number;
  longTermOrientation: number;
  indulgence: number;
};

type Ranking = {
  country: string;
  powerDistance: number;
  individualism: number;
  masculinity: number;
  uncertaintyAvoidance: number;
  longTermOrientation: number;
  indulgence: number;
  pdiDiff: string | number;
  idvDiff: string | number;
  masDiff: string | number;
  uaiDiff: string | number;
  ltoDiff: string | number;
  indDiff: string | number;
  avgDiff: string | number;
};

const processRankings = (scales: Scales): Ranking[] => {
  const rankings = countries
    .map(
      ({
        country,
        powerDistance,
        individualism,
        masculinity,
        uncertaintyAvoidance,
        longTermOrientation,
        indulgence,
      }) => {
        const pdiDiff =
          powerDistance !== -1 ? powerDistance - scales.powerDistance : 'N/A';
        const idvDiff =
          individualism !== -1 ? individualism - scales.individualism : 'N/A';
        const masDiff =
          masculinity !== -1 ? masculinity - scales.masculinity : 'N/A';
        const uaiDiff =
          uncertaintyAvoidance !== -1
            ? uncertaintyAvoidance - scales.uncertaintyAvoidance
            : 'N/A';
        const ltoDiff =
          longTermOrientation !== -1
            ? longTermOrientation - scales.longTermOrientation
            : 'N/A';
        const indDiff =
          indulgence !== -1 ? indulgence - scales.indulgence : 'N/A';

        const allDiff: number[] = [
          pdiDiff,
          idvDiff,
          masDiff,
          uaiDiff,
          ltoDiff,
          indDiff,
        ].filter((number) => number !== 'N/A') as number[];

        const avgDiff = parseFloat(
          (
            allDiff.reduce((a, b) => Math.abs(a) + Math.abs(b), 0) /
            allDiff.length
          ).toFixed(2)
        );

        return {
          country: country,
          powerDistance,
          individualism,
          masculinity,
          uncertaintyAvoidance,
          longTermOrientation,
          indulgence,
          pdiDiff,
          idvDiff,
          masDiff,
          uaiDiff,
          ltoDiff,
          indDiff,
          avgDiff,
        };
      }
    )
    .sort((a, b) => {
      return a.avgDiff > b.avgDiff ? 1 : -1;
    });

  return rankings;
};

const HomePage: NextPage = () => {
  const year = new Date().getFullYear();

  const [countryIds, setCountryIds] = useState<number[]>([537]);
  const [scales, setScales] = useState<Scales>({
    powerDistance: defaultCountry.powerDistance,
    individualism: defaultCountry.individualism,
    masculinity: defaultCountry.masculinity,
    uncertaintyAvoidance: defaultCountry.uncertaintyAvoidance,
    longTermOrientation: defaultCountry.longTermOrientation,
    indulgence: defaultCountry.indulgence,
  });

  const [data, setData] = useState<{
    chart: ChartData<'bar', number[], string> | null;
    rankings: Ranking[];
  }>({
    chart: null,
    rankings: [],
  });

  useEffect(() => {
    onChange(countryIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (newCountryIds: string | number[]) => {
    let selectedCountryIds = newCountryIds;
    if (typeof newCountryIds === 'string') {
      selectedCountryIds = newCountryIds
        .split(',')
        .map((value) => parseInt(value, 10));
    }
    const selectedCountries: Country[] = countries.filter((country) =>
      (selectedCountryIds as number[]).includes(country.id)
    );

    const rankings = processRankings(scales);
    const newDatasets = [
      {
        ...personalDataset,
        data: [
          scales.powerDistance,
          scales.individualism,
          scales.masculinity,
          scales.uncertaintyAvoidance,
          scales.longTermOrientation,
          scales.indulgence,
        ],
      },
    ];

    const total = selectedCountries.length > 4 ? 4 : selectedCountries.length;
    for (let i = 0; i < total; i++) {
      const country = selectedCountries[i];
      const backgroundColor = colors[i + 1];
      newDatasets.push({
        ...countryDataset,
        backgroundColor,
        label: country?.country || 'Country',
        data: [
          country?.powerDistance || 0,
          country?.individualism || 0,
          country?.masculinity || 0,
          country?.uncertaintyAvoidance || 0,
          country?.longTermOrientation || 0,
          country?.indulgence || 0,
        ],
      });
    }

    setData({
      chart: {
        labels,
        datasets: newDatasets,
      },
      rankings: rankings,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b">
        <Container>
          <div className="py-4">
            <h1 className="uppercase font-bold text-xl">Hofstede</h1>
          </div>
        </Container>
      </nav>
      <main className="grow">
        <Container>
          <div className="py-8">
            <Paper className="border">
              <div className="p-8">
                <form
                  onSubmit={(event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    onChange(countryIds);
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="col-span-full">
                      <FormControl fullWidth>
                        <InputLabel id="country-select-label">
                          Country
                        </InputLabel>
                        <Select
                          size="small"
                          labelId="country-select-label"
                          id="country-select"
                          value={countryIds}
                          label="Country"
                          multiple
                          onChange={(event) => {
                            const newCountryIds = event.target.value;

                            setCountryIds(() => {
                              onChange(newCountryIds);
                              return newCountryIds as number[];
                            });
                          }}
                        >
                          {countries.map((country) => {
                            return (
                              <MenuItem key={country.id} value={country.id}>
                                {country.country}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-span-1">
                      <Typography>
                        Power Distance ({scales.powerDistance})
                      </Typography>
                      <Slider
                        aria-label="Power Distance"
                        step={1}
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                        marks={[
                          { value: 0, label: '0' },
                          { value: 100, label: '100' },
                        ]}
                        value={scales.powerDistance}
                        onChange={(_event, newValue: number | number[]) => {
                          setScales({
                            ...scales,
                            powerDistance:
                              typeof newValue === 'object'
                                ? newValue[0]
                                : newValue,
                          });
                          onChange(countryIds);
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <Typography>
                        Individualism ({scales.individualism})
                      </Typography>
                      <Slider
                        aria-label="Individualism"
                        step={1}
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                        marks={[
                          { value: 0, label: '0' },
                          { value: 100, label: '100' },
                        ]}
                        value={scales.individualism}
                        onChange={(_event, newValue: number | number[]) => {
                          setScales({
                            ...scales,
                            individualism:
                              typeof newValue === 'object'
                                ? newValue[0]
                                : newValue,
                          });
                          onChange(countryIds);
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <Typography>
                        Masculinity ({scales.masculinity})
                      </Typography>
                      <Slider
                        aria-label="Masculinity"
                        step={1}
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                        marks={[
                          { value: 0, label: '0' },
                          { value: 100, label: '100' },
                        ]}
                        value={scales.masculinity}
                        onChange={(_event, newValue: number | number[]) => {
                          setScales({
                            ...scales,
                            masculinity:
                              typeof newValue === 'object'
                                ? newValue[0]
                                : newValue,
                          });
                          onChange(countryIds);
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <Typography>
                        Uncertainty Avoidance ({scales.uncertaintyAvoidance})
                      </Typography>
                      <Slider
                        aria-label="Uncertainty Avoidance"
                        step={1}
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                        marks={[
                          { value: 0, label: '0' },
                          { value: 100, label: '100' },
                        ]}
                        value={scales.uncertaintyAvoidance}
                        onChange={(_event, newValue: number | number[]) => {
                          setScales({
                            ...scales,
                            uncertaintyAvoidance:
                              typeof newValue === 'object'
                                ? newValue[0]
                                : newValue,
                          });
                          onChange(countryIds);
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <Typography>
                        Long Term Orientation ({scales.longTermOrientation})
                      </Typography>
                      <Slider
                        aria-label="Long-term Orientation"
                        step={1}
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                        marks={[
                          { value: 0, label: '0' },
                          { value: 100, label: '100' },
                        ]}
                        value={scales.longTermOrientation}
                        onChange={(_event, newValue: number | number[]) => {
                          setScales({
                            ...scales,
                            longTermOrientation:
                              typeof newValue === 'object'
                                ? newValue[0]
                                : newValue,
                          });
                          onChange(countryIds);
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <Typography>Indulgence ({scales.indulgence})</Typography>
                      <Slider
                        aria-label="Indulgence"
                        step={1}
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                        marks={[
                          { value: 0, label: '0' },
                          { value: 100, label: '100' },
                        ]}
                        value={scales.indulgence}
                        onChange={(_event, newValue: number | number[]) => {
                          setScales({
                            ...scales,
                            indulgence:
                              typeof newValue === 'object'
                                ? newValue[0]
                                : newValue,
                          });
                          onChange(countryIds);
                        }}
                      />
                    </div>
                  </div>
                </form>
                <div className="py-8">
                  {data.chart !== null ? (
                    <Bar
                      data={data.chart}
                      height={300}
                      options={barChartOptions as any}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <TableContainer className="border rounded">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>Country</TableCell>
                        <TableCell>Power Distance</TableCell>
                        <TableCell>Individualism</TableCell>
                        <TableCell>Masculinity</TableCell>
                        <TableCell>Uncertainty Avoidance</TableCell>
                        <TableCell>Long Term Orientation</TableCell>
                        <TableCell>Indulgence</TableCell>
                        <TableCell>Difference</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.rankings.map((ranking, index: number) => {
                        return (
                          <TableRow key={ranking.country}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{ranking.country}</TableCell>
                            <TableCell>
                              {ranking.powerDistance}{' '}
                              <span
                                className={
                                  typeof ranking.pdiDiff === 'number' &&
                                  ranking.pdiDiff >= 0
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                }
                              >
                                ({ranking.pdiDiff})
                              </span>
                            </TableCell>
                            <TableCell>
                              {ranking.individualism}{' '}
                              <span
                                className={
                                  typeof ranking.idvDiff === 'number' &&
                                  ranking.idvDiff >= 0
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                }
                              >
                                ({ranking.idvDiff})
                              </span>
                            </TableCell>
                            <TableCell>
                              {ranking.masculinity}{' '}
                              <span
                                className={
                                  typeof ranking.masDiff === 'number' &&
                                  ranking.masDiff >= 0
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                }
                              >
                                ({ranking.masDiff})
                              </span>
                            </TableCell>
                            <TableCell>
                              {ranking.uncertaintyAvoidance}{' '}
                              <span
                                className={
                                  typeof ranking.uaiDiff === 'number' &&
                                  ranking.uaiDiff >= 0
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                }
                              >
                                ({ranking.uaiDiff})
                              </span>
                            </TableCell>
                            <TableCell>
                              {ranking.longTermOrientation}{' '}
                              <span
                                className={
                                  typeof ranking.ltoDiff === 'number' &&
                                  ranking.ltoDiff >= 0
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                }
                              >
                                ({ranking.ltoDiff})
                              </span>
                            </TableCell>
                            <TableCell>
                              {ranking.indulgence}{' '}
                              <span
                                className={
                                  typeof ranking.indDiff === 'number' &&
                                  ranking.indDiff >= 0
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                }
                              >
                                ({ranking.indDiff})
                              </span>
                            </TableCell>
                            <TableCell>{ranking.avgDiff}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Paper>
          </div>
        </Container>
      </main>
      <footer className="border-t">
        <Container>
          <div className="py-4">
            <h1 className="uppercase text-gray-700">&copy; {year} Hofstede</h1>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
