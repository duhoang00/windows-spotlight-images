import Head from "next/head";
import { useState, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

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
  Checkbox,
  Button,
} from "@mui/material";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export default function Home() {
  const [machineName, setMachineName] = useState(undefined);
  const [imageSource, setImageSource] = useState([]);
  const [filterValue, setFilterValue] = useState("horizontal");
  const [checkedItemIds, setCheckedItemIds] = useState([]);

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
                id: `${getRandomInt(9999)}_${img.width}`,
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

  async function download() {
    let zip = new JSZip();

    let arrOfFiles = imageSource.filter((image) =>
      checkedItemIds.includes(image.id)
    );

    if (arrOfFiles.length === 0) return;

    await arrOfFiles.map((file) => {
      zip.file(
        `wsi_${file.id}_${file.width}_${file.height}.png`,
        file.src.split(",")[1],
        {
          base64: true,
        }
      );
    });

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "wsi.zip");
    });
  }

  return (
    <div>
      <Head>
        <title>WSI - Windows spotlight images</title>
        <meta name="wsi" content="Windows spotlight images" />
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
            <Box
              sx={{
                m: 6,
                p: 2,
                position: "relative",
                bgcolor: "#dddddd",
                borderRadius: "5px",
              }}
            >
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Select
                  value={filterValue}
                  label="filter"
                  onChange={(event) => {
                    setFilterValue(event.target.value);
                  }}
                >
                  <MenuItem value={"all"}>All</MenuItem>
                  <MenuItem value={"horizontal"}>Horizontal</MenuItem>
                  <MenuItem value={"vertical"}>Vertical</MenuItem>
                  <MenuItem value={"square"}>Square</MenuItem>
                </Select>
                {checkedItemIds.length > 0 && (
                  <Button variant="contained" onClick={download}>
                    Download
                  </Button>
                )}
              </Stack>
              <Stack justifyContent="center" alignItems="center">
                <ImageList
                  sx={{ width: "100%" }}
                  cols={3}
                  rowHeight={200}
                  variant="masonry"
                >
                  {imageSource.map((item, index) => (
                    <ImageListItem
                      key={item.id}
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
                        actionIcon={
                          <Checkbox
                            sx={{
                              color: "white",
                              "&.Mui-checked": {
                                color: "white",
                              },
                            }}
                            checked={checkedItemIds.includes(item.id)}
                            onChange={(event) => {
                              checkedItemIds.includes(item.id)
                                ? setCheckedItemIds(
                                    checkedItemIds.filter((i) => i !== item.id)
                                  )
                                : setCheckedItemIds([
                                    ...checkedItemIds,
                                    item.id,
                                  ]);
                            }}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Stack>
            </Box>
          )}
        </Container>
      </main>
    </div>
  );
}
