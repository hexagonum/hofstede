import {
  Button,
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
  TextField,
  Typography,
} from '@mui/material';
import Container from '@mui/material/Container';
import { NextPage } from 'next';
import { FormEvent, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import countries from '../data/countries.json';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';

const randomNumber = () => Math.floor(Math.random() * 100);

const fallbackCountry = {
  id: 0,
  country: 'Country',
  powerDistance: -1,
  individualism: -1,
  masculinity: -1,
  uncertaintyAvoidance: -1,
  longTermOrientation: -1,
  indulgence: -1,
};

const labels = [
  'Power Distance',
  'Individualism',
  'Masculinity',
  'Uncertainty Avoidance',
  'Long Term Orientation',
  'Indulgence',
];

const firstDataset: ChartDataset<'bar', number[]> = {
  data: [],
  label: 'You',
  borderRadius: 50,
  backgroundColor: 'rgba(32, 214, 155, 1)',
  barPercentage: 0.3,
  categoryPercentage: 0.5,
};

const secondDataset: ChartDataset<'bar', number[]> = {
  data: [],
  label: 'Country',
  borderRadius: 50,
  backgroundColor: 'rgba(1, 98, 255, 1)',
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

  const [countryId, setCountryId] = useState<number>(537);
  const [scales, setScales] = useState<Scales>({
    powerDistance: randomNumber(),
    individualism: randomNumber(),
    masculinity: randomNumber(),
    uncertaintyAvoidance: randomNumber(),
    longTermOrientation: randomNumber(),
    indulgence: randomNumber(),
  });

  const [data, setData] = useState<{
    chart: ChartData<'bar', number[], string> | null;
    rankings: Ranking[];
  }>({
    chart: null,
    rankings: [],
  });

  useEffect(() => {
    const country =
      countries.find((country) => country.id === countryId) || fallbackCountry;
    const rankings = processRankings(scales);
    setData({
      chart: {
        labels,
        datasets: [
          {
            ...firstDataset,
            data: [
              scales.powerDistance,
              scales.individualism,
              scales.masculinity,
              scales.uncertaintyAvoidance,
              scales.longTermOrientation,
              scales.indulgence,
            ],
          },
          {
            ...secondDataset,
            label: country.country || 'Country',
            data: [
              country.powerDistance,
              country.individualism,
              country.masculinity,
              country.uncertaintyAvoidance,
              country.longTermOrientation,
              country.indulgence,
            ],
          },
        ],
      },
      rankings: rankings,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (newCountryId: number) => {
    const newDatasets = [
      {
        ...firstDataset,
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

    if (newCountryId !== 0) {
      const country =
        countries.find((country) => country.id === newCountryId) ||
        fallbackCountry;
      newDatasets.push({
        ...secondDataset,
        label: country.country || 'Country',
        data: [
          country.powerDistance,
          country.individualism,
          country.masculinity,
          country.uncertaintyAvoidance,
          country.longTermOrientation,
          country.indulgence,
        ],
      });
    }

    console.log(newCountryId);
    console.log(newDatasets);

    const rankings = processRankings(scales);
    setData({ chart: { labels, datasets: newDatasets }, rankings });
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
                    onChange(countryId);
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
                          value={countryId}
                          label="Country"
                          onChange={(event) => {
                            const value = event.target.value;
                            if (value === '') return;
                            const newCountryId = parseInt(
                              value.toString() || '0',
                              10
                            );
                            setCountryId(() => {
                              onChange(newCountryId);
                              return newCountryId;
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
                          onChange(countryId);
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
                          onChange(countryId);
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
                          onChange(countryId);
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
                          onChange(countryId);
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
                          onChange(countryId);
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
                          onChange(countryId);
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
