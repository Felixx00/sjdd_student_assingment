import "./App.css";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import swal from "sweetalert";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

var flag_selected = 0;
var flag_pagina = 0;

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

let hospitals = [
  { name: "" },
  { name: "" },
  { name: "" },
  { name: "" },
  { name: "" },
];
let alumnes = [];

function leer_fichero(event) {
  //console.log(event.target.files);
  //console.log(event.target);
  let file = event.target.files[0];

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const lines = text.split("\n");
    let it = 0;
    lines.forEach(async (line) => {
      const columns = line.split(",");
      if (it < 2) {
        //Per a les dos inicials, hospital i plaçes
        let it2 = 0;
        columns.forEach((element) => {
          if (element !== "") {
            if (it === 0) {
              hospitals.push({ count_inicial: element, count_actual: element });
            } else {
              hospitals[it2].name = element;
            }
          }
          it2 += 1;
        });
      } else {
        //Cada estudiant
        if (line !== "") {
          //console.log(columns);
          alumnes.push({suspendidas: columns[0], nota: parseFloat(columns[1]), nombre: columns[2], apellido: columns[3], dni: columns[4], asignacion: 0, hospital: ''})
          let prioridades = columns;
          prioridades[0] = '';
          prioridades[1] = '';
          prioridades[2] = '';
          prioridades[3] = '';
          prioridades[4] = '';
          prioridades.forEach((x,index) => {
            prioridades[index] = x.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
            if(x !== ''){
              prioridades[index] = parseInt(x);
            }
          });
          console.log(prioridades)

          for (let i = 1; i < hospitals.length-4; i++) {
            let index = prioridades.indexOf(i);
            if(hospitals[index].count_actual > 0){
              console.log('Si');
              hospitals[index].count_actual -= 1;
              alumnes[alumnes.length - 1].asignacion = i;
              alumnes[alumnes.length - 1].hospital = hospitals[index].name;
              break;
            }else{
              console.log('next')
            }
          } 
          
        }
        
      }

      it += 1;
    });
    hospitals.forEach((e) => {
      //console.log(e);
    });
    alumnes.forEach((e) => {
      console.log(e);
    });
  };
  reader.readAsText(file);
}

function App() {
  let [selected, setSelected] = useState("");
  if (flag_pagina === 0) {
    return (
      <div className="App">
        <header className="App-header">
          <p style={{ fontSize: "60px" }}>SJDD Student Assignment</p>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload CSV file
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => {
                if (event.target.files[0].type === "text/csv") {
                  flag_selected = 1;
                  setSelected("Selected file: " + event.target.files[0].name);
                  leer_fichero(event);
                } else {
                  hospitals = [
                    { name: "" },
                    { name: "" },
                    { name: "" },
                    { name: "" },
                    { name: "" },
                  ];
                  setSelected("");
                  selected = "";
                  swal(
                    "You must select a CSV file",
                    "Something went wrong!",
                    "error"
                  );
                }
              }}
              multiple
            />
          </Button>
          <p style={{ fontSize: "12px" }}>{selected}</p>
          <Box sx={{ "& > :not(style)": { m: 1 } }}>
            <Fab
              color="success"
              aria-label="add"
              onClick={() => {
                if (flag_selected === 1) {
                  flag_pagina = 1;
                  flag_selected = 0;
                  setSelected("");
                  selected = "";
                } else {
                  swal(
                    "You must select a file",
                    "Something went wrong!",
                    "error"
                  );
                }
              }}
            >
              <ArrowForwardIcon />
            </Fab>
          </Box>
        </header>
      </div>
    );
  } else {
    return (
      <div>
        <div className="App-header-2">
          <div className="back">
            <Button
              className="back-butt"
              variant="outlined"
              startIcon={<ArrowBackIosIcon />}
              onClick={() => {
                flag_pagina = 0;
                flag_selected = 0;
                hospitals = [{}, {}, {}, {}, {}];
                setSelected(" ");
              }}
            >
              Back
            </Button>
          </div>

          <>
            {alumnes.map(function (data) {
              console.log(data);
              
                return (
                  <div key={data.apellido}>
                    Nota: {data.nota} - {data.nombre} - Asignat a: {data.hospital} - Con indice: {data.asignacion}
                  </div>
                );
              
            })}
          </>
          
        </div>
      </div>
    );
  }
}

export default App;

/*
{hospitals.map(function (data) {
              console.log(data);
              if (data.name !== "") {
                return (
                  <div key={data.name}>
                    {data.name} - Plaçes: {data.count_inicial}
                  </div>
                );
              } else {
                return <div key={Math.random()}></div>;
              }
            })}

*/