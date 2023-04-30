"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Stack } from '@mui/material';
import { data } from "./data.js";
import { RenderCellExpand } from './renderCellExpand';

export default function Home() {

  const columns = [
    {
      field: 'fdcId',
      headerName: 'FDC Id',
      width: 80,
      type: 'number'
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 150,
      renderCell: RenderCellExpand,
    },
    {
      field: 'ndbNumber',
      headerName: 'NDB Number',
      width: 100,
      type: 'number'
    }
    , {
      field: 'publicationDate',
      headerName: 'Publication Date',
      width: 160,

    },
    {
      field: 'foodPortions',
      headerName: 'Food Portions',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params: any) => {
        const data = params.row.foodPortions;
        var text1 = ` `;
        data.map((item: any) => {
          text1 = text1.concat(`${item.sequenceNumber} ${item.measureUnit.abbreviation} : ${item.gramWeight}gm, \n`);
        });

        return text1;
      },
      renderCell: RenderCellExpand,

    },
    {
      field: 'nutrientConversionFactors',
      headerName: 'P,C,F',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params: any) => {
        const data = params.row.nutrientConversionFactors.filter((item: any) => item.type == ".CalorieConversionFactor");
        var text1 = `Protein: ${data.proteinValue} Fat: ${data.fatValue} Carbohydrate: ${data.carbohydrateValue} `;


        return text1;
      },
      renderCell: RenderCellExpand,

    },
    {
      field: 'foodNutrients',
      headerName: 'Food Nutrients',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params: any) => {
        const data = params.row.foodNutrients;
        var text1 = ` `;
        data.map((item: any) => {
          text1 = text1.concat(`${item.nutrient.name}: ${item.nutrient.number} ${item.nutrient.unitName}, \n`);
        });

        return text1;
      },
      renderCell: RenderCellExpand,

    },
  ];

  const [rows, setRows] = React.useState(data.FoundationFoods);

  const handleAddRow = () => {
    setRows((prevRows) => [...prevRows, rows[Math.floor(Math.random() * 10)]]);
  };


  return (
    <Box sx={{ height: 400, width: 1 }}>
      <Stack direction="row" spacing={1}>
        <Button size="small" onClick={handleAddRow}>
          Add a row
        </Button>
      </Stack>
      <DataGrid
        rows={rows}
        getRowId={(row) => row.fdcId}
        columns={columns}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />
    </Box>
  );
}