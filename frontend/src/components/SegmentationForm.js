import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  CircularProgress,
} from "@mui/material";

const algorithmOptions = [
  { value: "kmeans", label: "K-Means Clustering" },
  { value: "dbscan", label: "DBSCAN Clustering" },
];

const SegmentationForm = ({ setResult, setStatus, segmentationStatus }) => {
  const [algorithm, setAlgorithm] = useState("kmeans");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [nClusters, setNClusters] = useState(3);

  // Common styles for form inputs
  const commonInputStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(0, 0, 0, 0.42)",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "rgba(0, 0, 0, 0.87)",
        borderWidth: "1px",
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgba(25, 118, 210, 0.87)",
        borderWidth: "2px",
      },
    },
  };
  const [eps, setEps] = useState(0.5);
  const [minSamples, setMinSamples] = useState(5);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  // Boxplot feature selection and image state
  const [boxplotFeature, setBoxplotFeature] = useState("");
  const [boxplotImg, setBoxplotImg] = useState(null);
  const [boxplotLoading, setBoxplotLoading] = useState(false);
  const [boxplotError, setBoxplotError] = useState(null);

  // Load available features from API
  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/segmentation/features"
        );
        setAvailableFeatures(response.data.features);
      } catch (error) {
        console.error("Error loading features:", error);
        // Fallback to basic features if API fails
        setAvailableFeatures([
          { value: "Age", label: "Age", type: "numeric" },
          {
            value: "Items Purchased",
            label: "Items Purchased",
            type: "numeric",
          },
          { value: "Average Rating", label: "Average Rating", type: "numeric" },
          {
            value: "Discount Applied",
            label: "Discount Applied",
            type: "numeric",
          },
          {
            value: "Days Since Last Purchase",
            label: "Days Since Last Purchase",
            type: "numeric",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, []);

  // Remove boxplot button and instead fetch boxplot after segmentation
  useEffect(() => {
    // Only fetch boxplot if segmentation was successful, KMeans is selected, and a boxplot feature is chosen
    if (
      segmentationStatus === "success" &&
      algorithm === "kmeans" &&
      selectedFeatures.length > 0 &&
      boxplotFeature
    ) {
      setBoxplotLoading(true);
      setBoxplotError(null);
      setBoxplotImg(null);
      axios
        .post("http://127.0.0.1:8000/segmentation/boxplot", {
          features: selectedFeatures,
          n_clusters: nClusters,
          feature_to_plot: boxplotFeature,
        })
        .then((res) => setBoxplotImg(res.data.image_base64))
        .catch(() => setBoxplotError("Could not fetch boxplot."))
        .finally(() => setBoxplotLoading(false));
    } else {
      setBoxplotImg(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    segmentationStatus,
    algorithm,
    selectedFeatures,
    nClusters,
    boxplotFeature,
  ]);

  const handleFeatureChange = (event) => {
    const value = event.target.value;
    setSelectedFeatures(typeof value === "string" ? value.split(",") : value);
  };

  const handleAlgorithmChange = (event) => {
    setAlgorithm(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFeatures.length < 2) {
      setResult({ error: "Please select at least 2 features for clustering." });
      return;
    }

    if (setStatus) setStatus("loading");
    try {
      const endpoint =
        algorithm === "kmeans"
          ? "/segmentation/kmeans"
          : "/segmentation/dbscan";
      const payload =
        algorithm === "kmeans"
          ? { features: selectedFeatures, n_clusters: nClusters }
          : { features: selectedFeatures, eps: eps, min_samples: minSamples };

      const res = await axios.post(`http://127.0.0.1:8000${endpoint}`, payload);
      setResult({
        assignments: res.data.assignments,
        stats: res.data.stats,
        algorithm: algorithm,
        features: selectedFeatures,
      });
    } catch (err) {
      setResult({
        error: "Error: " + (err.response?.data?.detail || err.message),
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Customer Segmentation
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel sx={{ color: "rgba(0, 0, 0, 0.87)" }}>
            Clustering Algorithm
          </InputLabel>
          <Select
            value={algorithm}
            onChange={handleAlgorithmChange}
            label="Clustering Algorithm"
            sx={{
              color: "rgba(0, 0, 0, 0.87)",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.42)",
                  borderWidth: "1px",
                },
                "& input": {
                  fontSize: "0.95rem",
                  color: "#222",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.87)",
                  borderWidth: "1px",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgba(25, 118, 210, 0.87)",
                  borderWidth: "2px",
                },
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.95rem",
                color: "#222",
              },
            }}
            InputLabelProps={{ style: { color: "#222", opacity: 1 } }}
          >
            {algorithmOptions.map((opt) => (
              <MenuItem
                key={opt.value}
                value={opt.value}
                sx={{ color: "rgba(0, 0, 0, 0.87)" }}
              >
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel sx={{ color: "rgba(0, 0, 0, 0.87)" }}>
            Features for Clustering
          </InputLabel>
          <Select
            multiple
            value={selectedFeatures}
            onChange={handleFeatureChange}
            input={<OutlinedInput label="Features for Clustering" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => {
                  const feature = availableFeatures.find(
                    (f) => f.value === value
                  );
                  return (
                    <Chip
                      key={value}
                      label={feature?.label || value}
                      size="small"
                    />
                  );
                })}
              </Box>
            )}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#e0e0e0' },
                '& input': { fontSize: '0.95rem', color: '#222' },
                '&:hover fieldset': { borderColor: '#e0e0e0' },
                '&.Mui-focused fieldset': { borderColor: '#e0e0e0' }
              },
              '& .MuiInputLabel-root': { fontSize: '0.95rem', color: '#222' }
            }}
            InputLabelProps={{ style: { color: '#222', opacity: 1 } }}
          >
            {availableFeatures.map((feature) => (
              <MenuItem key={feature.value} value={feature.value}>
                <Checkbox
                  checked={selectedFeatures.indexOf(feature.value) > -1}
                />
                <ListItemText primary={feature.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {algorithm === "kmeans" && (
          <TextField
            label="Number of Clusters"
            type="number"
            value={nClusters}
            onChange={(e) => setNClusters(parseInt(e.target.value))}
            inputProps={{
              min: 2,
              max: 10,
              style: { color: "#222", fontSize: "0.95rem" },
            }}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: "#222", fontSize: "0.95rem" } }}
            InputProps={{ style: { color: "#222", fontSize: "0.95rem" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "& input": {
                  fontSize: "0.95rem",
                  color: "#222",
                },
                "&:hover fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#e0e0e0",
                },
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.95rem",
                color: "#222",
              },
            }}
          />
        )}

        {algorithm === "dbscan" && (
          <>
            <TextField
              label="Epsilon (eps)"
              type="number"
              value={eps}
              onChange={(e) => setEps(parseFloat(e.target.value))}
              inputProps={{
                min: 0.1,
                max: 2.0,
                step: 0.1,
                style: { color: "#222", fontSize: "0.95rem" },
              }}
              fullWidth
              margin="normal"
              helperText="Maximum distance between points to be considered neighbors"
              InputLabelProps={{
                style: { color: "#222", fontSize: "0.95rem" },
              }}
              InputProps={{ style: { color: "#222", fontSize: "0.95rem" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "& input": {
                    fontSize: "0.95rem",
                    color: "#222",
                  },
                  "&:hover fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#e0e0e0",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.95rem",
                  color: "#222",
                },
              }}
            />
            <TextField
              label="Min Samples"
              type="number"
              value={minSamples}
              onChange={(e) => setMinSamples(parseInt(e.target.value))}
              inputProps={{
                min: 2,
                max: 20,
                style: { color: "#222", fontSize: "0.95rem" },
              }}
              fullWidth
              margin="normal"
              helperText="Minimum number of samples to form a core point"
              InputLabelProps={{
                style: { color: "#222", fontSize: "0.95rem" },
              }}
              InputProps={{ style: { color: "#222", fontSize: "0.95rem" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "& input": {
                    fontSize: "0.95rem",
                    color: "#222",
                  },
                  "&:hover fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#e0e0e0",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.95rem",
                  color: "#222",
                },
              }}
            />
          </>
        )}

        {/* Boxplot Feature Selector (only for KMeans and if features selected) */}
        {algorithm === "kmeans" && selectedFeatures.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel style={{ color: "#222", fontSize: "0.95rem" }}>
              Feature for Boxplot
            </InputLabel>
            <Select
              value={boxplotFeature}
              onChange={(e) => setBoxplotFeature(e.target.value)}
              label="Feature for Boxplot"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "& input": {
                    fontSize: "0.95rem",
                    color: "#222",
                  },
                  "&:hover fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#e0e0e0",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.95rem",
                  color: "#222",
                },
              }}
              InputLabelProps={{ style: { color: "#222", opacity: 1 } }}
            >
              {selectedFeatures
                .filter((value) => {
                  const feature = availableFeatures.find(
                    (f) => f.value === value
                  );
                  return feature && feature.type === "numeric";
                })
                .map((value) => {
                  const feature = availableFeatures.find(
                    (f) => f.value === value
                  );
                  return (
                    <MenuItem key={value} value={value}>
                      {feature?.label || value}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={selectedFeatures.length < 2}
        >
          Run Segmentation
        </Button>
        {segmentationStatus === "success" && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              You may need to scroll down to see results.
            </Typography>
          </Box>
        )}
      </form>

      {/* Boxplot Button and Image */}
      {algorithm === "kmeans" &&
        selectedFeatures.length > 0 &&
        boxplotFeature && (
          <Box sx={{ mt: 3 }}>
            {boxplotLoading && <Typography>Loading boxplot...</Typography>}
            {boxplotError && (
              <Typography color="error" sx={{ mt: 2 }}>
                {boxplotError}
              </Typography>
            )}
            {boxplotImg && !boxplotLoading && (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <img
                  src={`data:image/png;base64,${boxplotImg}`}
                  alt="Boxplot"
                  style={{
                    maxWidth: "100%",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                />
              </Box>
            )}
          </Box>
        )}
    </Box>
  );
};

export default SegmentationForm;
