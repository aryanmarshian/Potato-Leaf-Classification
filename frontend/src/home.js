import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DropzoneArea } from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';
import Clear from '@material-ui/icons/Clear';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: '#59A735',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
    maxWidth: 500,
    textAlign: 'center',
    padding: theme.spacing(2),
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  },
  media: {
    width: '100%',
    height: 'auto',
    marginBottom: theme.spacing(2),
  },
  loader: {
    margin: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: '#59A735',
    color: 'white',
  },
}));

const ColorButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#59A735',
    color: 'white',
    '&:hover': {
      backgroundColor: '#4e9130',
    },
  },
}))(Button);

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendFile = async () => {
    if (selectedFile) {
      let formData = new FormData();
      formData.append('file', selectedFile);
      setIsLoading(true);
      try {
        let res = await axios.post(process.env.REACT_APP_API_URL, formData);
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const clearData = () => {
    setSelectedFile(null);
    setPreview(null);
    setData(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (preview) {
      sendFile();
    }
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(files[0]);
  };

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Potato Disease Classification
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.container}>
        <Card className={classes.card}>
          {!selectedFile && (
            <CardContent>
              <DropzoneArea
                acceptedFiles={['image/*']}
                dropzoneText={"Drag and drop an image of a potato plant leaf"}
                onChange={onSelectFile}
              />
            </CardContent>
          )}
          {preview && (
            <CardContent>
              <img src={preview} alt="Preview" className={classes.media} />
              {isLoading && <CircularProgress className={classes.loader} />}
              {data && (
                <Typography variant="h6">
                  Label: {data.predicted_class}
                </Typography>
              )}
              <ColorButton
                variant="contained"
                className={classes.button}
                onClick={clearData}
                startIcon={<Clear />}
              >
                Clear
              </ColorButton>
            </CardContent>
          )}
        </Card>
      </Container>
    </React.Fragment>
  );
};
