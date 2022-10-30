import Head from "next/head";
import { useState, useEffect } from "react";

import {
  TextField,
  Container,
  Stack,
  Paper,
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Select,
  MenuItem,
} from "@mui/material";

export default function Home() {
  const [machineName, setMachineName] = useState(undefined);
  const [imageSource, setImageSource] = useState([]);
  const [filterValue, setFilterValue] = useState("horizontal");

  function onChangeMachineName(event) {
    setMachineName(event.target.value);
  }

  function onChangeChosenFiles() {
    const files = document.querySelector("input[type=file]").files;

    if (files) {
      Array.prototype.forEach.call(files, addSrc);
    }

    function addSrc(file) {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        (event) => {
          const result = reader.result;

          let img = document.createElement("img");
          img.setAttribute("src", result);

          img.onload = function () {
            setImageSource((prevState) => [
              ...prevState,
              {
                src: result,
                size: parseFloat(event.loaded / 1024 / 1000).toFixed(2),
                width: img.width,
                height: img.height,
                orientation:
                  img.width === img.height
                    ? "square"
                    : img.width > img.height
                    ? "horizontal"
                    : "vertical",
              },
            ]);
          };
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }

  useEffect(() => {
    console.log("img", imageSource);
  }, [imageSource]);

  return (
    <div>
      <Head>
        <title>WSI</title>
        <meta name="wsi" content="WSI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container>
          <Stack justifyContent="center" alignItems="center">
            <h1>Windows spotlight images</h1>
          </Stack>

          <Stack direction="row" justifyContent="center" alignItems="center">
            <h3>Get started by getting your</h3>
            <TextField
              size="small"
              sx={{ mx: 1 }}
              label="machine name"
              onChange={onChangeMachineName}
            />
          </Stack>

          <Stack sx={{ m: 5, textAlign: "center" }}>
            {machineName ? (
              <div>
                <b>Your url</b>
                <p>Copy and paste into file url</p>
                <Paper sx={{ p: 5, bgcolor: "#dddddd" }}>
                  {machineName && (
                    <div>
                      C:/Users/
                      <b>{machineName}</b>
                      /AppData/Local/Packages/Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy/LocalState/Assets
                    </div>
                  )}
                </Paper>
              </div>
            ) : (
              <b>Please input machine name</b>
            )}
          </Stack>

          {machineName && (
            <Stack sx={{ m: 5, textAlign: "center" }}>
              <b>Please choose all files</b>
              <Paper sx={{ p: 5, m: 1, bgcolor: "#dddddd" }}>
                <input
                  id="browse"
                  type="file"
                  onChange={onChangeChosenFiles}
                  multiple
                />
              </Paper>
            </Stack>
          )}

          {imageSource.length > 0 && (
            <Stack
              sx={{
                m: 6,
                textAlign: "center",
                position: "relative",
                alignItems: "center",
                bgcolor: "#dddddd",
                borderRadius: "5px",
              }}
            >
              <Select
                value={filterValue}
                label="filter"
                onChange={(event) => {
                  setFilterValue(event.target.value);
                }}
                sx={{ mt: 1 }}
              >
                <MenuItem value={"all"}>All</MenuItem>
                <MenuItem value={"horizontal"}>Horizontal</MenuItem>
                <MenuItem value={"vertical"}>Vertical</MenuItem>
                <MenuItem value={"square"}>Square</MenuItem>
              </Select>
              <ImageList
                sx={{ width: "90%" }}
                cols={3}
                rowHeight={164}
                variant="masonry"
              >
                {imageSource.map((item, index) => (
                  <ImageListItem
                    key={index}
                    sx={{
                      display:
                        filterValue === "all" ||
                        item.orientation === filterValue
                          ? "block"
                          : "none",
                    }}
                  >
                    <img
                      src={item.src}
                      alt=""
                      style={{ borderRadius: "5px" }}
                    />
                    <ImageListItemBar
                      title={`W:${item.width} x H:${item.height}`}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Stack>
          )}
        </Container>
      </main>
    </div>
  );
}
