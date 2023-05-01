"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridRowModesModel, GridRowsProp, GridActionsCellItem, GridRowId, GridRowModel, GridEventListener, GridRowModes, GridToolbarContainer, MuiEvent, GridRowParams, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { data as ImportData } from "./data.js";
import { RenderCellExpand } from './renderCellExpand';
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
function randomInteger() {
  var retval = Math.floor(Math.random() * 90000) + 10000;

  console.log("randomInteger generated " + retval);
  return retval;
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const key = randomInteger();
    setRows((oldRows) => [
      ...oldRows,
      { fdcId: key, description: "1", ndbNumber: 1, publicationDate: "01/05/23", foodPortions: [], nutrientConversionFactors: [], foodNutrients: [], isNew: true }
    ]);

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [key]: { mode: GridRowModes.Edit, fieldToFocus: "description" }
    }));
  };

  return (
    <GridToolbarContainer>
      <GridToolbarExport />

      <GridToolbarQuickFilter />

      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>


    </GridToolbarContainer>
  );
}

export default function Home() {

  const updatedData = ImportData.FoundationFoods.map((item) => {
    const { fdcId, description, ndbNumber, publicationDate, foodPortions, nutrientConversionFactors, foodNutrients } = item;


    var updatedFoodPortions = ` `;
    foodPortions.map((item) => {
      updatedFoodPortions = updatedFoodPortions.concat(`${item.sequenceNumber} ${item.measureUnit.abbreviation} : ${item.gramWeight}gm, \n`);
    });

    const foundObj = nutrientConversionFactors.find((item) => item.type == ".CalorieConversionFactor");
    const updatedNutrientConversionFactors = `Protein: ${foundObj?.proteinValue} Fat: ${foundObj?.fatValue} Carbohydrate: ${foundObj?.carbohydrateValue} `;


    var updatedFoodNutrients = ` `;
    foodNutrients.map((item) => {
      updatedFoodNutrients = updatedFoodNutrients.concat(`${item.nutrient.name}: ${item.nutrient.number} ${item.nutrient.unitName}, \n`);
    });


    return {
      fdcId,
      description,
      ndbNumber,
      publicationDate,
      foodPortions: updatedFoodPortions,
      nutrientConversionFactors: updatedNutrientConversionFactors,
      foodNutrients: updatedFoodNutrients

    }
  });





  const [rows, setRows] = React.useState(updatedData);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.fdcId !== id));
  };


  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };


  const columns = [
    {
      field: 'fdcId',
      headerName: 'FDC Id',
      width: 80,
      type: 'number',
      editable: true
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 150,
      renderCell: RenderCellExpand,
      editable: true
    },
    {
      field: 'ndbNumber',
      headerName: 'NDB Number',
      width: 100,
      type: 'number',
      editable: true
    }
    , {
      field: 'publicationDate',
      headerName: 'Publication Date',
      width: 160,
      editable: true

    },
    {
      field: 'foodPortions',
      headerName: 'Food Portions',
      editable: true,
      width: 160,
      renderCell: RenderCellExpand,

    },
    {
      field: 'nutrientConversionFactors',
      headerName: 'P,C,F',
      editable: true,
      width: 160,

      renderCell: RenderCellExpand,

    },
    {
      field: 'foodNutrients',
      headerName: 'Food Nutrients',
      editable: true,
      width: 160,

      renderCell: RenderCellExpand,

    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }: { id: GridRowId }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              key="SaveIcon"
              onClick={handleSaveClick(id)}
            />,

          ];
        }

        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            key="DeleteIcon"
            color="inherit"
          />

        ];


      }
    }
  ];



  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };


  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    const updatedData = rows.map((row) =>
      row.fdcId === newRow.fdcId ? updatedRow : row
    );
    setRows(
      updatedData
    );
    return updatedRow;
  };




  return (
    <Box sx={{ height: 400, width: 1 }}>

      <DataGrid
        rows={rows}
        getRowId={(row) => row.fdcId}
        columns={columns}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector


        rowModesModel={rowModesModel}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        editMode="row"
        components={{
          Toolbar: EditToolbar
        }}
        componentsProps={{
          toolbar: {
            setRows, setRowModesModel,
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          }
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        experimentalFeatures={{ newEditingApi: true }}

      />
    </Box>
  );
}