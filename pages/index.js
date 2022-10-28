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
} from "@mui/material";

export default function Home() {
  const [machineName, setMachineName] = useState(undefined);
  const [imageSource, setImageSource] = useState([]);

  function onChangeMachineName(event) {
    setMachineName(event.target.value);
  }

  function onChangeChosenFiles() {
    const files = document.querySelector("input[type=file]").files;

    function addSrc(file) {
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        () => {
          setImageSource((prevState) => [...prevState, reader.result]);
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    }

    if (files) {
      Array.prototype.forEach.call(files, addSrc);
    }
  }

  useEffect(() => {
    console.log("src", imageSource);
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
                <Paper sx={{ p: 5 }}>
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
              <Paper sx={{ p: 5, m: 1 }}>
                <input
                  id="browse"
                  type="file"
                  onChange={onChangeChosenFiles}
                  multiple
                />
              </Paper>
            </Stack>
          )}

          {imageSource && (
            <Stack
              sx={{
                m: 5,
                textAlign: "center",
                position: "relative",
                alignItems: "center",
              }}
            >
              <ImageList cols={3} rowHeight={164} variant="quilted">
                {imageSource.map((item, index) => (
                  <ImageListItem key={index}>
                    <img src={item} alt="" />
                  </ImageListItem>
                ))}
              </ImageList>
            </Stack>
          )}
        </Container>
      </main>

      <Box
        sx={{
          p: 2,
          textAlign: "center",
          position: "absolute",
          bottom: 0,
          width: "-webkit-fill-available",
        }}
      >
        <a href="/" target="_blank" rel="noopener noreferrer">
          Powered by Du Hoang
        </a>
      </Box>
    </div>
  );
}
