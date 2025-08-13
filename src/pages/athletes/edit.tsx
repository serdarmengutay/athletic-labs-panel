import type { HttpError } from "@refinedev/core";
import { Edit, useAutocomplete } from "@refinedev/mui";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useForm } from "@refinedev/react-hook-form";

import { Controller } from "react-hook-form";

import type { IAthlete, Nullable } from "../../interfaces";

export const AthleteEdit: React.FC = () => {
  const {
    saveButtonProps,
    refineCore: { query: queryResult },
    register,
    control,
    formState: { errors },
  } = useForm<IAthlete, HttpError, Nullable<IAthlete>>();
  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <Controller
          control={control}
          name="athleteName"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.athleteName}
              helperText={errors.athleteName?.message}
              margin="normal"
              fullWidth
              label="Adı Soyadı"
              autoFocus
            />
          )}
        />
        <Controller
          control={control}
          name="athleteBirthDate"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.athleteBirthDate}
              helperText={errors.athleteBirthDate?.message}
              margin="normal"
              label="Doğum Tarihi"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="height"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.height}
              helperText={errors.height?.message}
              margin="normal"
              label="Boy"
              type="number"
            />
          )}
        />
        <Controller
          control={control}
          name="weight"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.weight}
              helperText={errors.weight?.message}
              margin="normal"
              label="Kilo"
              type="number"
            />
          )}
        />
        <Controller
          control={control}
          name="speedRun"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.speedRun}
              helperText={errors.speedRun?.message}
              margin="normal"
              label="30 Metre"
              type="number"
            />
          )}
        />
        <Controller
          control={control}
          name="secondSpeedRun"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.secondSpeedRun}
              helperText={errors.secondSpeedRun?.message}
              margin="normal"
              label="İkinci 30 Metre"
              type="number"
            />
          )}
        />
        <Controller
          control={control}
          name="agilityRun"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.agilityRun}
              helperText={errors.agilityRun?.message}
              margin="normal"
              label="Çeviklik Koşusu"
              type="number"
            />
          )}
        />
        <Controller
          control={control}
          name="jumping"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.jumping}
              helperText={errors.jumping?.message}
              margin="normal"
              label="Dikey Sıçrama"
              type="number"
            />
          )}
        />
        <Controller
          control={control}
          name="flexibility"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.flexibility}
              helperText={errors.flexibility?.message}
              margin="normal"
              label="Esneklik"
              type="number"
            />
          )}
        />
      </Box>
    </Edit>
  );
};
