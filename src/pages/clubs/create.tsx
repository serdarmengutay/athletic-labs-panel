import type { HttpError } from "@refinedev/core";
import { Create } from "@refinedev/mui";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import type { IClub, Nullable } from "../../interfaces";

export const ClubCreate: React.FC = () => {
  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
  } = useForm<IClub, HttpError, Nullable<IClub>>();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <Controller
          control={control}
          name="clubName"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.clubName}
              helperText={errors.clubName?.message}
              margin="normal"
              fullWidth
              label="Kulüp Adı"
              autoFocus
            />
          )}
        />
        <Controller
          name="clubLogo"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.clubLogo}
              helperText={errors.clubLogo?.message}
              margin="normal"
              fullWidth
              label="Kulüp Logosu"
              type="image"
            />
          )}
        />
      </Box>
    </Create>
  );
};
