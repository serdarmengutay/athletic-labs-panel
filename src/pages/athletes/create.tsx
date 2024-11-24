import type { HttpError } from "@refinedev/core";
import { Create } from "@refinedev/mui";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import type { IAthlete, Nullable } from "../../interfaces";

export const AthleteCreate: React.FC = () => {
  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
  } = useForm<IAthlete, HttpError, Nullable<IAthlete>>();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("athleteName", {
            required: "This field is required",
          })}
          error={!!errors.athleteName}
          helperText={errors.athleteName?.message}
          margin="normal"
          fullWidth
          label="Adı Soyadı"
          name="athleteName"
          autoFocus
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
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
        {/* <Controller
          control={control}
          name="category"
          rules={{ required: "This field is required" }}
          // eslint-disable-next-line
          defaultValue={null as any}
          render={({ field }) => (
            <Autocomplete
              {...autocompleteProps}
              {...field}
              onChange={(_, value) => {
                field.onChange(value);
              }}
              getOptionLabel={(item) => {
                return (
                  autocompleteProps?.options?.find(
                    (p) => p?.id?.toString() === item?.id?.toString()
                  )?.title ?? ""
                );
              }}
              isOptionEqualToValue={(option, value) =>
                value === undefined ||
                option?.id?.toString() === (value?.id ?? value)?.toString()
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  margin="normal"
                  variant="outlined"
                  error={!!errors.category}
                  helperText={errors.category?.message}
                  required
                />
              )}
            />
          )}
        /> */}
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
              InputLabelProps={{
                shrink: true,
              }}
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
              label="Çeviklik"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
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
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="jump"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.jump}
              helperText={errors.jump?.message}
              margin="normal"
              label="Dikey Sıçrama"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
      </Box>
    </Create>
  );
};
