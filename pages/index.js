import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import {
  Input,
  TextField,
  Button,
  Container,
  Stack,
  Paper,
  Box,
} from "@mui/material";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const [machineName, setMachineName] = useState(undefined);
  const [wsiUrl, setWsiUrl] = useState(undefined);

  function onChangeMachineName(event) {
    setMachineName(event.target.value);
  }

  function onChangeChosenFiles() {
    const preview = document.querySelector("img");
    const file = document.querySelector("input[type=file]").files[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        console.log("result", reader.result);
        // convert image file to base64 string
        preview.src = reader.result;
      },
      false
    );

    if (file) {
      console.log("file", file);
      reader.readAsDataURL(file);
    }
  }

  useEffect(() => {
    setWsiUrl(
      `C:/Users/${machineName}/AppData/Local/Packages/Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy/LocalState/Assets`
    );
  }, [machineName]);

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

          <Stack
            sx={{
              m: 5,
              textAlign: "center",
              position: "relative",
            }}
          >
            <img src="" height="200" alt="Image preview" />
          </Stack>
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
