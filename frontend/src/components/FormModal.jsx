
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

const FormModal = ({
open,
title = "Add Book",
fields = [],
values = {},
onChange,
onSubmit,
onClose,
submitLabel = "Add"
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Box component="form" sx={{ mt: 1 }}>
        {fields.map((field) => (
          field.type === 'date' ? (
            <TextField
              key={field.name}
              margin="dense"
              name={field.name}
              label={field.label}
              type="date"
              fullWidth
              value={values[field.name] || ""}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />
          ) : (
            <TextField
              key={field.name}
              margin="dense"
              name={field.name}
              label={field.label}
              type={field.type || "text"}
              fullWidth
              value={values[field.name] || ""}
              onChange={onChange}
            />
          )
        ))}
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onSubmit} variant="contained">{submitLabel}</Button>
    </DialogActions>
  </Dialog>
);

export default FormModal;